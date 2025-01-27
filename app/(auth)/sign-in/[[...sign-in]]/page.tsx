'use client';

import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignIn 
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "bg-white shadow-lg",
          },
          layout: {
            socialButtonsPlacement: "bottom",
            socialButtonsVariant: "iconButton",
          },
        }}
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-up"
        redirectUrl="/dashboard"
        afterSignInUrl="/dashboard"
      />
    </div>
  );
} 