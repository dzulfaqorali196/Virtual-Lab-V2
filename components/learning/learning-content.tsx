"use client"

import { useEffect } from "react"
import { useSession } from "next-auth/react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { QuizSection } from "@/components/learning/quiz-section"
import { CheckCircle2, GraduationCap } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLearningProgress } from "@/hooks/use-learning-progress"

interface QuizQuestion {
  id: string
  text: string
  options: string[]
  correctAnswer: number
  explanation: string
}

interface Section {
  id: string
  title: string
  content: string
  quiz: QuizQuestion[]
}

interface Lesson {
  id: string
  title: string
  sections: Section[]
}

const lessons: Lesson[] = [
  {
    id: "intro",
    title: "Introduction to Pendulums",
    sections: [
      {
        id: "basics",
        title: "What is a Pendulum?",
        content: `A pendulum is a weight suspended from a fixed point so that it can swing freely back and forth under the influence of gravity. The simple pendulum, which we study in this simulation, consists of a mass (called a bob) attached to a weightless, unstretchable string.

Key components:
• Bob: The mass at the end of the pendulum
• String: The connection between the bob and pivot point
• Pivot: The fixed point from which the pendulum hangs`,
        quiz: [
          {
            id: "q1",
            text: "What are the main components of a simple pendulum?",
            options: [
              "Spring and mass",
              "Bob, string, and pivot point",
              "Wheel and axle",
              "Lever and fulcrum"
            ],
            correctAnswer: 1,
            explanation: "A simple pendulum consists of three main components: the bob (mass), the string (assumed to be weightless and unstretchable), and the pivot point (fixed point of suspension)."
          },
          {
            id: "q2",
            text: "Which assumption is NOT made about the string in a simple pendulum?",
            options: [
              "It is weightless",
              "It is unstretchable",
              "It is flexible",
              "It is made of metal"
            ],
            correctAnswer: 3,
            explanation: "In a simple pendulum model, we assume the string is weightless, unstretchable, and flexible. The material of the string is not specified as it's idealized."
          }
        ]
      },
      {
        id: "motion",
        title: "Understanding Pendulum Motion",
        content: `The motion of a pendulum is characterized by several key terms:

• Amplitude: The maximum angle of displacement from the equilibrium position
• Period: The time taken for one complete oscillation
• Frequency: The number of oscillations per second
• Equilibrium: The rest position when the pendulum is vertical

The motion is governed by gravity and follows simple harmonic motion for small angles.`,
        quiz: [
          {
            id: "q3",
            text: "What is the period of a pendulum?",
            options: [
              "The maximum angle of swing",
              "The time for one complete oscillation",
              "The number of swings per second",
              "The distance from pivot to bob"
            ],
            correctAnswer: 1,
            explanation: "The period of a pendulum is the time taken for one complete oscillation (back and forth motion)."
          },
          {
            id: "q4",
            text: "Which factor does NOT affect the period of a simple pendulum?",
            options: [
              "Length of the string",
              "Mass of the bob",
              "Gravitational acceleration",
              "Initial amplitude (for small angles)"
            ],
            correctAnswer: 1,
            explanation: "The mass of the bob does not affect the period of a simple pendulum. The period depends only on the length of the string and gravitational acceleration for small angles."
          }
        ]
      }
    ]
  },
  {
    id: "energy",
    title: "Energy in Pendulum Systems",
    sections: [
      {
        id: "energy-types",
        title: "Types of Energy",
        content: `In a pendulum system, energy continuously transforms between two main types:

• Potential Energy (PE): Energy due to position, maximum at the highest points
• Kinetic Energy (KE): Energy of motion, maximum at the lowest point

The total mechanical energy (PE + KE) remains constant in an ideal system without friction.

Energy Equations:
• PE = mgh (where h is height from lowest point)
• KE = ½mv² (where v is instantaneous velocity)`,
        quiz: [
          {
            id: "e1",
            text: "When does a pendulum have maximum kinetic energy?",
            options: [
              "At the highest point of swing",
              "At the equilibrium position (lowest point)",
              "At the starting position",
              "Halfway between highest and lowest points"
            ],
            correctAnswer: 1,
            explanation: "A pendulum has maximum kinetic energy at its lowest point (equilibrium position) where all potential energy has been converted to kinetic energy and velocity is maximum."
          },
          {
            id: "e2",
            text: "What happens to the total mechanical energy in a real pendulum system?",
            options: [
              "It increases over time",
              "It remains exactly constant",
              "It gradually decreases due to friction",
              "It fluctuates randomly"
            ],
            correctAnswer: 2,
            explanation: "In a real pendulum system, total mechanical energy gradually decreases due to friction and air resistance, causing the amplitude to decrease over time."
          }
        ]
      },
      {
        id: "conservation",
        title: "Energy Conservation and Transfer",
        content: `Energy conservation is a fundamental principle in pendulum motion:

• At the highest point: Maximum PE, Zero KE
• At the lowest point: Maximum KE, Zero PE
• During swing: Continuous transfer between PE and KE

Factors affecting energy:
• Friction reduces total energy over time
• Air resistance causes damping
• Initial displacement determines total energy`,
        quiz: [
          {
            id: "e3",
            text: "What type of energy does a pendulum have at its highest point?",
            options: [
              "Only kinetic energy",
              "Only potential energy",
              "Equal amounts of both",
              "No energy at all"
            ],
            correctAnswer: 1,
            explanation: "At the highest point, all energy is stored as gravitational potential energy, and kinetic energy is zero because the pendulum momentarily stops."
          },
          {
            id: "e4",
            text: "How does the initial displacement affect the pendulum's energy?",
            options: [
              "It has no effect on energy",
              "Larger displacement means more total energy",
              "Smaller displacement means more total energy",
              "It only affects kinetic energy"
            ],
            correctAnswer: 1,
            explanation: "A larger initial displacement results in more total mechanical energy because it increases the maximum height, thus increasing the maximum potential energy."
          }
        ]
      }
    ]
  },
  {
    id: "applications",
    title: "Advanced Applications",
    sections: [
      {
        id: "real-world",
        title: "Real-World Applications",
        content: `Pendulums have numerous practical applications:

• Timekeeping: Used in grandfather clocks and historical chronometers
• Seismology: Seismic pendulums detect and measure earthquakes
• Construction: Used as dampers in skyscrapers
• Physics Education: Demonstrates fundamental principles

Historical significance:
• Galileo's discovery of isochronism
• Foucault's pendulum demonstrating Earth's rotation
• Development of accurate navigation tools`,
        quiz: [
          {
            id: "a1",
            text: "How are pendulums used in modern skyscrapers?",
            options: [
              "To generate electricity",
              "As counterweights in elevators",
              "As tuned mass dampers to reduce sway",
              "To measure building height"
            ],
            correctAnswer: 2,
            explanation: "Pendulums are used as tuned mass dampers in skyscrapers to counteract building sway from wind and seismic activity, improving structural stability."
          },
          {
            id: "a2",
            text: "What principle did Galileo discover about pendulums?",
            options: [
              "They can generate electricity",
              "Their period depends on mass",
              "They demonstrate Earth's rotation",
              "Their period is independent of amplitude for small swings"
            ],
            correctAnswer: 3,
            explanation: "Galileo discovered the principle of isochronism: for small amplitudes, the period of a pendulum remains constant regardless of the amplitude of swing."
          }
        ]
      },
      {
        id: "modern-tech",
        title: "Modern Technology and Research",
        content: `Contemporary applications of pendulum physics:

• Quantum Pendulums: Study of quantum mechanical effects
• Digital Sensors: Modern implementations of pendulum principles
• Robotics: Balance and motion control
• Energy Harvesting: Converting mechanical to electrical energy

Research areas:
• Chaos theory in double pendulums
• Quantum effects at microscopic scales
• Novel damping mechanisms
• Integration with smart materials`,
        quiz: [
          {
            id: "a3",
            text: "What makes double pendulums important in chaos theory?",
            options: [
              "They're easier to study than single pendulums",
              "They always move in predictable patterns",
              "They exhibit chaotic behavior and sensitivity to initial conditions",
              "They consume less energy"
            ],
            correctAnswer: 2,
            explanation: "Double pendulums are important in chaos theory because they demonstrate sensitive dependence on initial conditions and unpredictable, chaotic behavior despite simple underlying physics."
          },
          {
            id: "a4",
            text: "How are pendulum principles used in modern robotics?",
            options: [
              "Only for decoration",
              "For balance control and stability",
              "To generate power",
              "To measure time"
            ],
            correctAnswer: 1,
            explanation: "Pendulum principles are used in robotics for balance control, stability, and motion planning, especially in bipedal robots and stabilization systems."
          }
        ]
      }
    ]
  }
]

