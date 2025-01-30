"use client";

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Share2, MessageSquare, Copy, ExternalLink, FileText, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Id } from "@/convex/_generated/dataModel";
import { useReports } from "@/hooks/useReports";
import { useToast } from "@/components/ui/use-toast";

interface Report {
  _id: Id<"reports">;
  title: string;
  _creationTime: number;
  type: string;
  status: string;
  content: string;
  fileUrl: string;
  aiAnalysis?: {
    summary: string;
    keyFindings: string[];
    recommendations: string[];
    needsReview: boolean;
    confidence: number;
  };
}

interface ReportPreviewModalProps {
  report: Report | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStartChat: () => void;
}

export const ReportPreviewModal = ({
  report,
  open,
  onOpenChange,
  onStartChat
}: ReportPreviewModalProps) => {
  const { deleteReport } = useReports();
  const { toast } = useToast();
  
  if (!report) return null;

  const handleDownload = async () => {
    if (!report.fileUrl) {
      toast({
        title: "Error",
        description: "Download URL not available",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(report.fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = report.title || 'report';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
      toast({
        title: "Error",
        description: "Failed to download the file. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleShare = () => {
    // Implement share functionality
    // For now, copy share link
    navigator.clipboard.writeText(`Share link for ${report.title}`);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleDelete = async () => {
    try {
      await deleteReport({ id: report._id });
      toast({
        title: "Report deleted",
        description: "The report has been permanently deleted.",
      });
      onOpenChange(false);
    } catch (err) {
      console.error("Failed to delete report:", err);
      toast({
        title: "Error",
        description: "Failed to delete the report. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl h-[85vh] p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-1">{report.title}</h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{formatDate(report._creationTime)}</span>
                  <span>•</span>
                  <span>{report.type}</span>
                  <span>•</span>
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-xs font-medium",
                    report.status === "Normal" 
                      ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400"
                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-400"
                  )}>
                    {report.status}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleDownload}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Download</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleShare}
                className="gap-2"
              >
                <Share2 className="h-4 w-4" />
                <span className="hidden sm:inline">Share</span>
              </Button>
              <Button 
                variant="default"
                size="sm" 
                onClick={onStartChat}
                className="gap-2"
              >
                <MessageSquare className="h-4 w-4" />
                <span className="hidden sm:inline">Ask AI</span>
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-1 min-h-0">
          {/* Main Content */}
          <div className="flex-1 overflow-auto p-6">
            {report.aiAnalysis ? (
              <div className="prose prose-sm dark:prose-invert max-w-none space-y-8">
                <div className="bg-muted rounded-lg p-6">
                  <h2 className="text-xl font-semibold mb-4">AI Analysis</h2>
                  
                  {/* Summary */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Summary</h3>
                    <p className="text-muted-foreground">{report.aiAnalysis.summary}</p>
                  </div>

                  {/* Key Findings */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Key Findings</h3>
                    <ul className="list-disc list-inside space-y-2">
                      {report.aiAnalysis.keyFindings.map((finding, index) => (
                        <li key={index} className="text-muted-foreground">{finding}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Recommendations */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Recommendations</h3>
                    <ul className="list-disc list-inside space-y-2">
                      {report.aiAnalysis.recommendations.map((rec, index) => (
                        <li key={index} className="text-muted-foreground">{rec}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Analysis Metadata */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className={cn(
                      "px-2 py-0.5 rounded-full",
                      report.aiAnalysis.needsReview
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-400"
                        : "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400"
                    )}>
                      {report.aiAnalysis.needsReview ? 'Needs Review' : 'Analysis Complete'}
                    </span>
                    <span>Confidence: {Math.round(report.aiAnalysis.confidence * 100)}%</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <FileText className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-medium mb-2">Analysis Not Available</h3>
                  <p className="text-sm text-muted-foreground">
                    The AI analysis for this report is not available yet.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions Sidebar */}
          <div className="w-72 border-l bg-background p-4 space-y-4 overflow-y-auto">
            <div>
              <h4 className="font-medium mb-2">Quick Actions</h4>
              <div className="space-y-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start gap-2"
                  onClick={() => navigator.clipboard.writeText(report._id)}
                >
                  <Copy className="h-4 w-4" />
                  Copy Report ID
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start gap-2"
                  onClick={() => {
                    if (!report.fileUrl) {
                      toast({
                        title: "Error",
                        description: "File URL not available",
                        variant: "destructive",
                      });
                      return;
                    }
                    window.open(report.fileUrl, '_blank', 'noopener,noreferrer');
                  }}
                >
                  <ExternalLink className="h-4 w-4" />
                  Open in New Tab
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={handleDelete}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Report
                </Button>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Suggested Questions</h4>
              <div className="space-y-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start text-left h-auto py-2 whitespace-normal"
                  onClick={onStartChat}
                >
                  What do these results mean?
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start text-left h-auto py-2 whitespace-normal"
                  onClick={onStartChat}
                >
                  Are my values within normal range?
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start text-left h-auto py-2 whitespace-normal"
                  onClick={onStartChat}
                >
                  What should I do next?
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 