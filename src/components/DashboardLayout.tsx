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
    <div className="min-h-screen bg-background flex flex-col pb-12 border-[3px] border-primary m-2 rounded-lg overflow-hidden">
      <TenantBanner tenant={tenant} mode={mode} />
      
      <div className="flex-1 overflow-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <style>{`
          .overflow-auto::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        {children}
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50">
        <div className="relative h-12">
          <div className="absolute left-1/2 -translate-x-1/2 -top-6 z-10">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onTabChange?.('home')}
              className={cn(
                "flex items-center justify-center rounded-full transition-all shadow-xl",
                "w-14 h-14 p-0 bg-background hover:bg-background/90 hover:scale-105 active:scale-95",
                activeTab === 'home' 
                  ? "text-primary ring-[3px] ring-primary" 
                  : "text-primary hover:text-primary/80 ring-[3px] ring-primary"
              )}
            >
              <House size={26} weight={activeTab === 'home' ? "fill" : "regular"} />
            </Button>
          </div>
          
          <svg 
            className="absolute top-0 left-0 w-full h-full pointer-events-none" 
            preserveAspectRatio="none" 
            viewBox="0 0 375 48"
          >
            <path 
              d="M 0,0 L 0,48 L 375,48 L 375,0 C 375,0 235,0 220,0 C 215,0 210,4 205,12 C 200,20 195,32 187.5,32 C 180,32 175,20 170,12 C 165,4 160,0 155,0 C 140,0 0,0 0,0 Z" 
              fill="var(--color-primary)"
            />
            <path 
              d="M 0,0 L 0,48 M 375,0 L 375,48 M 0,0 C 0,0 140,0 155,0 C 160,0 165,4 170,12 C 175,20 180,32 187.5,32 C 195,32 200,20 205,12 C 210,4 215,0 220,0 C 235,0 375,0 375,0" 
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth="3"
            />
          </svg>
          
          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-around px-4 pb-2">
            {navItems.map(({ id, icon: Icon, label, isCenter }) => {
              if (isCenter) {
                return <div key={id} className="w-10" />
              }
              
              return (
                <Button
                  key={id}
                  variant="ghost"
                  size="sm"
                  onClick={() => onTabChange?.(id)}
                  className={cn(
                    "flex items-center justify-center rounded-full transition-all",
                    "w-10 h-10 p-0 bg-background hover:bg-background/90 hover:scale-110 hover:-translate-y-1 active:scale-95",
                    activeTab === id 
                      ? "text-primary ring-[3px] ring-primary shadow-lg" 
                      : "text-primary hover:text-primary/80 shadow-md ring-[2px] ring-primary/30"
                  )}
                >
                  <Icon size={20} weight={activeTab === id ? "fill" : "regular"} />
                </Button>
              )
            })}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onTabChange?.('profile')}
              className={cn(
                "flex items-center justify-center rounded-full transition-all",
                "w-10 h-10 p-0 bg-background hover:bg-background/90 hover:scale-110 hover:-translate-y-1 active:scale-95",
                activeTab === 'profile' 
                  ? "ring-[3px] ring-primary shadow-lg" 
                  : "shadow-md ring-[2px] ring-primary/30"
              )}
            >
              <Avatar className="w-6 h-6">
                <AvatarImage src={avatarUrl} />
                <AvatarFallback className="text-[10px] bg-background text-primary">
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
