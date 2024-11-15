"use client"

import '@/app/globals.css'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExperimentFeed } from "@/components/community/experiment-feed"
import { DiscussionBoard } from "@/components/community/discussion-board"
import { Leaderboard } from "@/components/community/leaderboard"
import { Share2, MessageSquare, Trophy } from "lucide-react"

export default function CommunityPage() {
  return (
    <div className="container py-6 md:py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Community Hub</h1>
          <p className="text-muted-foreground mt-2">
            Share experiments, discuss physics, and compete with other students.
          </p>
        </div>

        <Tabs defaultValue="experiments" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="experiments" className="flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline">Experiments</span>
            </TabsTrigger>
            <TabsTrigger value="discussions" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Discussions</span>
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              <span className="hidden sm:inline">Leaderboard</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="experiments">
            <ExperimentFeed />
          </TabsContent>

          <TabsContent value="discussions">
            <DiscussionBoard />
          </TabsContent>

          <TabsContent value="leaderboard">
            <Leaderboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}