export function LearningContent() {
  const { data: session } = useSession()
  const {
    completedSections,
    quizScores,
    setProgress,
    loadProgress,
    isLoading
  } = useLearningProgress()

  useEffect(() => {
    if (session?.user) {
      loadProgress()
    }
  }, [session, loadProgress])

  const handleQuizComplete = (lessonId: string, sectionId: string, score: number) => {
    setProgress(lessonId, sectionId, score)
  }

  const calculateProgress = (lessonId: string) => {
    const lesson = lessons.find(l => l.id === lessonId)
    if (!lesson) return 0
    
    const totalSections = lesson.sections.length
    const completedCount = lesson.sections.filter(
      section => completedSections.includes(`${lessonId}-${section.id}`)
    ).length
    
    return (completedCount / totalSections) * 100
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      {lessons.map((lesson) => (
        <Card key={lesson.id} className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">{lesson.title}</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {Math.round(calculateProgress(lesson.id))}% Complete
                </span>
                <Progress value={calculateProgress(lesson.id)} className="w-[100px]" />
              </div>
            </div>
            
            <Accordion type="single" collapsible className="w-full">
              {lesson.sections.map((section) => {
                const sectionKey = `${lesson.id}-${section.id}`
                const isCompleted = completedSections.includes(sectionKey)
                const quizScore = quizScores[sectionKey]

                return (
                  <AccordionItem key={section.id} value={section.id}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-2">
                        {isCompleted && (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        )}
                        <span>{section.title}</span>
                        {isCompleted && quizScore !== undefined && (
                          <span className="text-sm text-muted-foreground ml-2">
                            (Score: {quizScore}/{section.quiz.length})
                          </span>
                        )}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="prose prose-sm max-w-none dark:prose-invert">
                        <div className="whitespace-pre-line mb-6">{section.content}</div>
                        {!isCompleted && (
                          <QuizSection
                            questions={section.quiz}
                            onComplete={(score) => handleQuizComplete(lesson.id, section.id, score)}
                          />
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )
              })}
            </Accordion>
          </div>
        </Card>
      ))}
    </div>
  )
}