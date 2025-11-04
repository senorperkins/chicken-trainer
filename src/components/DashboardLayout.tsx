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
    <div className="min-h-screen bg-background flex flex-col pb-16 border-[3px] border-primary m-2 rounded-lg overflow-hidden">
      <TenantBanner tenant={tenant} mode={mode} />
      
      <div className="flex-1 overflow-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <style>{`
          .overflow-auto::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        {children}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-primary shadow-lg z-50 border-t-2 border-primary">
        <div className="relative">
          <div className="absolute left-1/2 -translate-x-1/2 -top-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onTabChange?.('home')}
              className={cn(
                "flex items-center justify-center rounded-full transition-all shadow-xl",
                "w-16 h-16 p-0 bg-background hover:bg-background/90 hover:scale-105 active:scale-95",
                activeTab === 'home' 
                  ? "text-primary ring-2 ring-primary-foreground" 
                  : "text-primary hover:text-primary/80"
              )}
            >
              <House size={28} weight={activeTab === 'home' ? "fill" : "regular"} />
            </Button>
          </div>
          
          <svg className="absolute top-0 left-0 w-full h-8 pointer-events-none" preserveAspectRatio="none" viewBox="0 0 375 32">
            <path 
              d="M 0,32 L 0,32 C 0,32 140,32 155,32 C 160,32 165,28 170,20 C 175,12 180,0 187.5,0 C 195,0 200,12 205,20 C 210,28 215,32 220,32 C 235,32 375,32 375,32 L 375,32 Z" 
              fill="var(--color-primary)"
              stroke="var(--color-primary)"
              strokeWidth="2"
            />
          </svg>
          
          <div className="flex items-end justify-around px-4 py-2 pt-3">
            {navItems.map(({ id, icon: Icon, label, isCenter }) => {
              if (isCenter) {
                return <div key={id} className="w-12 h-12" />
              }
              
              return (
                <Button
                  key={id}
                  variant="ghost"
                  size="sm"
                  onClick={() => onTabChange?.(id)}
                  className={cn(
                    "flex items-center justify-center rounded-full transition-all",
                    "w-12 h-12 p-0 bg-background hover:bg-background/90 hover:scale-110 hover:-translate-y-1 active:scale-95",
                    activeTab === id 
                      ? "text-primary ring-2 ring-primary-foreground shadow-md" 
                      : "text-primary hover:text-primary/80 shadow-sm"
                  )}
                >
                  <Icon size={22} weight={activeTab === id ? "fill" : "regular"} />
                </Button>
              )
            })}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onTabChange?.('profile')}
              className={cn(
                "flex items-center justify-center rounded-full transition-all",
                "w-12 h-12 p-0 bg-background hover:bg-background/90 hover:scale-110 hover:-translate-y-1 active:scale-95",
                activeTab === 'profile' 
                  ? "ring-2 ring-primary-foreground shadow-md" 
                  : "shadow-sm"
              )}
            >
              <Avatar className={cn(
                "w-7 h-7 ring-2 transition-all",
                activeTab === 'profile' ? "ring-primary-foreground" : "ring-transparent"
              )}>
                <AvatarImage src={avatarUrl} />
                <AvatarFallback className="text-xs bg-background text-primary">
                  {user.display_name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
