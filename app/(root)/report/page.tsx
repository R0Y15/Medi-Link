"use client";

import React, { useState, useMemo } from 'react';
import { ChatbotWidget } from '@/components/reports/ChatbotWidget';
import { ReportPreviewModal } from '@/components/reports/ReportPreviewModal';
import { Button } from '@/components/ui/button';
import { Upload, FileText, Search, FileCheck, AlertTriangle, CalendarDays } from 'lucide-react';
import { UploadReportDialog } from "@/components/reports/UploadReportDialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InfoCard } from "@/components/cards/InfoCard";
import { useReports } from "@/hooks/useReports";
import { Id } from "@/convex/_generated/dataModel";
import { useToast } from "@/components/ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";

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

const ReportItem = ({ report, onDelete, onClick, formatDate }: { 
  report: Report; 
  onDelete: (id: Id<"reports">) => void;
  onClick: () => void;
  formatDate: (timestamp: number) => string;
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [startX, setStartX] = useState(0);
  const [offsetX, setOffsetX] = useState(0);
  const deleteThreshold = 100; // pixels to swipe to trigger delete

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    // Only allow swipe left (negative values)
    if (diff < 0) {
      setOffsetX(diff);
    }
  };

  const handleTouchEnd = () => {
    if (offsetX < -deleteThreshold) {
      setIsDeleting(true);
      onDelete(report._id);
    }
    setOffsetX(0);
  };

  return (
    <motion.div
      initial={{ opacity: 1, x: 0 }}
      animate={{ 
        opacity: isDeleting ? 0 : 1,
        x: offsetX 
      }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.2 }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative"
    >
      <div
        onClick={onClick}
        className="flex items-center gap-4 p-4 rounded-lg border cursor-pointer hover:bg-accent transition-colors"
      >
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <FileText className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium truncate">{report.title}</h3>
          <p className="text-sm text-muted-foreground">
            {report.type} • {formatDate(report._creationTime)}
          </p>
        </div>
        <Badge variant={report.status === 'Normal' ? 'default' : 'destructive'}>
          {report.status.startsWith('Analysis Failed:') ? 'Analysis Failed' : report.status}
        </Badge>
      </div>
      {/* Delete indicator */}
      <div 
        className="absolute inset-y-0 right-0 flex items-center justify-end pr-4 pointer-events-none"
        style={{
          opacity: Math.min(Math.abs(offsetX) / deleteThreshold, 1)
        }}
      >
        <div className="bg-destructive text-destructive-foreground px-3 py-1 rounded">
          Delete
        </div>
      </div>
    </motion.div>
  );
};

const ReportsPage = () => {
  const { reports, isLoading, deleteReport } = useReports();
  const { toast } = useToast();
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleReportClick = (report: Report) => {
    setSelectedReport(report);
    setIsPreviewOpen(true);
  };

  const handleStartChat = () => {
    // Scroll to chatbot and focus input
    const chatInput = document.querySelector('iframe');
    chatInput?.scrollIntoView({ behavior: 'smooth' });
  };

  const filteredReports = useMemo(() => {
    if (!reports) return [];
    return reports.filter(report => {
      const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          report.type.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedType === 'all' || report.type.toLowerCase() === selectedType;
      const matchesStatus = selectedStatus === 'all' || report.status === selectedStatus;
      
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [reports, searchQuery, selectedType, selectedStatus]);

  // Calculate stats from reports
  const stats = useMemo(() => {
    if (!reports) return { total: 0, normal: 0, needsReview: 0, latestUpload: 'No reports' };
    const total = reports.length;
    const normal = reports.filter(r => r.status === 'Normal').length;
    const needsReview = reports.filter(r => r.status === 'Review Required').length;
    const latestUpload = reports[0] ? formatDate(reports[0]._creationTime) : 'No reports';

    return { total, normal, needsReview, latestUpload };
  }, [reports, formatDate]);

  const handleDelete = async (id: Id<"reports">) => {
    try {
      await deleteReport({ id });
      toast({
        title: "Report deleted",
        description: "The report has been permanently deleted.",
      });
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
    <div className="h-[calc(100vh-7rem)] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Medical Reports</h2>
          <p className="text-sm text-muted-foreground">
            View and manage your medical reports
          </p>
        </div>
        <Button onClick={() => setIsUploadOpen(true)} className="gap-2">
          <Upload className="h-4 w-4" />
          Upload Report
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <InfoCard
          img={<FileText className="h-5 w-5" />}
          title="Total Reports"
          time={`${stats.total} Reports`}
          desc="All time"
        />
        <InfoCard
          img={<FileCheck className="h-5 w-5" />}
          title="Normal Reports"
          time={`${stats.normal} Reports`}
          highlight={true}
        />
        <InfoCard
          img={<AlertTriangle className="h-5 w-5" />}
          title="Needs Review"
          time={`${stats.needsReview} Reports`}
          highlight={stats.needsReview > 0}
        />
        <InfoCard
          img={<CalendarDays className="h-5 w-5" />}
          title="Latest Upload"
          time={stats.latestUpload}
        />
      </div>

      <div className="flex-1 min-h-0 flex gap-6">
        {/* Reports List Section */}
        <div className="flex-1 overflow-hidden rounded-xl border bg-card">
          <div className="h-full flex flex-col">
            {/* Search and Filters */}
            <div className="flex gap-4 p-6 pb-0">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search reports..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Report Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="laboratory">Laboratory</SelectItem>
                  <SelectItem value="radiology">Radiology</SelectItem>
                  <SelectItem value="prescription">Prescription</SelectItem>
                  <SelectItem value="vaccination">Vaccination</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Normal">Normal</SelectItem>
                  <SelectItem value="Review Required">Review Required</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Reports List */}
            <div className="flex-1 overflow-y-auto p-6 pt-4">
              <div className="space-y-4">
                {isLoading ? (
                  <div className="text-center py-10">
                    <div className="animate-spin h-10 w-10 mx-auto mb-4">
                      <FileText className="text-muted-foreground" />
                    </div>
                    <h3 className="font-medium mb-1">Loading reports...</h3>
                  </div>
                ) : filteredReports.length > 0 ? (
                  <AnimatePresence>
                    {filteredReports.map((report) => (
                      <ReportItem
                        key={report._id}
                        report={report}
                        onDelete={handleDelete}
                        onClick={() => handleReportClick(report)}
                        formatDate={formatDate}
                      />
                    ))}
                  </AnimatePresence>
                ) : (
                  <div className="text-center py-10">
                    <FileText className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="font-medium mb-1">No reports found</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {searchQuery || selectedType !== 'all' || selectedStatus !== 'all'
                        ? "Try adjusting your filters"
                        : "Upload your medical reports to get started"
                      }
                    </p>
                    {!searchQuery && selectedType === 'all' && selectedStatus === 'all' && (
                      <Button onClick={() => setIsUploadOpen(true)} variant="outline" className="gap-2">
                        <Upload className="h-4 w-4" />
                        Upload Report
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Chatbot Section */}
        <div className="w-[400px] rounded-xl border bg-card">
          <ChatbotWidget />
        </div>
      </div>

      {/* Modals */}
      <ReportPreviewModal
        report={selectedReport}
        open={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
        onStartChat={handleStartChat}
      />
      <UploadReportDialog
        open={isUploadOpen}
        onOpenChange={setIsUploadOpen}
      />
    </div>
  );
};

export default ReportsPage;