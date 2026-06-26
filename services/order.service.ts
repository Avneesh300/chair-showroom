import api from "@/lib/axiosInstance";
import { asyncHandler } from "@/lib/asyncHandler";

export const createOrderApi =
  asyncHandler(async (payload: any) => {
    const response = await api.post("/orders/create", payload);
    return response.data;
  });

export const createPaymentOrderApi =
  asyncHandler(async (payload: any) => {
    const response = await api.post("/orders/create-payment-order", payload);
    return response.data;
  });

export const verifyPaymentApi =
  asyncHandler(async (payload: any) => {
    const response = await api.post("/orders/verify-payment", payload);
    return response.data;
  });

export const getOrdersApi =
  asyncHandler(async (payload: any) => {
    const response = await api.post("/orders/list", payload);
    return response.data;
  });

export const getOrderDetailApi =
  asyncHandler(async (payload: any) => {
    const response = await api.post("/orders/detail", payload);
    return response.data;
  });

  export const createTempPaymentOrderApi =
  asyncHandler(async (payload: any) => {
    const response = await api.post("/orders/create-temp-payment", payload);
    return response.data;
  });

  export const cancelOrderApi =
  asyncHandler(async (payload: any) => {
    const response = await api.post("/orders/status-update", payload);
    return response.data;
  });

  export const paymentStatusUpdateApi = asyncHandler(async (payload: any) => {
  const response = await api.post("/orders/payment-status-update", payload);
  return response.data;
});