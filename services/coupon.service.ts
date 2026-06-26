import api from "@/lib/axiosInstance";
import { asyncHandler } from "@/lib/asyncHandler";

export const getCouponsApi =
  asyncHandler(async (payload: any) => {
    const response = await api.post("/coupons/list", payload);
    return response.data;
  });

export const saveCouponApi =
  asyncHandler(async (payload: any) => {
    const response = await api.post("/coupons/create", payload);
    return response.data;
  });

export const deleteCouponApi =
  asyncHandler(async (payload: any) => {
    const response = await api.post("/coupons/delete", payload);
    return response.data;
  });