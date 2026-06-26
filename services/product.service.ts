import api from "@/lib/axiosInstance";
import { asyncHandler } from "@/lib/asyncHandler";

export const getProductsApi =
  asyncHandler(async (payload: any) => {
    const response = await api.post("/products/list", payload);
    return response.data;
  });

export const saveProductApi =
  asyncHandler(async (formData: FormData) => {
    const response = await api.post("/products/create", formData);
    return response.data;
  });

export const deleteProductApi =
  asyncHandler(async (payload: any) => {
    const response = await api.post("/products/delete", payload);
    return response.data;
  });

export const getProductDetailApi =
  asyncHandler(async (payload: any) => {
    const response = await api.post("/products/detail", payload);
    return response.data;
  });