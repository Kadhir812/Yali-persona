"use client"

import { useState } from "react"
import { Settings, Monitor, Moon, Sun, Bell, Palette, Layout, User, Check } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog"
import { Button } from "./ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Label } from "./ui/label"
import { Switch } from "./ui/switch"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"
import { Separator } from "./ui/separator"
import { ThemeSwitcher } from "./theme-switcher"
import { useTheme } from "next-themes"
import { Input } from "./ui/input"

interface SettingsDialogProps {
  isOpen: boolean
  onClose: () => void
  onOpenNotifications: () => void
}

export default function SettingsDialog({ isOpen, onClose, onOpenNotifications }: SettingsDialogProps) {
  const [activeTab, setActiveTab] = useState("appearance")
  const { theme, setTheme } = useTheme()
  const [settings, setSettings] = useState({
    // Appearance settings
    animations: true,
    reduceMotion: false,

    // View settings
    defaultView: "list",
    favoritesView: "grid",
    compactMode: false,

    // Privacy settings
    analytics: true,
    cookies: true,

    // Account settings
    emailNotifications: true,
    pushNotifications: true,

    // System settings
    autoSave: true,
    backupFrequency: "weekly",
    dataRetention: "1year",
  })

  const handleSwitchChange = (key: string) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev],
    }))
  }

  const handleValueChange = (key: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const saveSettings = () => {
    // In a real app, you would save these settings to a database or localStorage
    localStorage.setItem("appSettings", JSON.stringify(settings))
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Settings
          </DialogTitle>
        </DialogHeader>

        <div className="flex mt-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex">
              <TabsList className="flex flex-col h-auto w-48 bg-transparent space-y-1 mr-6">
                <TabsTrigger value="appearance" className="justify-start">
                  <Palette className="h-4 w-4 mr-2" />
                  Appearance
                </TabsTrigger>
                <TabsTrigger value="view" className="justify-start">
                  <Layout className="h-4 w-4 mr-2" />
                  View Settings
                </TabsTrigger>
                <TabsTrigger value="notifications" className="justify-start">
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger value="account" className="justify-start">
                  <User className="h-4 w-4 mr-2" />
                  Account
                </TabsTrigger>
              </TabsList>

              <div className="flex-1 border-l pl-6">
                <TabsContent value="appearance" className="space-y-6 mt-0">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Theme</h3>
                    <div className="grid gap-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Monitor className="h-4 w-4" />
                          <Label htmlFor="theme-system">System Theme</Label>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setTheme("system")}
                          className={theme === "system" ? "bg-secondary" : ""}
                        >
                          {theme === "system" && <Check className="h-4 w-4 mr-2" />}
                          System
                        </Button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Sun className="h-4 w-4" />
                          <Label htmlFor="theme-light">Light Mode</Label>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setTheme("light")}
                          className={theme === "light" ? "bg-secondary" : ""}
                        >
                          {theme === "light" && <Check className="h-4 w-4 mr-2" />}
                          Light
                        </Button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Moon className="h-4 w-4" />
                          <Label htmlFor="theme-dark">Dark Mode</Label>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setTheme("dark")}
                          className={theme === "dark" ? "bg-secondary" : ""}
                        >
                          {theme === "dark" && <Check className="h-4 w-4 mr-2" />}
                          Dark
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-medium mb-4">Color Theme</h3>
                    <ThemeSwitcher />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Animation & Effects</h3>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="animations">Enable animations</Label>
                      <Switch
                        id="animations"
                        checked={settings.animations}
                        onCheckedChange={() => handleSwitchChange("animations")}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="reduceMotion">Reduce motion</Label>
                      <Switch
                        id="reduceMotion"
                        checked={settings.reduceMotion}
                        onCheckedChange={() => handleSwitchChange("reduceMotion")}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="view" className="space-y-6 mt-0">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Default View</h3>
                    <RadioGroup
                      value={settings.defaultView}
                      onValueChange={(value) => handleValueChange("defaultView", value)}
                      className="space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="list" id="view-list" />
                        <Label htmlFor="view-list">List View</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="compact" id="view-compact" />
                        <Label htmlFor="view-compact">Compact View</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-medium mb-4">Favorites View</h3>
                    <RadioGroup
                      value={settings.favoritesView}
                      onValueChange={(value) => handleValueChange("favoritesView", value)}
                      className="space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="grid" id="fav-grid" />
                        <Label htmlFor="fav-grid">Grid View</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="card" id="fav-card" />
                        <Label htmlFor="fav-card">Card View</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="list" id="fav-list" />
                        <Label htmlFor="fav-list">List View</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <Label htmlFor="compactMode">Compact Mode</Label>
                    <Switch
                      id="compactMode"
                      checked={settings.compactMode}
                      onCheckedChange={() => handleSwitchChange("compactMode")}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="notifications" className="space-y-6 mt-0">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Notification Settings</h3>
                    <Button onClick={onOpenNotifications}>
                      <Bell className="h-4 w-4 mr-2" />
                      Configure Notifications
                    </Button>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="emailNotifications">Email Notifications</Label>
                      <Switch
                        id="emailNotifications"
                        checked={settings.emailNotifications}
                        onCheckedChange={() => handleSwitchChange("emailNotifications")}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="pushNotifications">Push Notifications</Label>
                      <Switch
                        id="pushNotifications"
                        checked={settings.pushNotifications}
                        onCheckedChange={() => handleSwitchChange("pushNotifications")}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="account" className="space-y-6 mt-0">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Account Information</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" defaultValue="John Doe" className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" defaultValue="john.doe@example.com" className="mt-1" />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-medium mb-4">Password</h3>
                    <Button>Change Password</Button>
                  </div>
                </TabsContent>
              </div>
            </div>
          </Tabs>
        </div>

        <DialogFooter className="mt-6">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={saveSettings}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

