import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { User, Tenant, Assignment, Training, BadgeAward, Badge, Schedule } from '@/lib/types'
import { AuthFlow } from '@/components/AuthFlow'
import { OnboardingTutorial } from '@/components/OnboardingTutorial'
import { DashboardLayout } from '@/components/DashboardLayout'
import { HomeTab } from '@/components/HomeTab'
import { TrainingTab } from '@/components/TrainingTab'
import { ScheduleTab } from '@/components/ScheduleTab'
import { LibraryTab } from '@/components/LibraryTab'
import { ProfileTab } from '@/components/ProfileTab'
import { Toaster } from '@/components/ui/sonner'

function App() {
  const [currentUser, setCurrentUser] = useKV<User | null>('current_user', null)
  const [currentTenant, setCurrentTenant] = useKV<Tenant | null>('current_tenant', null)
  const [showOnboarding, setShowOnboarding] = useKV<boolean>('show_onboarding', true)
  const [activeTab, setActiveTab] = useKV<string>('active_tab', 'home')
  
  const [assignments] = useKV<Assignment[]>('assignments', [])
  const [trainings] = useKV<Training[]>('trainings', [])
  const [badgeAwards] = useKV<BadgeAward[]>('badge_awards', [])
  const [badges] = useKV<Badge[]>('badges', [])
  const [schedules] = useKV<Schedule[]>('schedules', [])

  const handleAuthenticated = (user: User, tenant: Tenant) => {
    setCurrentUser(user)
    setCurrentTenant(tenant)
  }

  const handleOnboardingComplete = () => {
    setShowOnboarding(false)
  }

  const handleSignOut = () => {
    setCurrentUser(null)
    setCurrentTenant(null)
  }

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
  }

  if (!currentUser || !currentTenant) {
    return <AuthFlow onAuthenticated={handleAuthenticated} />
  }

  const userAssignments = (assignments || []).filter(a => a.user_id === currentUser.id)
  const userBadgeAwards = (badgeAwards || []).filter(ba => ba.user_id === currentUser.id)
  const userSchedules = (schedules || []).filter(s => s.user_id === currentUser.id)

  const nextShift = userSchedules
    .filter(s => new Date(s.shift_start) > new Date())
    .sort((a, b) => new Date(a.shift_start).getTime() - new Date(b.shift_start).getTime())[0]

  return (
    <>
      {showOnboarding && (
        <OnboardingTutorial
          userName={currentUser.display_name.split(' ')[0]}
          onComplete={handleOnboardingComplete}
        />
      )}
      
      <DashboardLayout
        user={currentUser}
        tenant={currentTenant}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onSignOut={handleSignOut}
      >
        {activeTab === 'home' && (
          <HomeTab
            user={currentUser}
            assignments={userAssignments}
            badges={userBadgeAwards}
            nextShift={nextShift}
            onNavigate={handleTabChange}
          />
        )}
        
        {activeTab === 'training' && (
          <TrainingTab
            user={currentUser}
            assignments={userAssignments}
            trainings={trainings || []}
          />
        )}
        
        {activeTab === 'schedule' && (
          <ScheduleTab
            user={currentUser}
            schedules={userSchedules}
          />
        )}
        
        {activeTab === 'library' && (
          <LibraryTab trainings={trainings || []} />
        )}
        
        {activeTab === 'profile' && (
          <ProfileTab
            user={currentUser}
            badges={userBadgeAwards}
            badgeDefinitions={badges || []}
          />
        )}
      </DashboardLayout>
      
      <Toaster />
    </>
  )
}

export default App