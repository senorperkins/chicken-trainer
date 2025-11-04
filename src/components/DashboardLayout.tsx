import { ReactNode } from 'react'
import { User, Tenant } from '@/lib/types'
import { TenantBanner } from './TenantBanner'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { House, GraduationCap, Calendar, BookOpen } from '@phosphor-icons/react'
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
    { id: 'training', icon: GraduationCap, label: 'Training' },
    { id: 'library', icon: BookOpen, label: 'Library' },
    { id: 'home', icon: House, label: 'Home', isCenter: true },
    { id: 'schedule', icon: Calendar, label: 'Schedule' },
  ]
  
  return (
    <div className="min-h-screen bg-background flex flex-col pb-20 border-[3px] border-primary m-2 rounded-lg overflow-hidden">
      <TenantBanner tenant={tenant} mode={mode} />
      
      <div className="flex-1 overflow-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <style>{`
          .overflow-auto::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        {children}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-primary shadow-lg z-50 m-2 rounded-lg">
        <div className="container mx-auto px-2 py-3">
          <div className="flex items-center justify-around max-w-2xl mx-auto gap-2">
            {navItems.map(({ id, icon: Icon, label, isCenter }) => {
              if (isCenter) {
                return (
                  <Button
                    key={id}
                    variant="ghost"
                    size="sm"
                    onClick={() => onTabChange?.(id)}
                    className={cn(
                      "flex flex-col items-center gap-1 h-auto p-3 rounded-full transition-all",
                      "w-16 h-16 bg-background hover:bg-background/90",
                      activeTab === id 
                        ? "text-primary ring-2 ring-primary-foreground" 
                        : "text-primary hover:text-primary/80"
                    )}
                  >
                    <Icon size={28} weight={activeTab === id ? "fill" : "regular"} />
                  </Button>
                )
              }
              
              return (
                <Button
                  key={id}
                  variant="ghost"
                  size="sm"
                  onClick={() => onTabChange?.(id)}
                  className={cn(
                    "flex flex-col items-center gap-1 h-auto py-2 px-3 rounded-lg transition-colors",
                    "bg-background hover:bg-background/90",
                    activeTab === id 
                      ? "text-primary ring-2 ring-primary-foreground" 
                      : "text-primary hover:text-primary/80"
                  )}
                >
                  <Icon size={24} weight={activeTab === id ? "fill" : "regular"} />
                  <span className="text-xs font-medium">{label}</span>
                </Button>
              )
            })}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onTabChange?.('profile')}
              className={cn(
                "flex flex-col items-center gap-1 h-auto py-2 px-3 rounded-lg transition-colors",
                "bg-background hover:bg-background/90",
                activeTab === 'profile' 
                  ? "ring-2 ring-primary-foreground" 
                  : ""
              )}
            >
              <Avatar className={cn(
                "w-6 h-6 ring-2 transition-all",
                activeTab === 'profile' ? "ring-primary-foreground" : "ring-transparent"
              )}>
                <AvatarImage src={avatarUrl} />
                <AvatarFallback className="text-xs bg-background text-primary">
                  {user.display_name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs font-medium text-primary">Profile</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
