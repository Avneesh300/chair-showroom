import { toast } from "react-toastify";

export const asyncHandler = (asyncFunc: Function) => {
  return async (...args: any[]) => {
    try {
      return await asyncFunc(...args);
    } catch (error: any) {
      console.error("API Error:", error);

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";

      toast.error(message);
    }
  };
};