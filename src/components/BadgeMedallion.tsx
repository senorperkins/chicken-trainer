import { useState } from 'react'
import { motion } from 'framer-motion'
import { Medal, Sparkle } from '@phosphor-icons/react'

interface BadgeMedallionProps {
  name: string
  description?: string
  earnedDate?: string
  highlighted?: boolean
  onClick?: () => void
}

export function BadgeMedallion({ name, description, earnedDate, highlighted, onClick }: BadgeMedallionProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  const handleClick = () => {
    setIsFlipped((prev) => !prev)
    onClick?.()
  }

  const formattedDate = earnedDate 
    ? new Date(earnedDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : null

  return (
    <div 
      className="w-full max-w-[200px] perspective-1000 cursor-pointer"
      onClick={handleClick}
    >
      <motion.div
        className="relative w-full h-[200px]"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
      >
        {/* Front Face */}
        <div
          className={`absolute inset-0 rounded-2xl shadow-lg p-6 flex flex-col justify-center items-center ${
            highlighted 
              ? 'bg-gradient-to-br from-success via-success/90 to-success/80 text-white ring-4 ring-success/30' 
              : 'bg-card text-card-foreground border-2 border-border'
          }`}
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${
            highlighted 
              ? 'bg-white/20' 
              : 'bg-success/10'
          }`}>
            <Medal size={48} className={highlighted ? 'text-white' : 'text-success'} />
            {highlighted && (
              <Sparkle 
                size={20} 
                className="absolute -top-1 -right-1 text-yellow-300 animate-pulse" 
                weight="fill"
              />
            )}
          </div>
          
          <div className={`text-center ${highlighted ? 'text-white' : 'text-foreground'}`}>
            <h3 className="font-display font-bold text-lg mb-1">{name}</h3>
            {highlighted && (
              <p className="text-xs opacity-90 uppercase tracking-wide font-medium">
                New Badge!
              </p>
            )}
          </div>
          
          <div className={`text-xs mt-auto ${highlighted ? 'text-white/80' : 'text-muted-foreground'}`}>
            Tap to see details
          </div>
        </div>

        {/* Back Face */}
        <div
          className="absolute inset-0 bg-card text-card-foreground border-2 border-border rounded-2xl shadow-lg p-6"
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          <div className="flex flex-col gap-3 h-full justify-center items-center text-center">
            <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
              <Medal size={28} className="text-success" />
            </div>
            
            <div className="flex-1 flex flex-col justify-center">
              <h4 className="font-semibold text-sm mb-2">{name}</h4>
              
              {description && (
                <p className="text-xs text-muted-foreground line-clamp-3 mb-2">
                  {description}
                </p>
              )}
              
              {formattedDate && (
                <p className="text-xs text-muted-foreground">
                  Earned {formattedDate}
                </p>
              )}
            </div>
            
            <div className="text-xs text-muted-foreground mt-auto">
              Tap to flip back
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
