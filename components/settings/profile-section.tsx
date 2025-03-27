"use client"

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useUser } from "@clerk/nextjs"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

export function ProfileSection() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [isUpdating, setIsUpdating] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  
  // State to track form data
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    imageUrl: "",
  });

  // Update form data when user data is loaded
  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.primaryEmailAddress?.emailAddress || "",
        imageUrl: user.imageUrl || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=0095F6&color=fff`,
      });
    }
  }, [isLoaded, isSignedIn, user]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !isSignedIn || !user) return;

    try {
      setIsUpdating(true);
      // Upload the image to Clerk
      const formData = new FormData();
      formData.append('file', file);
      
      await user.setProfileImage({ file });
      toast.success("Profile picture updated successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to update profile picture");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleEmailChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData(prev => ({ ...prev, email: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSignedIn || !user) return;
    
    try {
      setIsUpdating(true);
      
      // Update name
      if (formData.firstName !== user.firstName || formData.lastName !== user.lastName) {
        await user.update({
          firstName: formData.firstName,
          lastName: formData.lastName,
        });
      }
      
      // Update email if changed
      if (formData.email !== user.primaryEmailAddress?.emailAddress) {
        const result = await user.createEmailAddress({ email: formData.email });
        
        if (result.verification) {
          setPendingVerification(true);
          toast.info("Verification email sent. Please check your inbox.");
        } else {
          await result.prepareVerification({ strategy: "email_code" });
          setPendingVerification(true);
          toast.info("Verification email sent. Please check your inbox.");
        }
      } else {
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsUpdating(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="text-center py-8">
        <p>Please sign in to view and edit your profile.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Profile Image */}
      <div className="flex items-center gap-6">
        <div className="relative h-24 w-24">
          <Image
            src={user?.imageUrl || formData.imageUrl}
            alt={`${formData.firstName}'s profile picture`}
            className="rounded-full object-cover border"
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
            disabled={isUpdating}
          >
            {isUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              "Change Photo"
            )}
          </Button>
          <input
            id="profile-image"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
            aria-label="Choose profile picture"
          />
          <p className="text-xs text-muted-foreground">
            Recommended: Square JPG, PNG.
          </p>
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className="w-full"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className="w-full"
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={handleEmailChange}
            className="w-full"
          />
          {pendingVerification && (
            <p className="text-xs text-amber-500">Verification email sent. Please check your inbox.</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="role">Role</Label>
          <Input
            id="role"
            value="Patient"
            disabled
            className="w-full bg-muted"
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button type="submit" disabled={isUpdating}>
          {isUpdating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving Changes...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </form>
  );
} 
