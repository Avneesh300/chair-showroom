import api from "@/lib/axiosInstance";
import { asyncHandler } from "@/lib/asyncHandler";

// ======================
// REGISTER
// ======================
export const registerApi = asyncHandler(
  async (data: FormData) => {
    const response = await api.post(
      "/users/register",
      data
    );

    return response.data;
  }
);

// ======================
// LOGIN
// ======================
export const loginApi = asyncHandler(
  async (data: FormData) => {
    const response = await api.post(
      "/users/login",
      data
    );

    return response.data;
  }
);

// ======================
// SEND OTP
// ======================
export const sendEmailOtpApi = asyncHandler(
  async (data: FormData) => {
    const response = await api.post(
      "/users/send-email-otp",
      data
    );

    return response.data;
  }
);

// ======================
// VERIFY OTP
// ======================
export const verifyEmailOtpApi = asyncHandler(
  async (data: FormData) => {
    const response = await api.post(
      "/users/verify-email-otp",
      data
    );

    return response.data;
  }
);

// ======================
// GOOGLE LOGIN
// ======================
export const googleLoginApi = asyncHandler(
  async (data: FormData) => {
    const response = await api.post(
      "/users/google-login",
      data
    );

    return response.data;
  }
);

// ======================
// LOGOUT
// ======================
export const logoutApi = asyncHandler(
  async () => {
    const response = await api.post(
      "/users/logout"
    );

    return response.data;
  }
);

export const getUsersApi =
  asyncHandler(async (payload: any) => {
    const response = await api.post("/users/list", payload);
    return response.data;
  });

export const updateUserStatusApi =
  asyncHandler(async (payload: any) => {
    const response = await api.post("/users/status-update", payload);
    return response.data;
  });

  export const sendEmailToUserApi =
  asyncHandler(async (payload: any) => {
    const response = await api.post("/users/send-email", payload);
    return response.data;
  });

  export const sendEmailforgetpasswordApi =
  asyncHandler(async (email: any) => {
    const fd = new FormData();
    fd.append("email", email);
    const response = await api.post("/users/forgot-password", fd);
    return response.data;
  });

export const resetPasswordApi = asyncHandler(
  async (data: {
    email: string;
    otp: string;
    password: string;
    confirmPassword: string;
  }) => {
    const fd = new FormData();

    fd.append("email", data.email);
    fd.append("otp", data.otp);
    fd.append("password", data.password);
    fd.append(
      "confirmPassword",
      data.confirmPassword
    );

    const response = await api.post(
      "/users/reset-password",
      fd
    );

    return response.data;
  }
);