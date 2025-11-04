import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { X } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'

interface OnboardingTutorialProps {
  userName: string
  onComplete: () => void
}

export function OnboardingTutorial({ userName, onComplete }: OnboardingTutorialProps) {
  const [step, setStep] = useState(0)
  
  const script = [
    `Howdy ${userName}! Welcome to Chicken Trainer.`,
    `I'm Coach Moo — here to help you get mooo-ving through your first training!`,
    `Tap your name badge to see what's next on your path.`
  ]

  const handleNext = () => {
    if (step < script.length - 1) {
      setStep(step + 1)
    } else {
      onComplete()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="max-w-md relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2"
              onClick={onComplete}
            >
              <X />
            </Button>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center gap-4">
                <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center">
                  <div className="text-6xl">🐮</div>
                </div>
                
                <div className="relative bg-card border-2 border-primary rounded-2xl p-4 max-w-sm">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-primary" />
                  <p className="text-center text-lg">
                    {script[step]}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  {script.map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        i === step ? 'bg-primary' : 'bg-muted'
                      }`}
                    />
                  ))}
                </div>
                
                <Button onClick={handleNext} size="lg" className="mt-2">
                  {step < script.length - 1 ? 'Next' : 'Get Started'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
