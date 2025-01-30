import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export const useReports = () => {
  // Fetch all reports
  const reports = useQuery(api.reports.getReports);
  
  // Upload report mutation
  const uploadReport = useMutation(api.reports.uploadReport);
  
  // Generate new insights mutation
  const generateInsights = useMutation(api.reports.generateInsights);

  // Delete report mutation
  const deleteReport = useMutation(api.reports.deleteReport);

  return {
    reports,
    uploadReport,
    generateInsights,
    deleteReport,
    isLoading: reports === undefined,
  };
}; 