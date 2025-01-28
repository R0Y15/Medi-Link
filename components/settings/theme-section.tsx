"use client"

import React from 'react'
import { useTheme } from "next-themes"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export function ThemeSection() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = (checked: boolean) => {
    setTheme(checked ? 'dark' : 'light')
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-foreground">Theme Settings</h3>
        <p className="text-sm text-muted-foreground">
          Customize the appearance of the application
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="dark-mode" className="text-foreground">Dark Mode</Label>
          <p className="text-sm text-muted-foreground">
            Switch between light and dark themes
          </p>
        </div>
        <Switch
          id="dark-mode"
          checked={theme === 'dark'}
          onCheckedChange={toggleTheme}
          aria-label="Toggle dark mode"
        />
      </div>
    </div>
  )
} 
