"use client";

import React, { useState, useEffect } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { useTheme } from "next-themes";

export const ChatbotWidget = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();
  const [iframeUrl, setIframeUrl] = useState("");

  useEffect(() => {
    // Construct URL with theme parameter
    const baseUrl = "https://embeddable-bot.vercel.app/widget";
    const url = new URL(baseUrl);
    url.searchParams.set("theme", theme === "dark" ? "dark" : "light");
    setIframeUrl(url.toString());
  }, [theme]);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setError("Failed to load the chatbot. Please refresh the page.");
    setIsLoading(false);
  };

  return (
    <div className="relative h-full w-full bg-card rounded-2xl shadow-sm overflow-hidden">
      <div className="flex flex-col h-full">
        {/* Chat Header */}
        <div className="p-4 border-b border-border">
          <h3 className="text-lg font-semibold">Chat Support</h3>
          <p className="text-sm text-muted-foreground">AI Chat Assistant</p>
        </div>

        {/* Chat Content */}
        <div className="flex-1 relative min-h-0">
          {isLoading && (
            <div className="absolute inset-0 p-4 space-y-4">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-8 w-2/3" />
            </div>
          )}
          
          {error ? (
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <p className="text-destructive text-center">{error}</p>
            </div>
          ) : (
            <iframe 
              src={iframeUrl}
              width="100%"
              height="100%"
              frameBorder="0"
              className="w-full h-full bg-background"
              onLoad={handleIframeLoad}
              onError={handleIframeError}
            />
          )}
        </div>
      </div>
    </div>
  );
}; 