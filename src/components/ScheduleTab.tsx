import { Schedule, User } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, MapPin } from '@phosphor-icons/react'

interface ScheduleTabProps {
  user: User
  schedules: Schedule[]
}

export function ScheduleTab({ user, schedules }: ScheduleTabProps) {
  const upcomingShifts = schedules
    .filter(s => new Date(s.shift_end) >= new Date())
    .sort((a, b) => new Date(a.shift_start).getTime() - new Date(b.shift_start).getTime())

  const groupShiftsByDate = () => {
    const groups: Record<string, Schedule[]> = {}
    upcomingShifts.forEach(shift => {
      const date = new Date(shift.shift_start).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(shift)
    })
    return groups
  }

  const shiftsByDate = groupShiftsByDate()

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    })
  }

  const calculateDuration = (start: string, end: string) => {
    const duration = (new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60)
    return duration.toFixed(1)
  }

  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold mb-2">My Schedule</h1>
        <p className="text-muted-foreground">
          View your upcoming shifts and request changes
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Shifts</CardTitle>
          <CardDescription>
            {upcomingShifts.length} shift{upcomingShifts.length !== 1 ? 's' : ''} scheduled
          </CardDescription>
        </CardHeader>
        <CardContent>
          {upcomingShifts.length === 0 ? (
            <div className="py-12 text-center">
              <Calendar size={48} className="mx-auto mb-3 text-muted-foreground" />
              <p className="text-lg font-medium">No upcoming shifts</p>
              <p className="text-sm text-muted-foreground">Check back later or contact your manager</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(shiftsByDate).map(([date, shifts]) => (
                <div key={date} className="space-y-3">
                  <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                    {date}
                  </h3>
                  {shifts.map((shift) => (
                    <Card key={shift.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                              <Badge>{shift.role_at_shift}</Badge>
                              <Badge variant={shift.type === 'in_store' ? 'default' : 'secondary'}>
                                {shift.type === 'in_store' ? 'In Store' : 'Off Campus'}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center gap-3 text-sm">
                              <span className="flex items-center gap-1">
                                <Clock size={16} />
                                {formatTime(shift.shift_start)} - {formatTime(shift.shift_end)}
                              </span>
                              <span className="text-muted-foreground">
                                ({calculateDuration(shift.shift_start, shift.shift_end)} hours)
                              </span>
                            </div>
                            
                            {shift.type === 'off_campus' && shift.off_campus_location && (
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <MapPin size={16} />
                                {shift.off_campus_location}
                              </div>
                            )}
                          </div>
                          
                          <Button variant="outline" size="sm">
                            Request Swap
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Shift Swap Pool</CardTitle>
          <CardDescription>
            Available shifts from your coworkers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center text-muted-foreground">
            <p>No shifts available for pickup at this time</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
