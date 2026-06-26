import axios from "axios";
import { API_BASE_URL } from "@/config";

// ================================
// AXIOS INSTANCE
// ================================
const api = axios.create({
  baseURL: API_BASE_URL,
});

// ================================
// TOKEN HELPERS
// ================================
const getAccessToken = () =>
  localStorage.getItem("token");

const getRefreshToken = () =>
  localStorage.getItem("refresh_token");

const setAuthData = (
  accessToken: string,
  refreshToken: string
) => {
  localStorage.setItem(
    "token",
    accessToken
  );

  localStorage.setItem(
    "refresh_token",
    refreshToken
  );
};

const clearSession = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user_data");

  window.location.replace("/login");
};

// ================================
// REQUEST INTERCEPTOR
// ================================
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ================================
// REFRESH CONTROL
// ================================
let isRefreshing = false;

let failedQueue: {
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}[] = [];

const processQueue = (
  error: any,
  token: string | null = null
) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });

  failedQueue = [];
};

// ================================
// REFRESH TOKEN API
// ================================
const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    clearSession();
    return null;
  }

  try {
    const fd = new FormData();

    fd.append(
      "refreshToken",
      refreshToken
    );

    const response = await axios.post(
      `${API_BASE_URL}users/refresh-token`,
      fd,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      }
    );

    const data = response.data;

    if (data?.status !== "success") {
      clearSession();
      return null;
    }

    const newAccessToken =
      data.data.accessToken;

    const newRefreshToken =
      data.data.refreshToken;

    setAuthData(
      newAccessToken,
      newRefreshToken
    );

    return newAccessToken;
  } catch (error) {
    console.error(
      "Refresh token failed:",
      error
    );

    clearSession();
    return null;
  }
};

// ================================
// RESPONSE INTERCEPTOR
// ================================
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise(
          (resolve, reject) => {
            failedQueue.push({
              resolve,
              reject,
            });
          }
        ).then((token) => {
          originalRequest.headers.Authorization =
            `Bearer ${token}`;

          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken =
          await refreshAccessToken();

        if (!newToken) {
          throw new Error(
            "Token refresh failed"
          );
        }

        api.defaults.headers.common.Authorization =
          `Bearer ${newToken}`;

        processQueue(null, newToken);

        originalRequest.headers.Authorization =
          `Bearer ${newToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);

        clearSession();

        return Promise.reject(
          refreshError
        );
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;