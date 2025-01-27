'use client';

import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignUp
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
        path="/sign-up"
        signInUrl="/sign-in"
        redirectUrl="/dashboard"
        afterSignUpUrl="/dashboard"
      />
    </div>
  );
} 