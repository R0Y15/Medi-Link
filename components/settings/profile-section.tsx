"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

interface ProfileData {
  name: string
  email: string
  role: string
  profileImage: string
}

export function ProfileSection() {
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "Bishal Roy",
    email: "bishal.roy@example.com",
    role: "Patient",
    profileImage: `https://ui-avatars.com/api/?name=Bishal+Roy&background=0095F6&color=fff`
  })

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // In a real app, you'd upload this to a server
      const imageUrl = URL.createObjectURL(file)
      setProfileData(prev => ({ ...prev, profileImage: imageUrl }))
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setProfileData(prev => ({ ...prev, [id]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you'd send this to an API
    console.log('Profile data to save:', profileData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Profile Image */}
      <div className="flex items-center gap-6">
        <div className="relative h-24 w-24">
          <Image
            src={profileData.profileImage}
            alt={`${profileData.name}'s profile picture`}
            className="rounded-full object-cover"
            fill
            sizes="96px"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="profile-image" className="sr-only">
            Profile Picture
          </Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-fit"
            onClick={() => document.getElementById('profile-image')?.click()}
          >
            Change Photo
          </Button>
          <input
            id="profile-image"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
            aria-label="Choose profile picture"
          />
          <p className="text-sm text-muted-foreground">
            Recommended: Square JPG, PNG. Max 1MB.
          </p>
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={profileData.name}
            onChange={handleInputChange}
            className="w-full"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={profileData.email}
            onChange={handleInputChange}
            className="w-full"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="role">Role</Label>
          <Input
            id="role"
            value={profileData.role}
            disabled
            className="w-full bg-muted"
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button type="submit">
          Save Changes
        </Button>
      </div>
    </form>
  )
} 
