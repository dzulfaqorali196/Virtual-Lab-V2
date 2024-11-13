"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { 
  Dialog, 
  DialogContent,
  DialogTitle 
} from "@/components/ui/dialog"
import { PlayCircle } from "lucide-react"

const videos = [
  {
    id: 1,
    title: "Understanding Pendulum Motion",
    duration: "5:32",
    thumbnail: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=800&auto=format&fit=crop&q=60",
    description: "Learn the basic principles of pendulum motion and how it relates to simple harmonic motion.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" // Replace with actual video URL
  },
  {
    id: 2,
    title: "Calculating Period and Frequency",
    duration: "4:15",
    thumbnail: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=60",
    description: "Step-by-step guide to calculating the period and frequency of a pendulum.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" // Replace with actual video URL
  },
  {
    id: 3,
    title: "Energy Conservation in Pendulums",
    duration: "6:45",
    thumbnail: "https://images.unsplash.com/photo-1636466498552-0a26ed4c1e4f?w=800&auto=format&fit=crop&q=60",
    description: "Explore how energy is conserved in pendulum motion through potential and kinetic energy.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" // Replace with actual video URL
  }
]

export function VideoTutorials() {
  const [selectedVideo, setSelectedVideo] = useState<typeof videos[0] | null>(null)

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {videos.map((video) => (
          <Card key={video.id} className="overflow-hidden">
            <div className="relative">
              <AspectRatio ratio={16 / 9}>
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="object-cover w-full h-full brightness-75 transition-all hover:brightness-90"
                />
              </AspectRatio>
              <div 
                className="absolute inset-0 flex items-center justify-center cursor-pointer"
                onClick={() => setSelectedVideo(video)}
              >
                <PlayCircle className="w-12 h-12 text-white opacity-80 hover:opacity-100 transition-opacity" />
              </div>
              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-sm px-2 py-1 rounded">
                {video.duration}
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold mb-2">{video.title}</h3>
              <p className="text-sm text-muted-foreground">{video.description}</p>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogTitle className="text-xl font-semibold mb-4">
            {selectedVideo?.title}
          </DialogTitle>
          <AspectRatio ratio={16 / 9}>
            {selectedVideo && (
              <iframe
                src={selectedVideo.videoUrl}
                title={selectedVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            )}
          </AspectRatio>
        </DialogContent>
      </Dialog>
    </>
  )
}