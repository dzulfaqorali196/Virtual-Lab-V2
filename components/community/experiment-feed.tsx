"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Heart, MessageCircle, Share2, MoreVertical, Download } from "lucide-react"

const experiments = [
  {
    id: 1,
    user: {
      name: "Alice Chen",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
      handle: "@alice_physics"
    },
    title: "Energy Conservation Study",
    description: "Interesting findings on energy conservation in a simple pendulum system. Check out these results!",
    image: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=800",
    likes: 24,
    comments: 8,
    timestamp: "2 hours ago",
    parameters: {
      length: "1.5m",
      mass: "0.5kg",
      angle: "45°"
    }
  },
  {
    id: 2,
    user: {
      name: "Marcus Kim",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
      handle: "@marcus_k"
    },
    title: "Period vs Length Relationship",
    description: "Experimental verification of the relationship between pendulum length and period.",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800",
    likes: 31,
    comments: 12,
    timestamp: "5 hours ago",
    parameters: {
      length: "2.0m",
      mass: "0.8kg",
      angle: "30°"
    }
  }
]

export function ExperimentFeed() {
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set())

  const toggleLike = (id: number) => {
    setLikedPosts(prev => {
      const newLiked = new Set(prev)
      if (newLiked.has(id)) {
        newLiked.delete(id)
      } else {
        newLiked.add(id)
      }
      return newLiked
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold tracking-tight">Shared Experiments</h2>
        <Button>Share Your Experiment</Button>
      </div>

      <div className="space-y-6">
        {experiments.map((experiment) => (
          <Card key={experiment.id} className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={experiment.user.avatar} />
                    <AvatarFallback>{experiment.user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{experiment.user.name}</p>
                    <p className="text-sm text-muted-foreground">{experiment.user.handle}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Download className="mr-2 h-4 w-4" />
                      Download Data
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div>
                <h3 className="text-lg font-semibold">{experiment.title}</h3>
                <p className="text-muted-foreground mt-1">{experiment.description}</p>
              </div>

              <div className="rounded-lg overflow-hidden">
                <img
                  src={experiment.image}
                  alt={experiment.title}
                  className="w-full h-[300px] object-cover"
                />
              </div>

              <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
                <div>
                  <p className="text-sm font-medium">Length</p>
                  <p className="text-lg">{experiment.parameters.length}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Mass</p>
                  <p className="text-lg">{experiment.parameters.mass}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Initial Angle</p>
                  <p className="text-lg">{experiment.parameters.angle}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <div className="flex space-x-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleLike(experiment.id)}
                    className={likedPosts.has(experiment.id) ? "text-red-500" : ""}
                  >
                    <Heart className="mr-2 h-4 w-4" />
                    {experiment.likes + (likedPosts.has(experiment.id) ? 1 : 0)}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    {experiment.comments}
                  </Button>
                </div>
                <span className="text-sm text-muted-foreground">
                  {experiment.timestamp}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}