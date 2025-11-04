import { ReactNode } from 'react'
import { User, Tenant } from '@/lib/types'
import { TenantBanner } from './TenantBanner'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { House, GraduationCap, Calendar, BookOpen, SignOut } from '@phosphor-icons/react'
import { getUserAvatarUrl } from '@/lib/avatars'
import { cn } from '@/lib/utils'
import { useIsMobile } from '@/hooks/use-mobile'

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
  const isMobile = useIsMobile()
  const avatarUrl = getUserAvatarUrl(user)
  
  const navItems = [
    { id: 'training', icon: GraduationCap, label: 'Training' },
    { id: 'library', icon: BookOpen, label: 'Library' },
    { id: 'home', icon: House, label: 'Home', isCenter: true },
    { id: 'schedule', icon: Calendar, label: 'Schedule' },
  ]
  
  if (isMobile) {
    return (
      <div className="min-h-screen bg-background flex flex-col pb-14">
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
          <div className="relative h-14">
            <div className="absolute left-1/2 -translate-x-1/2 -top-5 z-10">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onTabChange?.('home')}
                className={cn(
                  "flex items-center justify-center rounded-full transition-all shadow-2xl",
                  "w-16 h-16 p-0 bg-background hover:bg-background/95 hover:scale-105 active:scale-95",
                  "ring-[3px]",
                  activeTab === 'home' 
                    ? "text-primary ring-primary" 
                    : "text-primary/70 hover:text-primary ring-primary"
                )}
              >
                <House size={28} weight={activeTab === 'home' ? "fill" : "regular"} />
              </Button>
            </div>
            
            <svg 
              className="absolute top-0 left-0 w-full h-full pointer-events-none" 
              preserveAspectRatio="none" 
              viewBox="0 0 375 56"
            >
              <defs>
                <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                  <feDropShadow dx="0" dy="-2" stdDeviation="4" floodOpacity="0.1"/>
                </filter>
              </defs>
              <path 
                d="M 0,0 L 0,56 L 375,56 L 375,0 L 220,0 C 215,0 210,3 205,10 C 200,17 195,28 187.5,28 C 180,28 175,17 170,10 C 165,3 160,0 155,0 L 0,0 Z" 
                fill="oklch(0.58 0.21 22)"
                filter="url(#shadow)"
              />
            </svg>
            
            <div className="absolute bottom-2 left-0 right-0 flex items-center justify-around px-6">
              {navItems.map(({ id, icon: Icon, label, isCenter }) => {
                if (isCenter) {
                  return <div key={id} className="w-11" />
                }
                
                return (
                  <Button
                    key={id}
                    variant="ghost"
                    size="sm"
                    onClick={() => onTabChange?.(id)}
                    className={cn(
                      "flex items-center justify-center rounded-full transition-all",
                      "w-11 h-11 p-0 bg-background hover:bg-background/95 hover:scale-110 hover:-translate-y-0.5 active:scale-95",
                      "shadow-lg",
                      activeTab === id 
                        ? "text-primary ring-[2.5px] ring-primary" 
                        : "text-primary/60 hover:text-primary ring-[1.5px] ring-primary/40"
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
                  "w-11 h-11 p-0 bg-background hover:bg-background/95 hover:scale-110 hover:-translate-y-0.5 active:scale-95",
                  "shadow-lg",
                  activeTab === 'profile' 
                    ? "ring-[2.5px] ring-primary" 
                    : "ring-[1.5px] ring-primary/40"
                )}
              >
                <Avatar className="w-7 h-7">
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

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="w-64 border-r border-border bg-card flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={avatarUrl} />
              <AvatarFallback className="text-sm bg-primary text-primary-foreground">
                {user.display_name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{user.display_name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.role}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {[
            { id: 'home', icon: House, label: 'Home' },
            { id: 'training', icon: GraduationCap, label: 'Training' },
            { id: 'schedule', icon: Calendar, label: 'Schedule' },
            { id: 'library', icon: BookOpen, label: 'Library' },
          ].map(({ id, icon: Icon, label }) => (
            <Button
              key={id}
              variant={activeTab === id ? 'default' : 'ghost'}
              onClick={() => onTabChange?.(id)}
              className={cn(
                "w-full justify-start gap-3 transition-all",
                activeTab === id 
                  ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                  : "text-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon size={20} weight={activeTab === id ? "fill" : "regular"} />
              {label}
            </Button>
          ))}
        </nav>

        <div className="p-3 border-t border-border space-y-1">
          <Button
            variant={activeTab === 'profile' ? 'default' : 'ghost'}
            onClick={() => onTabChange?.('profile')}
            className={cn(
              "w-full justify-start gap-3 transition-all",
              activeTab === 'profile'
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "text-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <Avatar className="w-5 h-5">
              <AvatarImage src={avatarUrl} />
              <AvatarFallback className="text-[8px] bg-background text-primary">
                {user.display_name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            Profile
          </Button>
          <Button
            variant="ghost"
            onClick={onSignOut}
            className="w-full justify-start gap-3 text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <SignOut size={20} />
            Sign Out
          </Button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <TenantBanner tenant={tenant} mode={mode} />
        
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  )
}
