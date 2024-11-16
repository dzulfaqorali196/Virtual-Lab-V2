"use client"

import "@/app/globals.css"
import { useState, useEffect } from 'react'
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTheme } from "next-themes"
import { useToast } from "@/hooks/use-toast"
import { useUserPreferences } from "@/hooks/use-user-preferences"
import { useSession } from "next-auth/react"

export default function SettingsPage() {
  const { data: session } = useSession()
  const { theme, setTheme } = useTheme()
  const { preferences, setPreferences } = useUserPreferences()
  const { toast } = useToast()
  const [notifications, setNotifications] = useState({
    email: preferences?.notifications?.email ?? true,
    push: preferences?.notifications?.push ?? true
  })

  // Effect untuk sync theme dengan database saat berubah
  useEffect(() => {
    if (session?.user && theme) {
      setPreferences({
        ...preferences,
        theme: theme,
        notifications
      })
    }
  }, [theme])

  const handleSave = async () => {
    try {
      await setPreferences({
        ...preferences,
        theme: theme,
        notifications
      })
      toast({
        title: "Settings saved",
        description: "Your preferences have been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container max-w-2xl px-4 py-6 sm:py-8">
      <div className="space-y-4 sm:space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your preferences and notifications.
          </p>
        </div>

        <Card className="p-4 sm:p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Theme Preference</Label>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger>
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="email-notif">Email Notifications</Label>
              <Switch
                id="email-notif"
                checked={notifications.email}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({...prev, email: checked}))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="push-notif">Push Notifications</Label>
              <Switch
                id="push-notif"
                checked={notifications.push}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({...prev, push: checked}))
                }
              />
            </div>
            <Button 
              onClick={handleSave}
              className="w-full sm:w-auto mt-4"
            >
              Save Settings
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
} 