import api from "@/lib/axiosInstance";
import { asyncHandler } from "@/lib/asyncHandler";

export const getSettingsApi =
  asyncHandler(async () => {
    const response = await api.post("/settings/get", {});
    return response.data;
  });

export const saveSettingsApi =
  asyncHandler(async (payload: any) => {
    const response = await api.post("/settings/save", payload);
    return response.data;
  });