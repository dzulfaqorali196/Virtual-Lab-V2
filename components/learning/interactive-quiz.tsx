"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, XCircle, GripHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"

interface MultipleChoiceQuestion {
  type: 'multiple-choice'
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

interface DragDropQuestion {
  type: 'drag-drop'
  question: string
  items: string[]
  correctOrder: number[]
  explanation: string
}

interface NumericalQuestion {
  type: 'numerical'
  question: string
  correctAnswer: number
  tolerance: number
  unit: string
  explanation: string
}

type Question = MultipleChoiceQuestion | DragDropQuestion | NumericalQuestion

const questions: Question[] = [
  {
    type: 'multiple-choice',
    question: 'What determines the period of a simple pendulum?',
    options: [
      'Mass of the bob only',
      'Length of the string only',
      'Both mass and length',
      'Length and gravity only'
    ],
    correctAnswer: 3,
    explanation: 'The period of a simple pendulum depends only on the length of the string and the acceleration due to gravity (T = 2π√(L/g)). The mass does not affect the period.'
  },
  {
    type: 'drag-drop',
    question: 'Arrange these terms in order of increasing energy for a pendulum at different positions:',
    items: [
      'At equilibrium',
      'At maximum displacement',
      'At quarter amplitude',
      'At half amplitude'
    ],
    correctOrder: [0, 2, 3, 1],
    explanation: 'The potential energy is lowest at equilibrium and highest at maximum displacement. The energy increases as the pendulum moves away from equilibrium.'
  },
  {
    type: 'numerical',
    question: 'Calculate the period of a pendulum with length 2.0 meters on Earth (g = 9.81 m/s²).',
    correctAnswer: 2.84,
    tolerance: 0.05,
    unit: 'seconds',
    explanation: 'Using T = 2π√(L/g), with L = 2.0m and g = 9.81 m/s², we get T = 2π√(2/9.81) ≈ 2.84 seconds.'
  },
  {
    type: 'multiple-choice',
    question: 'What happens to the period if we double the amplitude of oscillation?',
    options: [
      'The period doubles',
      'The period halves',
      'The period remains approximately the same',
      'The period becomes zero'
    ],
    correctAnswer: 2,
    explanation: 'For small angles, the period of a pendulum is independent of amplitude. This is known as isochronism, first observed by Galileo.'
  },
  {
    type: 'numerical',
    question: 'If a pendulum makes 10 complete oscillations in 20 seconds, what is its frequency?',
    correctAnswer: 0.5,
    tolerance: 0.01,
    unit: 'Hz',
    explanation: 'Frequency = number of oscillations / time = 10/20 = 0.5 Hz'
  }
]

export function InteractiveQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [dragItems, setDragItems] = useState<string[]>([])
  const [numericalAnswer, setNumericalAnswer] = useState("")
  const [showExplanation, setShowExplanation] = useState(false)
  const [score, setScore] = useState(0)

  useEffect(() => {
    const question = questions[currentQuestion]
    if (question.type === 'drag-drop') {
      setDragItems([...question.items])
    }
  }, [currentQuestion])

  const handleDragStart = (e: React.DragEvent, item: string) => {
    e.dataTransfer.setData('text/plain', item)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault()
    const item = e.dataTransfer.getData('text/plain')
    const sourceIndex = dragItems.indexOf(item)
    if (sourceIndex === -1) return

    const newItems = [...dragItems]
    newItems.splice(sourceIndex, 1)
    newItems.splice(targetIndex, 0, item)
    setDragItems(newItems)
  }

  const checkAnswer = () => {
    const question = questions[currentQuestion]
    let isCorrect = false

    switch (question.type) {
      case 'multiple-choice':
        isCorrect = selectedAnswer === question.correctAnswer
        break
      case 'drag-drop':
        isCorrect = dragItems.every((item, index) => 
          item === question.items[question.correctOrder[index]]
        )
        break
      case 'numerical':
        const numAnswer = parseFloat(numericalAnswer)
        isCorrect = Math.abs(numAnswer - question.correctAnswer) <= question.tolerance
        break
    }

    if (isCorrect) {
      setScore(score + 1)
    }
    setShowExplanation(true)
  }

  const handleNext = () => {
    setSelectedAnswer(null)
    setDragItems([])
    setNumericalAnswer("")
    setShowExplanation(false)
    setCurrentQuestion(currentQuestion + 1)
  }

  const renderQuestion = () => {
    const question = questions[currentQuestion]

    switch (question.type) {
      case 'multiple-choice':
        return (
          <RadioGroup
            value={selectedAnswer?.toString()}
            onValueChange={(value) => setSelectedAnswer(parseInt(value))}
            className="space-y-3"
          >
            {question.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={index.toString()}
                  id={`option-${index}`}
                  disabled={showExplanation}
                />
                <Label
                  htmlFor={`option-${index}`}
                  className={cn(
                    showExplanation && index === question.correctAnswer && "text-green-600 dark:text-green-400",
                    showExplanation && index === selectedAnswer && index !== question.correctAnswer && "text-red-600 dark:text-red-400"
                  )}
                >
                  {option}
                  {showExplanation && index === question.correctAnswer && (
                    <CheckCircle2 className="inline-block ml-2 h-4 w-4 text-green-600 dark:text-green-400" />
                  )}
                  {showExplanation && index === selectedAnswer && index !== question.correctAnswer && (
                    <XCircle className="inline-block ml-2 h-4 w-4 text-red-600 dark:text-red-400" />
                  )}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )

      case 'drag-drop':
        return (
          <div className="space-y-4">
            {dragItems.map((item, index) => (
              <div
                key={index}
                draggable
                onDragStart={(e) => handleDragStart(e, item)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                className="p-3 bg-muted rounded-lg cursor-move flex items-center space-x-2 hover:bg-muted/80 transition-colors"
              >
                <GripHorizontal className="h-4 w-4 text-muted-foreground" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        )

      case 'numerical':
        return (
          <div className="space-y-4">
            <div className="flex space-x-2">
              <Input
                type="number"
                step="0.01"
                value={numericalAnswer}
                onChange={(e) => setNumericalAnswer(e.target.value)}
                placeholder="Enter your answer"
                className="max-w-[200px]"
                disabled={showExplanation}
              />
              <span className="flex items-center text-muted-foreground">
                {question.unit}
              </span>
            </div>
          </div>
        )
    }
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="text-sm font-medium">
              Score: {score}/{questions.length}
            </span>
          </div>
          <Progress value={progress} />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            {questions[currentQuestion].question}
          </h3>

          {renderQuestion()}

          {showExplanation && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p className="text-sm">{questions[currentQuestion].explanation}</p>
            </div>
          )}

          <div className="flex justify-end space-x-4">
            {!showExplanation ? (
              <Button
                onClick={checkAnswer}
                disabled={
                  (questions[currentQuestion].type === 'multiple-choice' && selectedAnswer === null) ||
                  (questions[currentQuestion].type === 'numerical' && !numericalAnswer)
                }
              >
                Check Answer
              </Button>
            ) : currentQuestion < questions.length - 1 ? (
              <Button onClick={handleNext}>Next Question</Button>
            ) : (
              <Button
                onClick={() => {
                  setCurrentQuestion(0)
                  setScore(0)
                  setSelectedAnswer(null)
                  setDragItems([])
                  setNumericalAnswer("")
                  setShowExplanation(false)
                }}
              >
                Restart Quiz
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}