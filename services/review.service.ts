import api from "@/lib/axiosInstance";
import { asyncHandler } from "@/lib/asyncHandler";

export const submitReviewApi =
  asyncHandler(async (payload: any) => {
    const response = await api.post("/reviews/create", payload);
    return response.data;
  });

export const getProductReviewsApi =
  asyncHandler(async (payload: any) => {
    const response = await api.post("/reviews/list", payload);
    return response.data;
  });

export const deleteReviewApi =
  asyncHandler(async (payload: any) => {
    const response = await api.post("/reviews/delete", payload);
    return response.data;
  });