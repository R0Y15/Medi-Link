"use client"

import React from 'react'
import { ProfileSection } from '@/components/settings/profile-section'
import { ThemeSection } from '@/components/settings/theme-section'

const SettingsPage = () => {
  return (
    <div className="flex-1 space-y-8 p-8 bg-background">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="space-y-10">
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-foreground">Profile</h3>
          <div className="bg-card p-6 rounded-lg border">
            <ProfileSection />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card p-6 rounded-lg border">
            <ThemeSection />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage