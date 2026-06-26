import api from "@/lib/axiosInstance";
import { asyncHandler } from "@/lib/asyncHandler";

export const addToCartApi =
  asyncHandler(async (payload: any) => {
    const response = await api.post("/carts/create", payload);
    return response.data;
  });

export const getCartApi =
  asyncHandler(async (payload: any) => {
    const response = await api.post("/carts/list", payload);
    return response.data;
  });

export const deleteCartApi =
  asyncHandler(async (payload: any) => {
    const response = await api.post("/carts/delete", payload);
    return response.data;
  });

export const applyCouponApi =
  asyncHandler(async (payload: any) => {
    const response = await api.post("/coupons/apply-coupon", payload);
    return response.data;
  });