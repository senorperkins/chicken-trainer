import { AvatarPack, AvatarItem } from './types'
import cowA from '@/assets/avatars/cow_a.svg'
import cowB from '@/assets/avatars/cow_b.svg'
import cowC from '@/assets/avatars/cow_c.svg'
import chickenA from '@/assets/avatars/chicken_a.svg'
import chickenB from '@/assets/avatars/chicken_b.svg'
import chickenC from '@/assets/avatars/chicken_c.svg'

export const BARNYARD_SIX_PACK: AvatarPack = {
  name: "Barnyard Six",
  description: "Six friendly avatars: 3 cows (not Coach Moo) and 3 chickens.",
  items: [
    { id: "cow_a", label: "Cow A", asset: cowA, category: "cow" },
    { id: "cow_b", label: "Cow B", asset: cowB, category: "cow" },
    { id: "cow_c", label: "Cow C", asset: cowC, category: "cow" },
    { id: "chicken_a", label: "Chicken A", asset: chickenA, category: "chicken" },
    { id: "chicken_b", label: "Chicken B", asset: chickenB, category: "chicken" },
    { id: "chicken_c", label: "Chicken C", asset: chickenC, category: "chicken" }
  ],
  exclusions: ["coach_moo"]
}

export function getAvatarPacks(): AvatarPack[] {
  return [BARNYARD_SIX_PACK]
}

export function getAvatarById(avatarId: string): AvatarItem | undefined {
  const packs = getAvatarPacks()
  for (const pack of packs) {
    const avatar = pack.items.find(item => item.id === avatarId)
    if (avatar) return avatar
  }
  return undefined
}

export function getAvatarAsset(avatarId: string): string | undefined {
  const avatar = getAvatarById(avatarId)
  return avatar?.asset
}

export function assignDeterministicAvatar(seed: string): AvatarItem {
  const items = BARNYARD_SIX_PACK.items
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i)
    hash = hash & hash
  }
  const index = Math.abs(hash) % items.length
  return items[index]
}

export function getUserAvatarUrl(user: { avatar_id?: string; avatar_url?: string; avatar_source?: 'default_pack' | 'uploaded' }): string | undefined {
  if (user.avatar_source === 'uploaded' && user.avatar_url) {
    return user.avatar_url
  }
  if (user.avatar_source === 'default_pack' && user.avatar_id) {
    return getAvatarAsset(user.avatar_id)
  }
  return undefined
}
