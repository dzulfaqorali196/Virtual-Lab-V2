"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { 
  ArrowRight, 
  Beaker, 
  BookOpen, 
  Share2, 
  LineChart, 
  Users, 
  Sparkles, 
  Atom, 
  Waves, 
  Zap,
  Layout,
  GraduationCap,
  BarChart2,
  Users2,
  Flame
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { FloatingFormulas } from "@/components/background/floating-formulas"
import { ParticleField } from "@/components/background/particle-field"
import { RippleEffect } from "@/components/background/ripple-effect"
import { TopicCard } from "@/components/cards/topic-card"
import { FeatureCard } from "@/components/cards/feature-card"

const topics = [
  {
    href: "/coming-soon",
    title: "Classical Mechanics",
    description: "Explore motion, forces, and energy through interactive simulations.",
    icon: Waves,
    gradient: "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900",
    iconType: "wave" as const
  },
  {
    href: "/coming-soon",
    title: "Electricity & Magnetism",
    description: "Discover the fundamental principles of electromagnetic phenomena.",
    icon: Zap,
    gradient: "bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900",
    iconType: "lightning" as const
  },
  {
    href: "/coming-soon",
    title: "Quantum Physics",
    description: "Dive into the fascinating world of quantum mechanics.",
    icon: Atom,
    gradient: "bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900",
    iconType: "atom" as const
  },
  {
    href: "/coming-soon",
    title: "Thermodynamics",
    description: "Study heat, energy transfer, and the laws that govern thermal systems.",
    icon: Flame,
    gradient: "bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900",
    iconType: "flame" as const
  }
]

const features = [
  {
    icon: Layout,
    title: "Interactive Simulation",
    description: "Experiment with pendulum parameters in real-time using our advanced physics engine.",
    features: [
      "Adjustable parameters",
      "Real-time visualization", 
      "2D/3D viewing modes"
    ]
  },
  {
    icon: GraduationCap,
    title: "Comprehensive Learning",
    description: "Access structured learning materials and interactive tutorials.",
    features: [
      "Step-by-step guides",
      "Video tutorials",
      "Interactive quizzes"
    ]
  },
  {
    icon: BarChart2,
    title: "Data Analytics",
    description: "Analyze and visualize your experimental data with powerful tools.",
    features: [
      "Real-time graphs",
      "Data export",
      "Comparative analysis"
    ]
  },
  {
    icon: Users2,
    title: "Community Hub",
    description: "Connect with fellow physics enthusiasts and share your discoveries.",
    features: [
      "Share experiments",
      "Join discussions", 
      "Compete on leaderboards"
    ]
  }
]

