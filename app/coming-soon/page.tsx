"use client"

import '@/app/globals.css'
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Construction } from "lucide-react"
import { useRouter } from "next/navigation"
import { ParticleField } from "@/components/background/particle-field"
import { FloatingFormulas } from "@/components/background/floating-formulas"

export default function ComingSoonPage() {
  const router = useRouter()

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      <ParticleField />
      <FloatingFormulas />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 text-center space-y-8 max-w-2xl px-4"
      >
        {/* Icon with animations */}
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ 
            rotate: [0, -10, 10, -10, 0],
            scale: [1, 1.1, 1, 1.1, 1]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="relative"
        >
          <motion.div
            className="absolute inset-0 bg-primary/20 rounded-full blur-2xl"
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
          <Construction className="w-20 h-20 mx-auto text-primary relative" />
        </motion.div>
        
        {/* Title with gradient */}
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl relative">
          <motion.span
            className="absolute inset-0 bg-gradient-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent bg-[size:200%]"
            animate={{
              backgroundPosition: ["0%", "100%", "0%"],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            Coming Soon
          </motion.span>
          <span className="opacity-0">Coming Soon</span>
          
          {/* Glow effect */}
          <motion.div
            className="absolute inset-0 blur-2xl"
            animate={{
              opacity: [0.1, 0.3, 0.1],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="w-full h-full bg-gradient-to-r from-primary/50 via-purple-500/50 to-primary/50" />
          </motion.div>
        </h1>
        
        {/* Description */}
        <p className="text-xl text-muted-foreground max-w-lg mx-auto px-4">
          We're working hard to bring you this feature. Check back soon for updates!
        </p>

        {/* Progress Indicator */}
        <div className="flex justify-center gap-2 py-4">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-primary"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Button with hover effect */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="pt-6"
        >
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="gap-2 relative group overflow-hidden"
          >
            <motion.span
              className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent"
              initial={{ x: '-100%', opacity: 0 }}
              whileHover={{ x: '100%', opacity: 0.3 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span className="relative z-10">Go Back</span>
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
}