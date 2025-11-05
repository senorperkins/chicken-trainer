import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { CircleNotch, DeviceMobile, Desktop, DeviceTablet } from '@phosphor-icons/react'
import { mockGoogleSSO, verifyOOCode, isDeveloperWhitelisted, DEVELOPER_CODE, checkUserExists } from '@/lib/auth'
import { User, Tenant } from '@/lib/types'
import { useIsMobile } from '@/hooks/use-mobile'

interface AuthFlowProps {
  onAuthenticated: (user: User, tenant: Tenant) => void
}

function getDeviceType() {
  const userAgent = navigator.userAgent.toLowerCase()
  const width = window.innerWidth
  
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(userAgent)) {
    return { type: 'tablet' as const, icon: DeviceTablet, label: 'Tablet' }
  }
  
  if (/mobile|iphone|ipod|android|blackberry|opera mini|opera mobi|skyfire|maemo|windows phone|palm|iemobile|symbian|symbianos|fennec/i.test(userAgent)) {
    return { type: 'mobile' as const, icon: DeviceMobile, label: 'Mobile' }
  }
  
  if (width < 768) {
    return { type: 'mobile' as const, icon: DeviceMobile, label: 'Mobile' }
  }
  
  if (width >= 768 && width < 1024) {
    return { type: 'tablet' as const, icon: DeviceTablet, label: 'Tablet' }
  }
  
  return { type: 'desktop' as const, icon: Desktop, label: 'Web' }
}

export function AuthFlow({ onAuthenticated }: AuthFlowProps) {
  const [step, setStep] = useState<'sso' | 'oo_code'>('sso')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>()
  const [ooCode, setOoCode] = useState('')
  const [ssoData, setSsoData] = useState<{ email: string; name: string; avatar: string }>()
  const isMobile = useIsMobile()
  const deviceInfo = getDeviceType()
  const DeviceIcon = deviceInfo.icon

  const handleGoogleSSO = async () => {
    setLoading(true)
    setError(undefined)
    
    try {
      const data = await mockGoogleSSO()
      setSsoData(data)
      
      const userExists = await checkUserExists(data.email)
      
      if (userExists.exists && userExists.user && userExists.tenant) {
        onAuthenticated(userExists.user, userExists.tenant)
      } else {
        setStep('oo_code')
      }
    } catch (err) {
      setError('Failed to authenticate with Google. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleOOCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!ssoData || !ooCode.trim()) return
    
    setLoading(true)
    setError(undefined)
    
    try {
      const result = await verifyOOCode(ooCode.trim(), ssoData.email)
      
      if (!result.valid || !result.tenant) {
        setError('Invalid OO Code. Please check and try again.')
        setLoading(false)
        return
      }
      
      if (result.user) {
        onAuthenticated(result.user, result.tenant)
      } else {
        setError('No user account found. Please contact your administrator.')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDeveloperCode = async () => {
    if (!ssoData) return
    
    setLoading(true)
    setError(undefined)
    
    try {
      const result = await verifyOOCode(DEVELOPER_CODE, ssoData.email)
      
      if (result.valid && result.tenant && result.user) {
        onAuthenticated(result.user, result.tenant)
      } else {
        setError('Developer access not configured.')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mb-4">
            <div className="w-20 h-20 bg-primary rounded-2xl mx-auto flex items-center justify-center">
              <span className="text-4xl font-display font-bold text-primary-foreground">CT</span>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <CardTitle className="text-3xl font-display">Chicken Trainer</CardTitle>
          </div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Badge variant="secondary" className="gap-1.5">
              <DeviceIcon size={14} />
              {deviceInfo.label}
            </Badge>
          </div>
          <CardDescription>
            {step === 'sso' 
              ? `Sign in to access your training dashboard`
              : 'Welcome! Please enter your Owner-Operator Code'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 'sso' && (
            <div className="space-y-4">
              <Button
                size="lg"
                className="w-full"
                onClick={handleGoogleSSO}
                disabled={loading}
              >
                {loading && <CircleNotch className="animate-spin" />}
                Sign in with Google
              </Button>
            </div>
          )}
          
          {step === 'oo_code' && ssoData && (
            <div className="space-y-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Signed in as</p>
                <p className="font-medium">{ssoData.name}</p>
                <p className="text-sm text-muted-foreground">{ssoData.email}</p>
              </div>
              
              <form onSubmit={handleOOCodeSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="oo-code">Owner-Operator Code</Label>
                  <Input
                    id="oo-code"
                    type="text"
                    placeholder="Enter your OO Code"
                    value={ooCode}
                    onChange={(e) => setOoCode(e.target.value)}
                    disabled={loading}
                    autoFocus
                  />
                </div>
                
                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={loading || !ooCode.trim()}
                >
                  {loading && <CircleNotch className="animate-spin" />}
                  Continue
                </Button>
              </form>
              
              {isDeveloperWhitelisted(ssoData.email) && (
                <div className="relative">
                        >
                          {loading && <CircleNotch className="animate-spin" />}
                          Continue
                        </Button>
                      </form>
                      
                      {isDeveloperWhitelisted(ssoData.email) && (
                        <div className="relative">
                </div>
              )}
              
                          <div className="relative flex justify-center text-xs">
                            <span className="bg-card px-2 text-muted-foreground">
                  variant="outline"
                  size="lg"
                  className="w-full"
                  onClick={handleDeveloperCode}
                  disabled={loading}
                >
                      {isDeveloperWhitelisted(ssoData.email) && (
                        <Button
              )}
            </div>
          )}
          
          {error && (
            <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
                          Use Developer Code
                        </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
