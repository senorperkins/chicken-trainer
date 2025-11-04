import { User, BadgeAward, Badge as BadgeType } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Medal, Envelope, Calendar } from '@phosphor-icons/react'
import { AvatarPicker } from '@/components/AvatarPicker'
import { getUserAvatarUrl } from '@/lib/avatars'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'

interface ProfileTabProps {
  user: User
  badges: BadgeAward[]
  badgeDefinitions: BadgeType[]
}

export function ProfileTab({ user, badges, badgeDefinitions }: ProfileTabProps) {
  const [users, setUsers] = useKV<User[]>('users', [])
  
  const getBadgeDefinition = (badgeAward: BadgeAward) => {
    return badgeDefinitions.find(b => b.id === badgeAward.badge_id)
  }

  const handleAvatarChange = (avatarId: string, avatarSource: 'default_pack') => {
    setUsers((currentUsers) => 
      (currentUsers || []).map(u => 
        u.id === user.id 
          ? { ...u, avatar_id: avatarId, avatar_source: avatarSource, avatar_url: undefined }
          : u
      )
    )
  }

  const handleAvatarUpload = async (file: File): Promise<void> => {
    const reader = new FileReader()
    return new Promise((resolve, reject) => {
      reader.onload = async (e) => {
        const dataUrl = e.target?.result as string
        
        setUsers((currentUsers) =>
          (currentUsers || []).map(u =>
            u.id === user.id
              ? { ...u, avatar_url: dataUrl, avatar_source: 'uploaded' as const, avatar_id: undefined }
              : u
          )
        )
        resolve()
      }
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsDataURL(file)
    })
  }

  const avatarUrl = getUserAvatarUrl(user)

  return (
    <div className="container mx-auto py-6 px-4 space-y-6 max-w-4xl">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src={avatarUrl} />
                <AvatarFallback className="text-5xl">
                  🐔
                </AvatarFallback>
              </Avatar>
              <AvatarPicker
                currentAvatarId={user.avatar_id}
                currentAvatarUrl={user.avatar_url}
                currentAvatarSource={user.avatar_source}
                onAvatarChange={handleAvatarChange}
                onAvatarUpload={handleAvatarUpload}
              />
            </div>
            
            <div className="flex-1 text-center sm:text-left space-y-2">
              <h1 className="text-3xl font-display font-bold">{user.display_name}</h1>
              <div className="flex flex-wrap items-center gap-3 justify-center sm:justify-start">
                <Badge className="text-sm">{user.role}</Badge>
                <Badge variant="outline" className="text-sm">
                  {user.active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              
              <div className="space-y-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <Envelope size={16} />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <Calendar size={16} />
                  <span>
                    Member since {new Date(user.created_at).toLocaleDateString('en-US', { 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Medal size={24} className="text-primary" />
            <CardTitle>Earned Badges</CardTitle>
          </div>
          <CardDescription>
            Recognition for your achievements and mastery
          </CardDescription>
        </CardHeader>
        <CardContent>
          {badges.length === 0 ? (
            <div className="py-12 text-center">
              <Medal size={48} className="mx-auto mb-3 text-muted-foreground" />
              <p className="text-lg font-medium">No badges earned yet</p>
              <p className="text-sm text-muted-foreground">
                Complete trainings to earn your first badge!
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {badges.map((badgeAward) => {
                const badgeDef = getBadgeDefinition(badgeAward)
                if (!badgeDef) return null
                
                return (
                  <Card key={badgeAward.id}>
                    <CardContent className="pt-6">
                      <div className="flex gap-4">
                        <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center shrink-0">
                          <Medal size={32} className="text-success" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg mb-1">{badgeDef.name}</h3>
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                            {badgeDef.description}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Earned {new Date(badgeAward.awarded_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between py-2 border-b">
            <span className="text-muted-foreground">User ID</span>
            <span className="font-mono text-sm">{user.id}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-muted-foreground">OO Code</span>
            <span className="font-mono text-sm">{user.oo_code}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-muted-foreground">Tenant ID</span>
            <span className="font-mono text-sm">{user.tenant_id}</span>
          </div>
          {user.store_id && (
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">Store ID</span>
              <span className="font-mono text-sm">{user.store_id}</span>
            </div>
          )}
          {user.district_id && (
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground">District ID</span>
              <span className="font-mono text-sm">{user.district_id}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
