"use client"

import { useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useUserProfile } from "@/hooks/use-user-profile"
import { useExperiments } from "@/hooks/use-experiments"
import { 
  Trophy,
  Clock,
  GraduationCap,
  Building2,
  User,
  Briefcase,
  Award
} from "lucide-react"

export default function ProfilePage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { 
    bio,
    institution,
    role,
    expertise,
    achievements,
    stats,
    isLoading: profileLoading,
    updateProfile,
    loadProfile
  } = useUserProfile()
  const { 
    experiments, 
    isLoading: experimentsLoading,
    loadExperiments 
  } = useExperiments()

  useEffect(() => {
    if (!session) {
      router.push("/auth/signin")
    } else {
      loadProfile()
      loadExperiments()
    }
  }, [session, router, loadProfile, loadExperiments])

  if (profileLoading || experimentsLoading) {
    return (
      <div className="container py-8 space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-6">
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          </Card>
          <div className="space-y-6">
            <Card className="p-6">
              <Skeleton className="h-4 w-32 mb-4" />
              <div className="grid gap-4 grid-cols-2">
                {[1, 2].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    await updateProfile({
      bio: formData.get("bio") as string,
      institution: formData.get("institution") as string,
      role: formData.get("role") as string,
      expertise: (formData.get("expertise") as string).split(",").map(s => s.trim())
    })
  }

  return (
    <div className="container py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <Button onClick={() => router.push("/settings")}>Settings</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Information */}
        <Card className="p-6">
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                defaultValue={bio}
                placeholder="Tell us about yourself"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="institution">Institution</Label>
              <Input
                id="institution"
                name="institution"
                defaultValue={institution}
                placeholder="Your institution"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                name="role"
                defaultValue={role}
                placeholder="Your role"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expertise">Areas of Expertise</Label>
              <Input
                id="expertise"
                name="expertise"
                defaultValue={expertise?.join(", ")}
                placeholder="Separate with commas"
              />
            </div>

            <Button type="submit">Update Profile</Button>
          </form>
        </Card>

        {/* Stats and Achievements */}
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Statistics</h2>
            <div className="grid gap-4 grid-cols-2">
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Experiments</p>
                  <p className="font-medium">{stats?.experimentsCompleted || 0}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Time</p>
                  <p className="font-medium">
                    {Math.round((stats?.totalExperimentTime || 0) / 60)} mins
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Achievements</h2>
            <div className="space-y-4">
              {achievements?.map((achievement) => (
                <div
                  key={achievement.id}
                  className="flex items-start gap-3 p-3 bg-muted rounded-lg"
                >
                  <Award className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-medium">{achievement.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {achievement.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Earned {new Date(achievement.earnedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
              {(!achievements || achievements.length === 0) && (
                <p className="text-muted-foreground text-sm">
                  Complete experiments to earn achievements!
                </p>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Recent Experiments */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Experiments</h2>
        <div className="space-y-4">
          {experiments.slice(-5).reverse().map((experiment) => (
            <div
              key={experiment.id}
              className="flex items-center justify-between p-4 bg-muted rounded-lg"
            >
              <div>
                <p className="font-medium">
                  Pendulum Experiment
                </p>
                <p className="text-sm text-muted-foreground">
                  Length: {experiment.length}m, Mass: {experiment.mass}kg
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                {new Date(experiment.timestamp).toLocaleDateString()}
              </p>
            </div>
          ))}
          {experiments.length === 0 && (
            <p className="text-muted-foreground text-sm">
              No experiments recorded yet.
            </p>
          )}
        </div>
      </Card>
    </div>
  )
}