'use client'
import '@/app/globals.css'
import { useEffect } from 'react'
import { useUserProfile } from '@/hooks/use-user-profile'
import { ProfileUpdateData, UserProfile, UserAchievement } from '@/types/user'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Trophy, 
  Clock, 
  Building2, 
  Briefcase,
  GraduationCap,
  Twitter,
  Linkedin,
  Github,
  AlertCircle
} from 'lucide-react'
  import { useToast } from "@/hooks/use-toast"
import { formatMinutes } from '@/lib/utils'

export default function ProfilePage() {
  const { 
    profile, 
    stats, 
    isLoading, 
    error, 
    fetchProfile, 
    updateProfile 
  } = useUserProfile()

  const { toast } = useToast()

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  const handleUpdateProfile = async (data: ProfileUpdateData) => {
    try {
      await updateProfile(data)
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
        variant: "default",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update profile",
        variant: "destructive",
      })
    }
  }

  if (error) {
    return (
      <div className="container mx-auto py-10">
        <Card className="w-full">
          <CardContent className="flex flex-col items-center justify-center py-10 space-y-4">
            <AlertCircle className="h-10 w-10 text-destructive" />
            <p className="text-destructive text-center">{error}</p>
            <Button onClick={() => fetchProfile()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Profile Form */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your profile information and social links
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-6">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ) : (
                <form onSubmit={async (e) => {
                  e.preventDefault()
                  const formData = new FormData(e.currentTarget)
                  await handleUpdateProfile({
                    bio: formData.get('bio') as string,
                    institution: formData.get('institution') as string,
                    role: formData.get('role') as string,
                    expertise: formData.get('expertise')?.toString().split(',').filter(Boolean),
                    social: {
                      twitter: formData.get('twitter') as string,
                      linkedin: formData.get('linkedin') as string,
                      github: formData.get('github') as string
                    }
                  })
                }} className="space-y-6">
                  {/* Bio */}
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Input
                      id="bio"
                      name="bio"
                      placeholder="Tell us about yourself"
                      defaultValue={profile?.bio || ''}
                      className="h-20"
                    />
                  </div>

                  {/* Institution */}
                  <div className="space-y-2">
                    <Label htmlFor="institution">
                      <span className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        Institution
                      </span>
                    </Label>
                    <Input
                      id="institution"
                      name="institution"
                      placeholder="Your institution"
                      defaultValue={profile?.institution || ''}
                    />
                  </div>

                  {/* Role */}
                  <div className="space-y-2">
                    <Label htmlFor="role">
                      <span className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4" />
                        Role
                      </span>
                    </Label>
                    <Input
                      id="role"
                      name="role"
                      placeholder="Your role"
                      defaultValue={profile?.role || ''}
                    />
                  </div>

                  {/* Expertise */}
                  <div className="space-y-2">
                    <Label htmlFor="expertise">
                      <span className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4" />
                        Areas of Expertise
                      </span>
                    </Label>
                    <Input
                      id="expertise"
                      name="expertise"
                      placeholder="e.g. Physics, Mathematics (comma separated)"
                      defaultValue={profile?.expertise?.join(', ') || ''}
                    />
                  </div>

                  <Separator />

                  {/* Social Links */}
                  <div className="space-y-4">
                    <Label>Social Links</Label>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Twitter className="h-4 w-4" />
                        <Input
                          name="twitter"
                          placeholder="Twitter URL"
                          defaultValue={profile?.social?.twitter || ''}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Linkedin className="h-4 w-4" />
                        <Input
                          name="linkedin"
                          placeholder="LinkedIn URL"
                          defaultValue={profile?.social?.linkedin || ''}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Github className="h-4 w-4" />
                        <Input
                          name="github"
                          placeholder="GitHub URL"
                          defaultValue={profile?.social?.github || ''}
                        />
                      </div>
                    </div>
                  </div>

                  <Button type="submit" className="w-full">
                    Save Changes
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Stats & Achievement Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Trophy className="h-4 w-4 text-yellow-500" />
                      <span>Experiments Completed</span>
                    </div>
                    <Badge variant="secondary">
                      {stats?.experimentsCompleted || 0}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <span>Total Time Spent</span>
                    </div>
                    <Badge variant="secondary">
                      {formatMinutes(stats?.totalTimeSpent || 0)} 
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Last Active</span>
                    <Badge variant="outline">
                      {stats?.lastActive 
                        ? new Date(stats.lastActive).toLocaleDateString()
                        : 'Never'}
                    </Badge>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ) : profile?.achievements && profile.achievements.length > 0 ? (
                <div className="space-y-4">
                  {profile.achievements.map((achievement: UserAchievement) => (
                    <div 
                      key={achievement.id} 
                      className="flex items-start space-x-2"
                    >
                      <Trophy className="h-4 w-4 text-yellow-500 mt-1" />
                      <div>
                        <p className="font-medium">{achievement.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {achievement.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Earned on {new Date(achievement.earnedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-6">
                  Complete experiments to earn achievements!
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}