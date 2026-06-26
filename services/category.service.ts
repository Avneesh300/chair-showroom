import api from "@/lib/axiosInstance";
import { asyncHandler } from "@/lib/asyncHandler";

export const getCategoriesApi =
  asyncHandler(async (payload: any) => {
    const response = await api.post(
      "/categories/list",
      payload
    );

    return response.data;
  });

export const saveCategoryApi =
  asyncHandler(async (formData: FormData) => {
    const response = await api.post(
      "/categories/create",
      formData
    );

    return response.data;
  });

export const deleteCategoryApi =
  asyncHandler(async (payload: any) => {
    const response = await api.post(
      "/categories/delete",
      payload
    );

    return response.data;
  });