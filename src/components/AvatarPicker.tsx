import { useState, useRef } from 'react'
import { AvatarItem } from '@/lib/types'
import { getAvatarPacks, getUserAvatarUrl } from '@/lib/avatars'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Camera, Upload, CircleNotch } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface AvatarPickerProps {
  currentAvatarId?: string
  currentAvatarUrl?: string
  currentAvatarSource?: 'default_pack' | 'uploaded'
  onAvatarChange: (avatarId: string, avatarSource: 'default_pack') => void
  onAvatarUpload: (file: File) => Promise<void>
}

export function AvatarPicker({ 
  currentAvatarId, 
  currentAvatarUrl,
  currentAvatarSource,
  onAvatarChange,
  onAvatarUpload
}: AvatarPickerProps) {
  const [open, setOpen] = useState(false)
  const [selectedId, setSelectedId] = useState(currentAvatarId || '')
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const packs = getAvatarPacks()
  const currentAvatar = getUserAvatarUrl({ 
    avatar_id: currentAvatarId, 
    avatar_url: currentAvatarUrl, 
    avatar_source: currentAvatarSource 
  })

  const handleSelectAvatar = (item: AvatarItem) => {
    setSelectedId(item.id)
  }

  const handleSave = () => {
    if (selectedId && selectedId !== currentAvatarId) {
      onAvatarChange(selectedId, 'default_pack')
      toast.success('Avatar updated successfully!')
    }
    setOpen(false)
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB')
      return
    }

    const allowedTypes = ['image/png', 'image/jpeg', 'image/svg+xml']
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only PNG, JPEG, and SVG files are allowed')
      return
    }

    setUploading(true)
    try {
      await onAvatarUpload(file)
      toast.success('Avatar uploaded successfully!')
      setOpen(false)
    } catch (error) {
      toast.error('Failed to upload avatar')
    } finally {
      setUploading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="absolute bottom-0 right-0 rounded-full w-10 h-10 p-0 shadow-lg"
        >
          <Camera size={20} />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Change Avatar</DialogTitle>
          <DialogDescription>
            Choose from our default avatars or upload your own
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="default" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="default">Default Avatars</TabsTrigger>
            <TabsTrigger value="upload">Upload Custom</TabsTrigger>
          </TabsList>

          <TabsContent value="default" className="space-y-4 mt-4">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={selectedId ? packs[0].items.find(i => i.id === selectedId)?.asset : currentAvatar} />
                  <AvatarFallback>?</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-muted px-3 py-1 rounded-full text-xs font-medium">
                  Preview
                </div>
              </div>
            </div>

            {packs.map((pack) => (
              <div key={pack.name} className="space-y-3">
                <div>
                  <h3 className="font-semibold text-lg">{pack.name}</h3>
                  <p className="text-sm text-muted-foreground">{pack.description}</p>
                </div>
                
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {pack.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleSelectAvatar(item)}
                      className={`relative aspect-square rounded-xl border-2 transition-all hover:scale-105 ${
                        selectedId === item.id 
                          ? 'border-primary shadow-lg' 
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <img 
                        src={item.asset} 
                        alt={item.label}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      {selectedId === item.id && (
                        <div className="absolute inset-0 bg-primary/10 rounded-lg" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={!selectedId || selectedId === currentAvatarId}>
                Save Changes
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="upload" className="space-y-4 mt-4">
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <div className="w-32 h-32 rounded-full border-2 border-dashed border-border flex items-center justify-center">
                {currentAvatarSource === 'uploaded' && currentAvatarUrl ? (
                  <Avatar className="w-28 h-28">
                    <AvatarImage src={currentAvatarUrl} />
                    <AvatarFallback>?</AvatarFallback>
                  </Avatar>
                ) : (
                  <Upload size={48} className="text-muted-foreground" />
                )}
              </div>

              <div className="text-center space-y-2">
                <Label className="text-base font-medium">Upload Custom Avatar</Label>
                <p className="text-sm text-muted-foreground max-w-md">
                  Maximum file size: 5MB<br />
                  Supported formats: PNG, JPEG, SVG
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/svg+xml"
                onChange={handleFileSelect}
                className="hidden"
              />

              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                size="lg"
              >
                {uploading && <CircleNotch className="animate-spin" />}
                {uploading ? 'Uploading...' : 'Choose File'}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
