import api from "@/lib/axiosInstance";
import { asyncHandler } from "@/lib/asyncHandler";

export const getBrandsApi =
  asyncHandler(async (payload: any) => {
    const response = await api.post("/brands/list", payload);
    return response.data;
  });

export const saveBrandApi =
  asyncHandler(async (formData: FormData) => {
    const response = await api.post("/brands/create", formData);
    return response.data;
  });

export const deleteBrandApi =
  asyncHandler(async (payload: any) => {
    const response = await api.post("/brands/delete", payload);
    return response.data;
  });