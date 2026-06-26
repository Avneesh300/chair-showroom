import api from "@/lib/axiosInstance";
import { asyncHandler } from "@/lib/asyncHandler";

export const addWishlistApi =
  asyncHandler(async (payload: any) => {
    const response = await api.post("/wishlists/create", payload);
    return response.data;
  });

export const getWishlistApi =
  asyncHandler(async (payload: any) => {
    const response = await api.post("/wishlists/list", payload);
    return response.data;
  });

export const deleteWishlistApi =
  asyncHandler(async (payload: any) => {
    const response = await api.post("/wishlists/delete", payload);
    return response.data;
  });