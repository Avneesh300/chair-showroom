import api from "@/lib/axiosInstance";
import { asyncHandler } from "@/lib/asyncHandler";

export const getReportStatsApi =
  asyncHandler(async () => {
    const response = await api.post("/reports/stats", {});
    return response.data;
  });

export const exportOrdersReportApi =
  asyncHandler(async () => {
    const response = await api.post("/reports/export-orders", {});
    return response.data;
  });

export const exportInventoryReportApi =
  asyncHandler(async () => {
    const response = await api.post("/reports/export-inventory", {});
    return response.data;
  });