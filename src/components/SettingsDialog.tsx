import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Gear, Bell, Palette } from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'

interface NotificationSettings {
  assignments: boolean
  badges: boolean
  scheduleChanges: boolean
  actionsNeeded: boolean
}

interface AppearanceSettings {
  theme: 'light' | 'dark' | 'system'
}

interface SettingsDialogProps {
  triggerVariant?: 'default' | 'outline' | 'ghost'
}

export function SettingsDialog({ triggerVariant = 'outline' }: SettingsDialogProps) {
  const [open, setOpen] = useState(false)
  
  const [notificationSettings, setNotificationSettings] = useKV<NotificationSettings>('notification_settings', {
    assignments: true,
    badges: true,
    scheduleChanges: true,
    actionsNeeded: true
  })
  
  const [appearanceSettings, setAppearanceSettings] = useKV<AppearanceSettings>('appearance_settings', {
    theme: 'system'
  })

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotificationSettings((current) => ({
      ...(current || { assignments: true, badges: true, scheduleChanges: true, actionsNeeded: true }),
      [key]: value
    }))
  }

  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    setAppearanceSettings((current) => ({
      ...(current || { theme: 'system' }),
      theme
    }))
    
    if (theme === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      document.documentElement.classList.toggle('dark', isDark)
    } else {
      document.documentElement.classList.toggle('dark', theme === 'dark')
    }
    
    toast.success(`Theme set to ${theme}`)
  }

  const handleSave = () => {
    toast.success('Settings saved successfully!')
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={triggerVariant} size="lg" className="gap-2">
          <Gear size={20} />
          Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Manage your notification and appearance preferences
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Bell size={24} className="text-primary" />
              <h3 className="text-lg font-semibold">Notification Settings</h3>
            </div>
            
            <div className="space-y-4 pl-8">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notif-assignments">New Assignments</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when new trainings are assigned to you
                  </p>
                </div>
                <Switch
                  id="notif-assignments"
                  checked={notificationSettings?.assignments ?? true}
                  onCheckedChange={(checked) => handleNotificationChange('assignments', checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notif-badges">Badge Awards</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when you earn a new badge
                  </p>
                </div>
                <Switch
                  id="notif-badges"
                  checked={notificationSettings?.badges ?? true}
                  onCheckedChange={(checked) => handleNotificationChange('badges', checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notif-schedule">Schedule Changes</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified about shift changes and swap approvals
                  </p>
                </div>
                <Switch
                  id="notif-schedule"
                  checked={notificationSettings?.scheduleChanges ?? true}
                  onCheckedChange={(checked) => handleNotificationChange('scheduleChanges', checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notif-actions">Actions Needed</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when your action is required
                  </p>
                </div>
                <Switch
                  id="notif-actions"
                  checked={notificationSettings?.actionsNeeded ?? true}
                  onCheckedChange={(checked) => handleNotificationChange('actionsNeeded', checked)}
                />
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Palette size={24} className="text-primary" />
              <h3 className="text-lg font-semibold">Appearance</h3>
            </div>
            
            <div className="space-y-4 pl-8">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="theme-light">Light Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Use light theme at all times
                  </p>
                </div>
                <Switch
                  id="theme-light"
                  checked={appearanceSettings?.theme === 'light'}
                  onCheckedChange={(checked) => checked && handleThemeChange('light')}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="theme-dark">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Use dark theme at all times
                  </p>
                </div>
                <Switch
                  id="theme-dark"
                  checked={appearanceSettings?.theme === 'dark'}
                  onCheckedChange={(checked) => checked && handleThemeChange('dark')}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="theme-system">System Default</Label>
                  <p className="text-sm text-muted-foreground">
                    Follow system theme preferences
                  </p>
                </div>
                <Switch
                  id="theme-system"
                  checked={appearanceSettings?.theme === 'system'}
                  onCheckedChange={(checked) => checked && handleThemeChange('system')}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
          <Button onClick={handleSave}>
            Save Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