export default function Home() {
  return (
    <div className="flex flex-col items-center w-full">
      {/* Hero Section with Interactive Background */}
      <section className="w-full min-h-[100svh] py-8 xs:py-12 sm:py-16 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted relative overflow-hidden">
        {/* Background Elements */}
        <ParticleField />
        <FloatingFormulas />
        <RippleEffect />

        <div className="container relative flex flex-col items-center text-center space-y-4 xs:space-y-6 sm:space-y-8 px-0 xs:px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-3 xs:space-y-4 sm:space-y-6 max-w-3xl mx-auto w-full"
          >
            <div className="inline-flex items-center px-2 xs:px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border bg-background/50 backdrop-blur-sm">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-1 xs:mr-1.5 sm:mr-2 text-primary" />
              <span className="text-[10px] xs:text-xs sm:text-sm font-medium">Experience Physics Like Never Before</span>
            </div>
            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tighter relative leading-tight px-2">
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent bg-[size:200%] leading-tight"
                animate={{
                  backgroundPosition: ["0%", "100%", "0%"],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                Virtual Physics Lab
              </motion.span>
              <span className="opacity-0 leading-tight">Virtual Physics Lab</span>
              
              {/* Glow effect */}
              <motion.div
                className="absolute inset-0 blur-xl xs:blur-2xl sm:blur-3xl"
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
              
              {/* Particle sparkles */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 rounded-full bg-primary hidden sm:block"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                    x: [0, Math.random() * 100 - 50],
                    y: [0, Math.random() * 100 - 50],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.8,
                    ease: "easeOut",
                  }}
                />
              ))}
            </h1>
            <p className="text-sm xs:text-base sm:text-lg lg:text-xl text-muted-foreground max-w-[700px] mx-auto px-2">
              Experience the power of physics through interactive experiments. Learn, analyze, and collaborate in our virtual laboratory.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row justify-center gap-2 xs:gap-3 sm:gap-4 w-full px-2"
          >
            <Link href="/simulation" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto text-sm xs:text-base sm:text-lg group">
                Start Experiment
                <ArrowRight className="ml-1.5 xs:ml-2 h-3 w-3 xs:h-4 xs:w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/learn" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-sm xs:text-base sm:text-lg">
                Learn More
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 xs:py-16 sm:py-20 md:py-24 lg:py-32 bg-gradient-to-b from-muted to-background">
        <div className="container px-2 xs:px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-8 xs:mb-12 sm:mb-16"
          >
            <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter mb-2 xs:mb-3 sm:mb-4">
              Everything You Need
            </h2>
            <p className="text-sm xs:text-base sm:text-lg lg:text-xl text-muted-foreground max-w-[800px] mx-auto px-2">
              Our comprehensive platform provides all the tools you need for an immersive physics learning experience
            </p>
          </motion.div>

          <div className="grid gap-3 xs:gap-4 sm:gap-6 lg:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <FeatureCard {...feature} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Topic Cards Section */}
      <section className="container py-12 xs:py-16 sm:py-20 md:py-24 lg:py-32 px-2 xs:px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-6 xs:mb-8 sm:mb-12"
        >
          <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter mb-2 xs:mb-3 sm:mb-4">
            Explore Physics Topics
          </h2>
          <p className="text-sm xs:text-base sm:text-lg lg:text-xl text-muted-foreground max-w-[800px] mx-auto">
            Dive into our interactive learning modules and discover the fascinating world of physics
          </p>
        </motion.div>

        <div className="grid gap-3 xs:gap-4 sm:gap-6 lg:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {topics.map((topic, index) => (
            <motion.div
              key={topic.href}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <TopicCard 
                href={topic.href}
                title={topic.title}
                description={topic.description}
                icon={topic.icon}
                gradient={topic.gradient}
                iconType={
                  topic.icon === Waves ? "wave" :
                  topic.icon === Zap ? "lightning" :
                  topic.icon === Atom ? "atom" :
                  topic.icon === Flame ? "flame" :
                  "atom"
                }
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative w-full py-12 xs:py-16 sm:py-20 md:py-24 lg:py-32 overflow-hidden">
        {/* Background dengan efek gradient dan blur */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
        <div className="absolute inset-0 bg-grid-white/10 bg-grid-pattern" />
        
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="container relative z-10 px-2 xs:px-4 sm:px-6 lg:px-8"
        >
          <div className="max-w-3xl mx-auto text-center">
            <div className="relative inline-block">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-3 xs:mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/50"
              >
                Ready to Start Experimenting?
              </motion.h2>

              {/* Particle effects - jumlah partikel disesuaikan dengan ukuran layar */}
              {[...Array(10)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 rounded-full bg-primary"
                  style={{
                    top: Math.random() * 100 + '%',
                    left: Math.random() * 100 + '%',
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                    y: [0, -30], // Jarak lebih pendek untuk mobile
                    x: [0, Math.random() * 20 - 10], // Pergerakan horizontal lebih kecil untuk mobile
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeOut",
                  }}
                />
              ))}

              {/* Glow effect */}
              <motion.div
                className="absolute inset-0 -z-10"
                animate={{
                  opacity: [0.1, 0.3, 0.1],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <div className="w-full h-full bg-gradient-to-r from-primary/30 via-purple-500/30 to-primary/30 blur-xl sm:blur-2xl" />
              </motion.div>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-sm xs:text-base sm:text-lg lg:text-xl text-muted-foreground mb-6 xs:mb-8 sm:mb-12"
            >
              Join our community of physics enthusiasts and start your virtual experiments today.
            </motion.p>

            {/* Button dengan animasi */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex justify-center px-2 xs:px-4"
            >
              <Link href="/auth/signin" className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto group relative overflow-hidden px-4 xs:px-6 sm:px-8 py-3 xs:py-4 sm:py-6 text-sm xs:text-base sm:text-lg bg-primary hover:bg-primary/90"
                >
                  <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                    initial={{ x: '-100%', opacity: 0 }}
                    whileHover={{ x: '100%', opacity: 0.3 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  />
                  <span className="relative z-10 flex items-center gap-1.5 xs:gap-2">
                    Sign In Now
                    <motion.span
                      initial={false}
                      animate={{ x: 0 }}
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      →
                    </motion.span>
                  </span>
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </div>
  )
}