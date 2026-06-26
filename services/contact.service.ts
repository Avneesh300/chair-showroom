import api from "@/lib/axiosInstance";
import { asyncHandler } from "@/lib/asyncHandler";

export const submitContactApi =
  asyncHandler(async (payload: any) => {
    const response = await api.post("/contacts/submit", payload);
    return response.data;
  });