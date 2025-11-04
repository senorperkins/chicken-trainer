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
import { DeveloperTab } from '@/components/DeveloperTab'
import { Toaster } from '@/components/ui/sonner'
import { ensureSeedData } from '@/lib/seed-data'

function App() {
  const [currentUser, setCurrentUser] = useKV<User | null>('current_user', null)
  const [currentTenant, setCurrentTenant] = useKV<Tenant | null>('current_tenant', null)
  const [showOnboarding, setShowOnboarding] = useKV<boolean>('show_onboarding', true)
  const [activeTab, setActiveTab] = useKV<string>('active_tab', 'home')
  const [impersonatedUserId, setImpersonatedUserId] = useKV<string | null>('impersonated_user_id', null)
  const [dataInitialized, setDataInitialized] = useState(false)
  
  const [users] = useKV<User[]>('users', [])
  const [assignments] = useKV<Assignment[]>('assignments', [])
  const [trainings] = useKV<Training[]>('trainings', [])
  const [badgeAwards] = useKV<BadgeAward[]>('badge_awards', [])
  const [badges] = useKV<Badge[]>('badges', [])
  const [schedules] = useKV<Schedule[]>('schedules', [])
  
  const [appearanceSettings] = useKV<{ theme: 'light' | 'dark' | 'system' }>('appearance_settings', { theme: 'system' })

  const isDeveloper = currentUser?.role === 'Developer'
  const viewingUser = isDeveloper && impersonatedUserId
    ? users?.find(u => u.id === impersonatedUserId) || currentUser
    : currentUser

  useEffect(() => {
    ensureSeedData().then(() => setDataInitialized(true))
  }, [])

  useEffect(() => {
    if (currentUser && users) {
      const updatedUser = users.find(u => u.id === currentUser.id)
      if (updatedUser && JSON.stringify(updatedUser) !== JSON.stringify(currentUser)) {
        setCurrentUser(updatedUser)
      }
    }
  }, [users])

  useEffect(() => {
    if (appearanceSettings) {
      const theme = appearanceSettings.theme
      if (theme === 'system') {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        document.documentElement.classList.toggle('dark', isDark)
      } else {
        document.documentElement.classList.toggle('dark', theme === 'dark')
      }
    }
  }, [appearanceSettings])

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
    setActiveTab('home')
    setImpersonatedUserId(null)
  }

  const handleImpersonate = (user: User) => {
    setImpersonatedUserId(user.id)
    setActiveTab('home')
  }

  const handleStopImpersonating = () => {
    setImpersonatedUserId(null)
    setActiveTab('developer')
  }

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
  }

  if (!currentUser || !currentTenant) {
    if (!dataInitialized) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Initializing...</p>
          </div>
        </div>
      )
    }
    return <AuthFlow onAuthenticated={handleAuthenticated} />
  }

  const displayUser = viewingUser || currentUser
  const userAssignments = (assignments || []).filter(a => a.user_id === displayUser.id)
  const userBadgeAwards = (badgeAwards || []).filter(ba => ba.user_id === displayUser.id)
  const userSchedules = (schedules || []).filter(s => s.user_id === displayUser.id)

  const nextShift = userSchedules
    .filter(s => new Date(s.shift_start) > new Date())
    .sort((a, b) => new Date(a.shift_start).getTime() - new Date(b.shift_start).getTime())[0]

  return (
    <>
      {showOnboarding && !isDeveloper && (
        <OnboardingTutorial
          userName={displayUser.display_name.split(' ')[0]}
          onComplete={handleOnboardingComplete}
        />
      )}
      
      <DashboardLayout
        user={displayUser}
        tenant={currentTenant}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onSignOut={handleSignOut}
        isDeveloper={isDeveloper}
        isImpersonating={impersonatedUserId !== null}
        onStopImpersonating={handleStopImpersonating}
      >
        {activeTab === 'home' && (
          <HomeTab
            user={displayUser}
            assignments={userAssignments}
            badges={userBadgeAwards}
            nextShift={nextShift}
            onNavigate={handleTabChange}
          />
        )}
        
        {activeTab === 'training' && (
          <TrainingTab
            user={displayUser}
            assignments={userAssignments}
            trainings={trainings || []}
          />
        )}
        
        {activeTab === 'schedule' && (
          <ScheduleTab
            user={displayUser}
            schedules={userSchedules}
          />
        )}
        
        {activeTab === 'library' && (
          <LibraryTab trainings={trainings || []} />
        )}
        
        {activeTab === 'profile' && (
          <ProfileTab
            user={displayUser}
            badges={userBadgeAwards}
            badgeDefinitions={badges || []}
            onSignOut={handleSignOut}
          />
        )}

        {activeTab === 'developer' && isDeveloper && (
          <DeveloperTab
            currentUser={currentUser}
            onImpersonate={handleImpersonate}
          />
        )}
      </DashboardLayout>
      
      <Toaster />
    </>
  )
}

export default App