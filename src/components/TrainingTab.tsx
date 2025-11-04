import { Assignment, Training, User } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CheckCircle, Clock, Warning, BookOpen } from '@phosphor-icons/react'
import { Progress } from '@/components/ui/progress'

interface TrainingTabProps {
  user: User
  assignments: Assignment[]
  trainings: Training[]
}

export function TrainingTab({ user, assignments, trainings }: TrainingTabProps) {
  const activeAssignments = assignments.filter(a => a.status !== 'completed')
  const completedAssignments = assignments.filter(a => a.status === 'completed')
  const overdueAssignments = activeAssignments.filter(a => {
    if (!a.due_date) return false
    return new Date(a.due_date) < new Date()
  })

  const getTrainingForAssignment = (assignment: Assignment) => {
    return trainings.find(t => t.id === assignment.training_id)
  }

  const completionRate = assignments.length > 0
    ? Math.round((completedAssignments.length / assignments.length) * 100)
    : 0

  const renderAssignmentCard = (assignment: Assignment) => {
    const training = getTrainingForAssignment(assignment)
    const isOverdue = assignment.due_date && new Date(assignment.due_date) < new Date()
    
    return (
      <Card key={assignment.id} className={isOverdue ? 'border-warning' : ''}>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="text-lg">
                {training?.title || 'Training Module'}
              </CardTitle>
              <CardDescription>
                {training?.description || 'Complete this training module'}
              </CardDescription>
            </div>
            <Badge variant={isOverdue ? 'destructive' : 'default'}>
              {assignment.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {training?.tags && training.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {training.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {training?.estimated_time_minutes && (
              <span className="flex items-center gap-1">
                <Clock size={16} />
                {training.estimated_time_minutes} min
              </span>
            )}
            {assignment.due_date && (
              <span className={isOverdue ? 'text-warning font-medium' : ''}>
                Due: {new Date(assignment.due_date).toLocaleDateString()}
              </span>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button className="flex-1">
              {assignment.status === 'completed' ? 'Review' : 'Continue Training'}
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold mb-2">My Training</h1>
        <p className="text-muted-foreground">
          Track your progress and complete assigned trainings
        </p>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className="text-2xl font-bold text-primary">{completionRate}%</span>
          </div>
          <Progress value={completionRate} className="h-3" />
          <div className="grid grid-cols-3 gap-4 pt-2">
            <div className="text-center">
              <div className="text-2xl font-bold">{completedAssignments.length}</div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{activeAssignments.length}</div>
              <div className="text-xs text-muted-foreground">Active</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-warning">{overdueAssignments.length}</div>
              <div className="text-xs text-muted-foreground">Overdue</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">
            Active ({activeAssignments.length})
          </TabsTrigger>
          <TabsTrigger value="overdue">
            Overdue ({overdueAssignments.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedAssignments.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="space-y-4 mt-6">
          {activeAssignments.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <CheckCircle size={48} className="mx-auto mb-3 text-success" />
                <p className="text-lg font-medium">All caught up!</p>
                <p className="text-sm text-muted-foreground">No active trainings at the moment</p>
              </CardContent>
            </Card>
          ) : (
            activeAssignments.map(renderAssignmentCard)
          )}
        </TabsContent>
        
        <TabsContent value="overdue" className="space-y-4 mt-6">
          {overdueAssignments.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <CheckCircle size={48} className="mx-auto mb-3 text-success" />
                <p className="text-lg font-medium">No overdue trainings</p>
                <p className="text-sm text-muted-foreground">You're on track!</p>
              </CardContent>
            </Card>
          ) : (
            overdueAssignments.map(renderAssignmentCard)
          )}
        </TabsContent>
        
        <TabsContent value="completed" className="space-y-4 mt-6">
          {completedAssignments.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <BookOpen size={48} className="mx-auto mb-3 text-muted-foreground" />
                <p className="text-lg font-medium">No completed trainings yet</p>
                <p className="text-sm text-muted-foreground">Start your learning journey!</p>
              </CardContent>
            </Card>
          ) : (
            completedAssignments.map(renderAssignmentCard)
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
