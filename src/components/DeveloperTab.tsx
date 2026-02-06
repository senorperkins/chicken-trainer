import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { User, Tenant, MaintenanceTicket } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { 
  Code, 
  Users, 
  Eye, 
  ArrowCounterClockwise, 
  Sparkle,
  Wrench,
  CheckCircle,
  Clock,
  XCircle,
  ShieldCheck,
  UserFocus,
  UserCircle
} from '@phosphor-icons/react'
import { getUserAvatarUrl } from '@/lib/avatars'
import { toast } from 'sonner'

interface DeveloperTabProps {
  currentUser: User
  onImpersonate: (user: User) => void
}

export function DeveloperTab({ currentUser, onImpersonate }: DeveloperTabProps) {
  const [users] = useKV<User[]>('users', [])
  const [tenants] = useKV<Tenant[]>('tenants', [])
  const [maintenanceTickets] = useKV<MaintenanceTicket[]>('maintenance_tickets', [])
  const [deviceAccessLogs] = useKV<Array<{ device: string; timestamp: string }>>('device_access_logs', [])
  const [impersonatedUserId] = useKV<string | null>('impersonated_user_id', null)
  
  const [selectedTenant, setSelectedTenant] = useState<string | null>(null)

  const filteredUsers = selectedTenant 
    ? (users || []).filter(u => u.tenant_id === selectedTenant)
    : (users || [])

  const openTickets = (maintenanceTickets || []).filter(t => t.status === 'open' || t.status === 'in_progress')

  const mobileAccessCount = (deviceAccessLogs || []).filter(log => log.device === 'mobile').length
  const tabletAccessCount = (deviceAccessLogs || []).filter(log => log.device === 'tablet').length
  const desktopAccessCount = (deviceAccessLogs || []).filter(log => log.device === 'desktop').length

  const getTicketStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'destructive'
      case 'in_progress': return 'default'
      case 'resolved': return 'secondary'
      case 'closed': return 'outline'
      default: return 'outline'
    }
  }

  const getTicketStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <Clock size={16} />
      case 'in_progress': return <Wrench size={16} />
      case 'resolved': return <CheckCircle size={16} />
      case 'closed': return <XCircle size={16} />
      default: return <Clock size={16} />
    }
  }

  const handleImpersonate = (user: User) => {
    onImpersonate(user)
    toast.success(`Now viewing as ${user.display_name}`)
  }

  return (
    <div className="container mx-auto py-6 px-4 space-y-6 max-w-7xl">
      <Alert className="bg-destructive/10 border-destructive">
        <Code className="h-4 w-4" />
        <AlertDescription>
          <strong>Developer Mode Active</strong> - You have read-only access to all tenant data. Use impersonation to test user experiences.
          {impersonatedUserId && (
            <span className="ml-2 text-sm">
              Currently impersonating user {impersonatedUserId}
            </span>
          )}
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users size={24} className="text-primary" />
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{(users || []).length}</p>
            <p className="text-sm text-muted-foreground mt-2">
              Across {(tenants || []).length} tenants
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench size={24} className="text-warning" />
              Open Tickets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{openTickets.length}</p>
            <p className="text-sm text-muted-foreground mt-2">
              Maintenance requests
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Device Access</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Mobile</span>
              <span className="font-bold">{mobileAccessCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Tablet</span>
              <span className="font-bold">{tabletAccessCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Desktop</span>
              <span className="font-bold">{desktopAccessCount}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code size={24} className="text-success" />
              Developer ID
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-mono">{currentUser.id}</p>
            <p className="text-sm text-muted-foreground mt-2">
              Your developer account
            </p>
          </CardContent>
        </Card>
      </div>

      {openTickets.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Maintenance Requests</CardTitle>
            <CardDescription>
              Outstanding requests from tenant owners and managers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {openTickets.map((ticket) => {
              const requestedBy = users?.find(u => u.id === ticket.requested_by_user_id)
              const tenant = tenants?.find(t => t.id === ticket.tenant_id)
              
              return (
                <Card key={ticket.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={getTicketStatusColor(ticket.status)}>
                            {getTicketStatusIcon(ticket.status)}
                            {ticket.status}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {tenant?.name || 'Unknown Tenant'}
                          </span>
                        </div>
                        <p className="text-sm mb-2">{ticket.reason_text}</p>
                        <p className="text-xs text-muted-foreground">
                          Requested by {requestedBy?.display_name || 'Unknown'} on{' '}
                          {new Date(ticket.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>User Impersonation</CardTitle>
          <CardDescription>
            View the application as any user to test functionality and troubleshoot issues
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedTenant === null ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTenant(null)}
            >
              All Tenants
            </Button>
            {(tenants || []).map((tenant) => (
              <Button
                key={tenant.id}
                variant={selectedTenant === tenant.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedTenant(tenant.id)}
              >
                {tenant.name}
              </Button>
            ))}
          </div>

          <Separator />

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredUsers
              .filter(u => u.role !== 'Developer')
              .map((user) => {
                const tenant = tenants?.find(t => t.id === user.tenant_id)
                const avatarUrl = getUserAvatarUrl(user)
                const isCurrentlyImpersonated = impersonatedUserId === user.id
                
                return (
                  <div
                    key={user.id}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                      isCurrentlyImpersonated 
                        ? 'bg-primary/10 border-primary' 
                        : 'hover:bg-muted'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={avatarUrl} />
                        <AvatarFallback>
                          {user.display_name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.display_name}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{user.role}</span>
                          <span>•</span>
                          <span>{tenant?.name || 'Unknown Tenant'}</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant={isCurrentlyImpersonated ? 'outline' : 'default'}
                      onClick={() => handleImpersonate(user)}
                      disabled={isCurrentlyImpersonated}
                    >
                      {isCurrentlyImpersonated ? (
                        <>
                          <Eye size={16} />
                          Active
                        </>
                      ) : (
                        <>
                          <ArrowCounterClockwise size={16} />
                          Impersonate
                        </>
                      )}
                    </Button>
                  </div>
                )
              })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
