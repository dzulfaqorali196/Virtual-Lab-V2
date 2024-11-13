"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { LucideIcon } from "lucide-react"
import { Card } from "@/components/ui/card"

interface TopicCardProps {
  href: string
  title: string
  description: string
  icon: LucideIcon
  gradient: string
  iconType?: 'wave' | 'lightning' | 'atom' | 'flame'
}

export function TopicCard({ href, title, description, icon: Icon, gradient, iconType = 'wave' }: TopicCardProps) {
  const iconAnimations = {
    wave: {
      icon: {
        animate: {
          x: [0, 5, -5, 5, 0],
          y: [0, -3, 3, -3, 0],
        },
        transition: {
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }
      },
      glow: {
        animate: {
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.6, 0.3],
        },
        transition: {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }
    },
    lightning: {
      icon: {
        animate: {
          scale: [1, 1.2, 1],
          opacity: [1, 0.7, 1],
        },
        transition: {
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }
      },
      glow: {
        animate: {
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.8, 0.3],
        },
        transition: {
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }
    },
    atom: {
      icon: {
        animate: {
          rotate: [0, 360],
        },
        transition: {
          duration: 8,
          repeat: Infinity,
          ease: "linear"
        }
      },
      glow: {
        animate: {
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.7, 0.3],
        },
        transition: {
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }
    },
    flame: {
      icon: {
        animate: {
          scale: [1, 1.2, 1, 0.9, 1],
          y: [0, -1, 0],
        },
        transition: {
          duration: 1,
          repeat: Infinity,
          ease: [0.4, 0, 0.4, 1]
        }
      },
      glow: {
        animate: {
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.7, 0.3],
        },
        transition: {
          duration: 1,
          repeat: Infinity,
          ease: [0.4, 0, 0.4, 1]
        }
      }
    }
  }

  const currentAnimation = iconAnimations[iconType]

  return (
    <Link href="/coming-soon" className="h-full">
      <motion.div
        whileHover={{ scale: 1.02, rotateY: 5 }}
        whileTap={{ scale: 0.98 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20,
        }}
        style={{
          transformStyle: "preserve-3d",
          perspective: "1000px",
        }}
        className="h-full"
      >
        <Card className={`p-6 h-full cursor-pointer relative overflow-hidden group ${gradient}`}>
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Content */}
          <div className="relative z-10 flex flex-col h-full items-center justify-between">
            {/* Icon section */}
            <div className="flex-shrink-0">
              <motion.div 
                className="relative w-14 h-14 flex items-center justify-center"
                whileHover={{ 
                  scale: iconType === 'flame' ? 1.4 : 1.2,
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
              >
                <motion.div
                  className="absolute inset-0 bg-primary/20 rounded-full blur-xl"
                  animate={currentAnimation.glow.animate}
                  transition={currentAnimation.glow.transition}
                  whileHover={iconType === 'flame' ? {
                    scale: 1.5,
                    opacity: 0.8,
                    transition: { duration: 0.3, ease: "easeOut" }
                  } : undefined}
                />
                <motion.div
                  animate={currentAnimation.icon.animate}
                  transition={currentAnimation.icon.transition}
                  whileHover={iconType === 'flame' ? {
                    scale: 1.2,
                    transition: { duration: 0.3, ease: "easeOut" }
                  } : undefined}
                >
                  <Icon className="h-8 w-8 text-primary relative z-10" />
                </motion.div>
              </motion.div>
            </div>

            {/* Text content */}
            <div className="flex-grow my-4 text-center">
              <h3 className="text-xl font-semibold mb-3">{title}</h3>
              <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                {description}
              </p>
            </div>
            
            {/* Learn more section */}
            <div className="flex-shrink-0 w-full">
              <motion.div 
                className="flex items-center justify-center text-primary font-medium"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                Learn more →
              </motion.div>
            </div>
          </div>

          {/* 3D effect elements */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-primary/5 to-primary/10" 
                 style={{ 
                   transform: "translateZ(20px)",
                   mixBlendMode: "overlay" 
                 }} 
            />
          </div>
        </Card>
      </motion.div>
    </Link>
  )
}