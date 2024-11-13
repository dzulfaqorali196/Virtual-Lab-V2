"use client"

import { motion } from "framer-motion"
import { LucideIcon } from "lucide-react"
import { Card } from "@/components/ui/card"

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  features: string[]
}

export function FeatureCard({ icon: Icon, title, description, features }: FeatureCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="h-full"
    >
      <Card className="p-6 h-full bg-background/50 backdrop-blur-sm border-primary/10 hover:border-primary/20 transition-colors">
        <div className="space-y-4 flex flex-col h-full">
          <div className="flex justify-center">
            <motion.div 
              className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center relative group"
              whileHover={{ 
                scale: 1.1,
                rotate: 360,
              }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                duration: 0.6
              }}
            >
              <motion.div
                className="absolute inset-0 bg-primary/20 rounded-lg"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <Icon className="h-6 w-6 text-primary relative z-10" />
            </motion.div>
          </div>
          
          <div className="w-full text-center">
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-muted-foreground mb-4 text-pretty">{description}</p>
          </div>

          <ul className="space-y-2.5 w-full flex-1">
            {features.map((feature, index) => (
              <motion.li
                key={index}
                className="flex items-start gap-2 text-sm"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0 mt-1" />
                <span className="text-pretty flex-1">{feature}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </Card>
    </motion.div>
  )
}