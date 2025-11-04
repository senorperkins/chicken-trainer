import { User, Assignment, BadgeAward, Schedule } from '@/lib/types'
import { NameBadge } from './NameBadge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle, Clock, Warning, ArrowRight } from '@phosphor-icons/react'

interface HomeTabProps {
  user: User
  assignments: Assignment[]
  badges: BadgeAward[]
  nextShift?: Schedule
  onNavigate: (tab: string) => void
}

export function HomeTab({ user, assignments, badges, nextShift, onNavigate }: HomeTabProps) {
  const openAssignments = assignments.filter(a => a.status !== 'completed')
  const completedToday = assignments.filter(a => {
    if (!a.completed_at) return false
    const completedDate = new Date(a.completed_at)
    const today = new Date()
    return completedDate.toDateString() === today.toDateString()
  }).length

  const todayGoalProgress = openAssignments.length > 0 
    ? Math.round((completedToday / (completedToday + openAssignments.length)) * 100)
    : 100

  const formatNextShift = () => {
    if (!nextShift) return undefined
    const start = new Date(nextShift.shift_start)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    if (start.toDateString() === today.toDateString()) {
      return `Today at ${start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`
    } else if (start.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow at ${start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`
    } else {
      return start.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
    }
  }

  const upcomingAssignments = openAssignments.slice(0, 3)
  const overdueAssignments = openAssignments.filter(a => {
    if (!a.due_date) return false
    return new Date(a.due_date) < new Date()
  })

  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      <NameBadge
        user={user}
        todayGoalProgress={todayGoalProgress}
        nextShift={formatNextShift()}
        openTrainings={openAssignments.length}
        earnedBadges={badges.length}
      />

      {overdueAssignments.length > 0 && (
        <Card className="border-warning bg-warning/5">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Warning size={24} className="text-warning" />
              <CardTitle>Overdue Trainings</CardTitle>
            </div>
            <CardDescription>
              You have {overdueAssignments.length} training{overdueAssignments.length !== 1 ? 's' : ''} past the due date
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => onNavigate('training')} className="w-full sm:w-auto">
              View Overdue Trainings
              <ArrowRight />
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
            <CardDescription>Your progress at a glance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle size={24} className="text-success" />
                <span className="font-medium">Completed Today</span>
              </div>
              <span className="text-2xl font-bold text-success">{completedToday}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <Clock size={24} className="text-primary" />
                <span className="font-medium">Active Trainings</span>
              </div>
              <span className="text-2xl font-bold text-primary">{openAssignments.length}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <div className="text-2xl">🏆</div>
                <span className="font-medium">Total Badges</span>
              </div>
              <span className="text-2xl font-bold">{badges.length}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Trainings</CardTitle>
            <CardDescription>What's on your learning path</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingAssignments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle size={48} className="mx-auto mb-2 text-success" />
                <p>All caught up!</p>
                <p className="text-sm">No active trainings at the moment</p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingAssignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium">Training Assignment</p>
                      {assignment.due_date && (
                        <p className="text-sm text-muted-foreground">
                          Due: {new Date(assignment.due_date).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <Badge variant={assignment.status === 'overdue' ? 'destructive' : 'default'}>
                      {assignment.status}
                    </Badge>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => onNavigate('training')}
                >
                  View All Trainings
                  <ArrowRight />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
