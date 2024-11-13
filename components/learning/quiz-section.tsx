"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, XCircle, Trophy } from "lucide-react"
import { cn } from "@/lib/utils"

interface Question {
  id: string
  text: string
  options: string[]
  correctAnswer: number
  explanation: string
}

interface QuizSectionProps {
  questions: Question[]
  onComplete: (score: number) => void
}

export function QuizSection({ questions, onComplete }: QuizSectionProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [score, setScore] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)

  const progress = ((currentQuestion + 1) / questions.length) * 100

  const handleAnswer = () => {
    if (selectedAnswer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1)
    }
    setShowExplanation(true)
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
    } else {
      setIsCompleted(true)
      onComplete(score)
    }
  }

  if (isCompleted) {
    const percentage = (score / questions.length) * 100
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <Card className="p-6 text-center">
          <div className="mb-4">
            <Trophy className="w-12 h-12 mx-auto text-primary" />
          </div>
          <h3 className="text-2xl font-bold mb-2">Quiz Completed!</h3>
          <p className="text-muted-foreground mb-4">
            You scored {score} out of {questions.length} ({percentage.toFixed(0)}%)
          </p>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-6">
            <div 
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <Button 
            onClick={() => {
              setCurrentQuestion(0)
              setScore(0)
              setSelectedAnswer(null)
              setShowExplanation(false)
              setIsCompleted(false)
            }}
          >
            Try Again
          </Button>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
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

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">
          {questions[currentQuestion].text}
        </h3>

        <RadioGroup
          value={selectedAnswer?.toString()}
          onValueChange={(value) => setSelectedAnswer(parseInt(value))}
          className="space-y-3"
        >
          {questions[currentQuestion].options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <RadioGroupItem
                value={index.toString()}
                id={`option-${index}`}
                disabled={showExplanation}
              />
              <Label
                htmlFor={`option-${index}`}
                className={cn(
                  showExplanation && index === questions[currentQuestion].correctAnswer && "text-green-600 dark:text-green-400",
                  showExplanation && index === selectedAnswer && index !== questions[currentQuestion].correctAnswer && "text-red-600 dark:text-red-400"
                )}
              >
                {option}
                {showExplanation && index === questions[currentQuestion].correctAnswer && (
                  <CheckCircle2 className="inline-block ml-2 h-4 w-4 text-green-600 dark:text-green-400" />
                )}
                {showExplanation && index === selectedAnswer && index !== questions[currentQuestion].correctAnswer && (
                  <XCircle className="inline-block ml-2 h-4 w-4 text-red-600 dark:text-red-400" />
                )}
              </Label>
            </div>
          ))}
        </RadioGroup>

        <AnimatePresence>
          {showExplanation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-4 bg-muted rounded-lg"
            >
              <p className="text-sm">{questions[currentQuestion].explanation}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-6 flex justify-end">
          {!showExplanation ? (
            <Button
              onClick={handleAnswer}
              disabled={selectedAnswer === null}
            >
              Check Answer
            </Button>
          ) : (
            <Button onClick={handleNext}>
              {currentQuestion < questions.length - 1 ? "Next Question" : "Complete Quiz"}
            </Button>
          )}
        </div>
      </Card>
    </motion.div>
  )
}