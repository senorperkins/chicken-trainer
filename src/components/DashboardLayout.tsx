import { ReactNode } from 'react'
import { User, Tenant } from '@/lib/types'
import { TenantBanner } from './TenantBanner'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { House, GraduationCap, Calendar, BookOpen, UserCircle } from '@phosphor-icons/react'
import { getUserAvatarUrl } from '@/lib/avatars'
import { cn } from '@/lib/utils'

interface DashboardLayoutProps {
  user: User
  tenant: Tenant
  mode?: 'normal' | 'read_only' | 'maintenance'
  children?: ReactNode
  activeTab?: string
  onTabChange?: (tab: string) => void
  onSignOut?: () => void
}

export function DashboardLayout({ 
  user, 
  tenant, 
  mode = 'normal',
  children,
  activeTab = 'home',
  onTabChange,
  onSignOut
}: DashboardLayoutProps) {
  const avatarUrl = getUserAvatarUrl(user)
  
  const navItems = [
    { id: 'home', icon: House, label: 'Home' },
    { id: 'training', icon: GraduationCap, label: 'Training' },
    { id: 'schedule', icon: Calendar, label: 'Schedule' },
    { id: 'library', icon: BookOpen, label: 'Library' },
  ]
  
  return (
    <div className="min-h-screen bg-background flex flex-col pb-20">
      <TenantBanner tenant={tenant} mode={mode} />
      
      <div className="flex-1 overflow-auto">
        {children}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-card border-t shadow-lg z-50">
        <div className="container mx-auto px-2 py-2">
          <div className="flex items-center justify-around max-w-2xl mx-auto">
            {navItems.map(({ id, icon: Icon, label }) => (
              <Button
                key={id}
                variant="ghost"
                size="sm"
                onClick={() => onTabChange?.(id)}
                className={cn(
                  "flex flex-col items-center gap-1 h-auto py-2 px-3 rounded-lg transition-colors",
                  activeTab === id 
                    ? "text-primary bg-primary/10" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon size={24} weight={activeTab === id ? "fill" : "regular"} />
                <span className="text-xs font-medium">{label}</span>
              </Button>
            ))}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onTabChange?.('profile')}
              className={cn(
                "flex flex-col items-center gap-1 h-auto py-2 px-3 rounded-lg transition-colors",
                activeTab === 'profile' 
                  ? "text-primary bg-primary/10" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Avatar className={cn(
                "w-6 h-6 ring-2 transition-all",
                activeTab === 'profile' ? "ring-primary" : "ring-transparent"
              )}>
                <AvatarImage src={avatarUrl} />
                <AvatarFallback className="text-xs">
                  {user.display_name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs font-medium">Profile</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
