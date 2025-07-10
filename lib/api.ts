import axios from "axios"

// Create axios instance with base URL
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
})

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem("accessToken")

    // If token exists, add to headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    // If error is 401 (Unauthorized) and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Try to refresh token
        const refreshToken = localStorage.getItem("refreshToken")
        if (!refreshToken) {
          // No refresh token, clear auth and redirect to login
          localStorage.removeItem("accessToken")
          localStorage.removeItem("refreshToken")
          return Promise.reject(error)
        }

        // Call refresh token endpoint
        const response = await axios.post(`${api.defaults.baseURL}/auth/refresh`, {
          refreshToken,
        })

        // Store new tokens
        const { accessToken, refreshToken: newRefreshToken } = response.data
        localStorage.setItem("accessToken", accessToken)
        localStorage.setItem("refreshToken", newRefreshToken)

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        return api(originalRequest)
      } catch (refreshError) {
        // Refresh token failed, clear auth
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)
