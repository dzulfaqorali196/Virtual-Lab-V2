"use client"

import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Trophy } from "lucide-react"

const leaderboardData = [
  {
    rank: 1,
    user: {
      name: "Elena Martinez",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100",
      handle: "@elena_m"
    },
    points: 2840,
    experiments: 45,
    badges: ["Expert Experimenter", "Top Contributor"]
  },
  {
    rank: 2,
    user: {
      name: "James Wilson",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100",
      handle: "@james_w"
    },
    points: 2560,
    experiments: 38,
    badges: ["Data Analyst", "Mentor"]
  },
  {
    rank: 3,
    user: {
      name: "Sophia Lee",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100",
      handle: "@sophia_l"
    },
    points: 2340,
    experiments: 32,
    badges: ["Rising Star"]
  }
]

export function Leaderboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold tracking-tight">Top Contributors</h2>
        <Select defaultValue="week">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
            <SelectItem value="all">All Time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {leaderboardData.map((entry) => (
          <Card key={entry.rank} className="p-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-8 h-8">
                {entry.rank === 1 ? (
                  <Trophy className="h-6 w-6 text-yellow-500" />
                ) : entry.rank === 2 ? (
                  <Trophy className="h-6 w-6 text-gray-400" />
                ) : entry.rank === 3 ? (
                  <Trophy className="h-6 w-6 text-amber-700" />
                ) : (
                  <span className="text-lg font-bold">{entry.rank}</span>
                )}
              </div>

              <Avatar className="h-12 w-12">
                <AvatarImage src={entry.user.avatar} />
                <AvatarFallback>{entry.user.name[0]}</AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{entry.user.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {entry.user.handle}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{entry.points.toLocaleString()} pts</p>
                    <p className="text-sm text-muted-foreground">
                      {entry.experiments} experiments
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-2">
                  {entry.badges.map((badge) => (
                    <Badge key={badge} variant="secondary">
                      {badge}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}