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
    <div className="relative bg-card rounded-xl shadow-sm overflow-hidden w-full h-full border border-border max-h-full">
      <div className="flex flex-col h-full">
        {/* Header - can be uncommented if needed */}
        <div className="py-2 px-3 border-b border-border bg-transparent flex items-center">
          <h3 className="text-sm font-medium">AI Chat Support</h3>
        </div>
        
        {/* Chat Content */}
        <div className="relative flex-grow overflow-hidden h-full flex flex-col">
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
              scrolling="no"
              className="w-full h-full flex-grow bg-background"
              onLoad={handleIframeLoad}
              onError={handleIframeError}
              style={{ overflow: 'hidden' }}
            />
          )}
        </div>
      </div>
    </div>
  );
}; 