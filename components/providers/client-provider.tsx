"use client";

import React from 'react';
import { ThemeProvider } from "./theme-provider";
import { Providers } from "@/app/providers";
import { Toaster } from "@/components/ui/toaster";

export function ClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <Providers>
        {children}
      </Providers>
      <Toaster />
    </ThemeProvider>
  );
} 