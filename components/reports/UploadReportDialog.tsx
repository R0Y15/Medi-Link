"use client";

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText, Upload, X, File, AlertCircle } from "lucide-react";
import { useReports } from '@/hooks/useReports';
import { useToast } from '@/components/ui/use-toast';

interface UploadReportDialogProps {
  open: boolean;    
  onOpenChange: (open: boolean) => void;
}

const ACCEPTED_FILE_TYPES = {
  'application/pdf': ['.pdf'],
  'image/*': ['.png', '.jpg', '.jpeg'],
};

const REPORT_TYPES = [
  { value: 'laboratory', label: 'Laboratory Report' },
  { value: 'radiology', label: 'Radiology Report' },
  { value: 'prescription', label: 'Prescription' },
  { value: 'vaccination', label: 'Vaccination Record' },
  { value: 'certificate', label: 'Medical Certificate' },
];

export const UploadReportDialog = ({
  open,
  onOpenChange,
}: UploadReportDialogProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [reportType, setReportType] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const { uploadReport } = useReports();
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(prev => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_FILE_TYPES,
    maxFiles: 5,
  });

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (!reportType || files.length === 0) return;

    setUploading(true);
    try {
      // Process each file
      for (const file of files) {
        // 1. Convert file to base64
        const base64Content = await readFileAsBase64(file);
        console.log("Base64 format check:", {
          startsWithData: base64Content.startsWith('data:application/pdf;base64,'),
          totalLength: base64Content.length,
          sampleContent: base64Content.substring(0, 100)
        });
        
        // 2. Read text content (for non-PDF files)
        let content = "";
        if (!file.type.includes('pdf')) {
          content = await readFileContent(file);
        } else {
          // For PDFs, use the base64 content
          content = base64Content;
        }
        
        // 3. Upload to Convex
        await uploadReport({
          title: file.name,
          type: reportType,
          content: content,
          fileUrl: base64Content,
          status: "Processing",
        });
      }

      // Success notification
      toast({
        title: "Reports Uploaded Successfully",
        description: "Your reports are being processed by AI for analysis.",
      });

      // Close dialog and reset state
      onOpenChange(false);
      setFiles([]);
      setReportType('');
    } catch (error) {
      console.error('Upload failed:', error);
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your reports. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Medical Report
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Report Type Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Report Type</label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger>
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                {REPORT_TYPES.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* File Drop Zone */}
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
              transition-colors
              ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}
              hover:border-primary hover:bg-primary/5
            `}
          >
            <input {...getInputProps()} />
            <FileText className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
            {isDragActive ? (
              <p className="text-primary">Drop your files here</p>
            ) : (
              <div className="space-y-2">
                <p className="text-muted-foreground">
                  Drag & drop your files here, or click to select files
                </p>
                <p className="text-xs text-muted-foreground">
                  Supported formats: PDF, PNG, JPG (up to 5 files)
                </p>
              </div>
            )}
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Selected Files</label>
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted"
                  >
                    <div className="flex items-center gap-3">
                      <File className="h-4 w-4 text-primary" />
                      <span className="text-sm truncate max-w-[300px]">
                        {file.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFile(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Warning Message */}
          <div className="flex items-start gap-2 text-sm text-muted-foreground bg-yellow-500/10 p-3 rounded-lg">
            <AlertCircle className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
            <p>
              Make sure your files don&apos;t contain any sensitive personal information that you don&apos;t want to share.
              All uploaded reports will be processed by our AI system to provide insights.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={uploading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!reportType || files.length === 0 || uploading}
            className="gap-2"
          >
            {uploading ? (
              <>
                <div className="h-4 w-4 border-2 border-current border-r-transparent rounded-full animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Upload Report{files.length > 1 ? 's' : ''}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Helper function to read file content (for non-PDF files)
const readFileContent = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = (e) => reject(e);
    reader.readAsText(file);
  });
};

// Helper function to read file as base64
const readFileAsBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      // Remove data URL prefix for PDFs
      const base64String = reader.result as string;
      if (file.type.includes('pdf')) {
        const base64Content = base64String.split(',')[1];
        resolve(`data:application/pdf;base64,${base64Content}`);
      } else {
        resolve(base64String);
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}; 