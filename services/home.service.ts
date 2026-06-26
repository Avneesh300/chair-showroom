import api from "@/lib/axiosInstance";
import { asyncHandler } from "@/lib/asyncHandler";

export const getHomeDataApi =
  asyncHandler(async () => {
    const response = await api.post("/home/data", {});
    return response.data;
  });