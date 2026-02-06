import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CircleNotch } from '@phosphor-icons/react'
import { mockGoogleSSO, mockAppleSSO, verifyOOCode, isDeveloperWhitelisted, DEVELOPER_CODE, checkUserExists, recordDeviceAccess } from '@/lib/auth'
import { User, Tenant } from '@/lib/types'

interface AuthFlowProps {
  onAuthenticated: (user: User, tenant: Tenant) => void
}

export function AuthFlow({ onAuthenticated }: AuthFlowProps) {
  const [step, setStep] = useState<'sso' | 'oo_code' | 'account_confirm'>('sso')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>()
  const [ooCode, setOoCode] = useState('')
  const [ssoData, setSsoData] = useState<{ email: string; name: string; avatar: string }>()
  const [signInProvider, setSignInProvider] = useState<'standard' | 'google' | 'apple'>()
  const [existingAccount, setExistingAccount] = useState<{ user: User; tenant: Tenant }>()

  useEffect(() => {
    recordDeviceAccess()
  }, [])

  const handleStandardSignIn = async () => {
    setLoading(true)
    setError(undefined)
    setSignInProvider('standard')
    
    try {
      const data = await mockGoogleSSO()
      setSsoData(data)
      
      const userExists = await checkUserExists(data.email)
      
      if (userExists.exists && userExists.user && userExists.tenant) {
        setExistingAccount({ user: userExists.user, tenant: userExists.tenant })
        setStep('account_confirm')
      } else {
        setStep('oo_code')
      }
    } catch (err) {
      setError('Failed to sign in. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSSO = async () => {
    setLoading(true)
    setError(undefined)
    setSignInProvider('google')
    
    try {
      const data = await mockGoogleSSO()
      setSsoData(data)
      
      const userExists = await checkUserExists(data.email)
      
      if (userExists.exists && userExists.user && userExists.tenant) {
        setExistingAccount({ user: userExists.user, tenant: userExists.tenant })
        setStep('account_confirm')
      } else {
        setStep('oo_code')
      }
    } catch (err) {
      setError('Failed to authenticate with Google. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleAppleSSO = async () => {
    setLoading(true)
    setError(undefined)
    setSignInProvider('apple')
    
    try {
      const data = await mockAppleSSO()
      setSsoData(data)
      
      const userExists = await checkUserExists(data.email)
      
      if (userExists.exists && userExists.user && userExists.tenant) {
        setExistingAccount({ user: userExists.user, tenant: userExists.tenant })
        setStep('account_confirm')
      } else {
        setStep('oo_code')
      }
    } catch (err) {
      setError('Failed to authenticate with Apple. Please try again.')
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

  const handleContinueExisting = async () => {
    if (!existingAccount) return
    
    setLoading(true)
    setError(undefined)
    
    try {
      await recordDeviceAccess()
      onAuthenticated(existingAccount.user, existingAccount.tenant)
    } catch (err) {
      setError('An error occurred while signing in. Please try again.')
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
          <CardTitle className="text-3xl font-display">Chicken Trainer</CardTitle>
          <CardDescription>
            {step === 'oo_code' 
              ? 'Welcome! Please enter your Owner-Operator Code'
              : step === 'account_confirm'
              ? 'We found your account'
              : null
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 'sso' && (
            <div className="space-y-3">
              <Button
                size="lg"
                className="w-full"
                onClick={handleStandardSignIn}
                disabled={loading}
              >
                {loading && signInProvider === 'standard' && <CircleNotch className="animate-spin" />}
                Sign In
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                className="w-full"
                onClick={handleGoogleSSO}
                disabled={loading}
              >
                {loading && signInProvider === 'google' && <CircleNotch className="animate-spin" />}
                Sign In with Google
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                className="w-full"
                onClick={handleAppleSSO}
                disabled={loading}
              >
                {loading && signInProvider === 'apple' && <CircleNotch className="animate-spin" />}
                Sign In with Apple
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
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-card px-2 text-muted-foreground">
                      or
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full"
                    onClick={handleDeveloperCode}
                    disabled={loading}
                  >
                    Use Developer Code
                  </Button>
                </div>
              )}
            </div>
          )}
          
          {step === 'account_confirm' && existingAccount && ssoData && (
            <div className="space-y-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Signed in as</p>
                <p className="font-medium">{ssoData.name}</p>
                <p className="text-sm text-muted-foreground">{ssoData.email}</p>
              </div>
              
              <div className="text-center p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Account found</p>
                <p className="font-medium">{existingAccount.user.display_name}</p>
                <p className="text-sm text-muted-foreground">{existingAccount.user.role}</p>
                <p className="text-xs text-muted-foreground mt-2">{existingAccount.tenant.name}</p>
              </div>
              
              <Button
                size="lg"
                className="w-full"
                onClick={handleContinueExisting}
                disabled={loading}
              >
                {loading && <CircleNotch className="animate-spin" />}
                Continue as {existingAccount.user.display_name}
              </Button>
            </div>
          )}
          
          {error && (
            <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
              {error}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
