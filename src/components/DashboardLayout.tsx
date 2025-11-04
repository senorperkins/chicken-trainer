import { ReactNode } from 'react'
import { User, Tenant } from '@/lib/types'
import { TenantBanner } from './TenantBanner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { House, GraduationCap, Calendar, BookOpen, UserCircle } from '@phosphor-icons/react'

interface DashboardLayoutProps {
  user: User
  tenant: Tenant
  mode?: 'normal' | 'read_only' | 'maintenance'
  children?: ReactNode
  activeTab?: string
  onTabChange?: (tab: string) => void
}

export function DashboardLayout({ 
  user, 
  tenant, 
  mode = 'normal',
  children,
  activeTab = 'home',
  onTabChange
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TenantBanner tenant={tenant} mode={mode} />
      
      <div className="flex-1 flex flex-col">
        <Tabs value={activeTab} onValueChange={onTabChange} className="flex-1 flex flex-col">
          <div className="border-b bg-card">
            <div className="container mx-auto">
              <TabsList className="w-full justify-start h-auto p-0 bg-transparent rounded-none border-0">
                <TabsTrigger 
                  value="home" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3 gap-2"
                >
                  <House />
                  <span className="hidden sm:inline">Home</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="training"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3 gap-2"
                >
                  <GraduationCap />
                  <span className="hidden sm:inline">Training</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="schedule"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3 gap-2"
                >
                  <Calendar />
                  <span className="hidden sm:inline">Schedule</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="library"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3 gap-2"
                >
                  <BookOpen />
                  <span className="hidden sm:inline">Library</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="profile"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3 gap-2"
                >
                  <UserCircle />
                  <span className="hidden sm:inline">Profile</span>
                </TabsTrigger>
              </TabsList>
            </div>
          </div>
          
          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </Tabs>
      </div>
    </div>
  )
}
