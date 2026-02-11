import { useState } from 'react'
import { User } from '@/lib/types'
import { Medal, Calendar, BookOpen } from '@phosphor-icons/react'
import { motion } from 'framer-motion'

interface NameBadgeProps {
  user: User
  todayGoalProgress?: number
  nextShift?: string
  openTrainings?: number
  earnedBadges?: number
  featuredBadgeName?: string
}

export function NameBadge({ 
  user, 
  todayGoalProgress = 0, 
  nextShift, 
  openTrainings = 0, 
  earnedBadges = 0,
  featuredBadgeName
}: NameBadgeProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <div 
      className="w-full max-w-sm mx-auto perspective-1000 cursor-pointer"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="relative w-full h-48"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
      >
        <div
          className="absolute inset-0 bg-primary text-primary-foreground rounded-2xl shadow-lg p-6 flex flex-col justify-center items-center"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="text-sm font-medium uppercase tracking-wider mb-2">
            Hello, my name is
          </div>
          <div className="text-4xl font-display font-bold mb-3">
            {user.display_name.split(' ')[0]}
          </div>
          <div className="text-sm font-medium">
            {user.role}
          </div>
          {todayGoalProgress > 0 && (
            <div className="mt-4 w-full">
              <div className="h-2 bg-primary-foreground/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary-foreground transition-all duration-500"
                  style={{ width: `${Math.min(todayGoalProgress, 100)}%` }}
                />
              </div>
              <div className="text-xs mt-1 text-center">
                Today's Goal: {todayGoalProgress}%
              </div>
            </div>
          )}
          <div className="text-xs mt-auto opacity-75">
            Tap to see more
          </div>
        </div>

        <div
          className="absolute inset-0 bg-card text-card-foreground border-2 border-primary rounded-2xl shadow-lg p-6"
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          <div className="flex flex-col gap-4 h-full justify-center">
            <div className="text-center mb-2">
              <div className="text-xl font-display font-bold text-primary">
                Quick Stats
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Calendar size={24} className="text-primary" />
              <div className="flex-1">
                <div className="text-sm text-muted-foreground">Next Shift</div>
                <div className="font-medium">
                  {nextShift || 'No upcoming shifts'}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <BookOpen size={24} className="text-accent" />
              <div className="flex-1">
                <div className="text-sm text-muted-foreground">Open Trainings</div>
                <div className="font-medium">
                  {openTrainings} active
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Medal size={24} className="text-success" />
              <div className="flex-1">
                <div className="text-sm text-muted-foreground">Earned Badges</div>
                <div className="font-medium">
                  {earnedBadges} total
                </div>
              </div>
            </div>
            
            <div className="text-xs text-center mt-auto text-muted-foreground">
              Tap to flip back
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
