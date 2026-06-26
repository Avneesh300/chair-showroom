import api from "@/lib/axiosInstance";
import { asyncHandler } from "@/lib/asyncHandler";

export const getDashboardStatsApi =
  asyncHandler(async () => {
    const response = await api.post("/dashboard/stats", {});
    return response.data;
  });