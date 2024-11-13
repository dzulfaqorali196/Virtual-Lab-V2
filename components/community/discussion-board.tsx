"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, ThumbsUp } from "lucide-react"

const discussions = [
  {
    id: 1,
    user: {
      name: "David Park",
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100",
      handle: "@david_p"
    },
    title: "Understanding Damping in Pendulum Motion",
    content: "I've noticed that my pendulum stops swinging after some time. Can someone explain the physics behind damping?",
    tags: ["damping", "friction", "energy-loss"],
    replies: 5,
    likes: 12,
    timestamp: "1 hour ago"
  },
  {
    id: 2,
    user: {
      name: "Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
      handle: "@sarah_j"
    },
    title: "Double Pendulum Chaos",
    content: "Has anyone tried simulating a double pendulum? The chaotic behavior is fascinating!",
    tags: ["chaos-theory", "double-pendulum", "simulation"],
    replies: 8,
    likes: 15,
    timestamp: "3 hours ago"
  }
]

export function DiscussionBoard() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex-1 w-full">
          <Input
            placeholder="Search discussions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button>Start Discussion</Button>
      </div>

      <div className="space-y-4">
        {discussions.map((discussion) => (
          <Card key={discussion.id} className="p-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={discussion.user.avatar} />
                    <AvatarFallback>{discussion.user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{discussion.user.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {discussion.user.handle} • {discussion.timestamp}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold">{discussion.title}</h3>
                <p className="mt-2 text-muted-foreground">{discussion.content}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {discussion.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center space-x-4 pt-4">
                <Button variant="ghost" size="sm">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  {discussion.replies} Replies
                </Button>
                <Button variant="ghost" size="sm">
                  <ThumbsUp className="mr-2 h-4 w-4" />
                  {discussion.likes} Likes
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}