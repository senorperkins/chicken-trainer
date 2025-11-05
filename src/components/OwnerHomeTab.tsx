import { useKV } from '@github/spark/hooks'
import { User, Tenant, Assignment, Schedule, Training, AttendanceRecord } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CreateUserDialog } from './CreateUserDialog'
import { Users, GraduationCap, Calendar, Phone } from '@phosphor-icons/react'

interface OwnerHomeTabProps {
  user: User
  tenant: Tenant
}

export function OwnerHomeTab({ user, tenant }: OwnerHomeTabProps) {
  const [users] = useKV<User[]>('users', [])
  const [assignments] = useKV<Assignment[]>('assignments', [])
  const [schedules] = useKV<Schedule[]>('schedules', [])
  const [trainings] = useKV<Training[]>('trainings', [])
  const [attendanceRecords] = useKV<AttendanceRecord[]>('attendance_records', [])
  const [deviceAccessLogs] = useKV<Array<{ device: string; timestamp: string }>>('device_access_logs', [])
  
  const tenantUsers = (users || []).filter(u => u.tenant_id === tenant.id)
  const tenantAssignments = (assignments || []).filter(a => {
    const assignedUser = users?.find(u => u.id === a.user_id)
    return assignedUser?.tenant_id === tenant.id
  })
  const tenantSchedules = (schedules || []).filter(s => {
    const scheduleUser = users?.find(u => u.id === s.user_id)
    return scheduleUser?.tenant_id === tenant.id
  })
  
  const activeTrainingCount = tenantAssignments.filter(a => 
    a.status === 'assigned' || a.status === 'in_progress'
  ).length
  
  const completedThisMonth = tenantAssignments.filter(a => {
    if (!a.completed_at) return false
    const completed = new Date(a.completed_at)
    const now = new Date()
    return completed.getMonth() === now.getMonth() && 
           completed.getFullYear() === now.getFullYear()
  }).length
  
  const callOutsThisWeek = (attendanceRecords || []).filter(ar => {
    if (ar.status !== 'call_out') return false
    const user = users?.find(u => u.id === ar.user_id)
    if (user?.tenant_id !== tenant.id) return false
    const markedDate = new Date(ar.marked_at)
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    return markedDate >= weekAgo && markedDate <= now
  }).length

  const mobileAccessCount = (deviceAccessLogs || []).filter(log => log.device === 'mobile').length
  const tabletAccessCount = (deviceAccessLogs || []).filter(log => log.device === 'tablet').length
  const desktopAccessCount = (deviceAccessLogs || []).filter(log => log.device === 'desktop').length

  const isOwner = user.role === 'Owner'
  const isDistrictManager = user.role === 'District Manager'

  return (
    <div className="container mx-auto py-6 px-4 space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">
            {isOwner ? 'Owner Dashboard' : 'District Manager Dashboard'}
          </h1>
          <p className="text-muted-foreground mt-1">
            Overview of operations for {tenant.name}
          </p>
        </div>
        <CreateUserDialog
          currentUser={user}
          currentTenant={tenant}
          isDeveloper={false}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users size={20} className="text-primary" />
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{tenantUsers.length}</p>
            <p className="text-sm text-muted-foreground mt-2">
              Active team members
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <GraduationCap size={20} className="text-success" />
              Active Training
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{activeTrainingCount}</p>
            <p className="text-sm text-muted-foreground mt-2">
              In progress assignments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar size={20} className="text-accent" />
              Completed This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{completedThisMonth}</p>
            <p className="text-sm text-muted-foreground mt-2">
              Training completions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Phone size={20} className="text-warning" />
              Call Outs (7 days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{callOutsThisWeek}</p>
            <p className="text-sm text-muted-foreground mt-2">
              Shift call outs
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Device Access Metrics</CardTitle>
          <CardDescription>How users are accessing the app</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="font-medium">Mobile</span>
              <span className="text-2xl font-bold text-primary">{mobileAccessCount}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="font-medium">Tablet</span>
              <span className="text-2xl font-bold text-primary">{tabletAccessCount}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="font-medium">Desktop</span>
              <span className="text-2xl font-bold text-primary">{desktopAccessCount}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Training Library Overview</CardTitle>
            <CardDescription>Available training modules</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="font-medium">Total Trainings</span>
                <span className="text-2xl font-bold">{(trainings || []).length}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="font-medium">Completion Rate</span>
                <span className="text-2xl font-bold">
                  {tenantAssignments.length > 0 
                    ? Math.round((tenantAssignments.filter(a => a.status === 'completed').length / tenantAssignments.length) * 100)
                    : 0}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Team Composition</CardTitle>
            <CardDescription>Breakdown by role</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {['Team Member', 'Team Lead', 'General Manager', 'District Manager'].map(role => {
                const count = tenantUsers.filter(u => u.role === role).length
                if (count === 0) return null
                return (
                  <div key={role} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors">
                    <span className="text-sm">{role}</span>
                    <span className="font-semibold">{count}</span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
