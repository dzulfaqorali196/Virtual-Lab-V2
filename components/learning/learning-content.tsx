"use client"

import { useEffect, useState } from "react"
import { ErrorBoundary } from 'react-error-boundary'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { QuizSection } from "@/components/learning/quiz-section"
import { CheckCircle2, GraduationCap } from "lucide-react"

function ErrorFallback({error}: {error: Error}) {
  return (
    <div className="text-red-500">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
    </div>
  )
}

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
        content: "A pendulum is a weight suspended from a fixed point so that it can swing freely back and forth under the influence of gravity. The simple pendulum, which we study in this simulation, consists of a mass (called a bob) attached to a weightless, unstretchable string.\n\nKey components:\n• Bob: The mass at the end of the pendulum\n• String: The connection between the bob and pivot point\n• Pivot: The fixed point from which the pendulum hangs",
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
      // ... rest of the lessons data stays the same ...
    ]
  }
  // ... rest of lessons array stays the same ...
]

export function LearningContent() {
  const [completedSections, setCompletedSections] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('completedSections')
      return saved ? JSON.parse(saved) : []
    }
    return []
  })

  const [quizScores, setQuizScores] = useState<{[key: string]: number}>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('quizScores')
      return saved ? JSON.parse(saved) : {}
    }
    return {}
  })

  useEffect(() => {
    localStorage.setItem('completedSections', JSON.stringify(completedSections))
  }, [completedSections])

  useEffect(() => {
    localStorage.setItem('quizScores', JSON.stringify(quizScores))
  }, [quizScores])

  const handleQuizComplete = (lessonId: string, sectionId: string, score: number) => {
    const sectionKey = `${lessonId}-${sectionId}`
    setCompletedSections(prev => [...prev, sectionKey])
    setQuizScores(prev => ({...prev, [sectionKey]: score}))
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

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
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
    </ErrorBoundary>
  )
}