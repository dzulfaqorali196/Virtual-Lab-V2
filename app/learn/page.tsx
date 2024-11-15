import { ErrorBoundary } from 'react-error-boundary'
import '@/app/globals.css'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LearningContent } from "@/components/learning/learning-content"
import { VideoTutorials } from "@/components/learning/video-tutorials"
import { InteractiveQuiz } from "@/components/learning/interactive-quiz"
import { GraduationCap, PlaySquare, BrainCircuit } from "lucide-react"

function ErrorFallback({error}: {error: Error}) {
  return (
    <div className="text-red-500">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
    </div>
  )
}

export default function LearnPage() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="container py-6 md:py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Learning Center</h1>
            <p className="text-muted-foreground mt-2">
              Master the physics of pendulum motion through comprehensive lessons, videos, and quizzes.
            </p>
          </div>

          <Tabs defaultValue="content" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
              <TabsTrigger value="content" className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                <span className="hidden sm:inline">Lessons</span>
              </TabsTrigger>
              <TabsTrigger value="videos" className="flex items-center gap-2">
                <PlaySquare className="h-4 w-4" />
                <span className="hidden sm:inline">Videos</span>
              </TabsTrigger>
              <TabsTrigger value="quiz" className="flex items-center gap-2">
                <BrainCircuit className="h-4 w-4" />
                <span className="hidden sm:inline">Quiz</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-6">
              <LearningContent />
            </TabsContent>

            <TabsContent value="videos" className="space-y-6">
              <VideoTutorials />
            </TabsContent>

            <TabsContent value="quiz" className="space-y-6">
              <InteractiveQuiz />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ErrorBoundary>
  )
}