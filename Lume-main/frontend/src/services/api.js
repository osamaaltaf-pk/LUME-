import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://backend-nine-pi-24.vercel.app/api'

const api = axios.create({
  baseURL: API_BASE_URL,
})

//adding token to request automatically

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

// Response interceptor for refreshing tokens
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401/403 and we haven't tried to refresh yet
    if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        // Call refresh endpoint (using axios directly to avoid interceptor loop)
        const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, { refreshToken });

        const { accessToken } = response.data;

        if (accessToken) {
          localStorage.setItem('accessToken', accessToken);

          // Update header and retry original request
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }

      } catch (refreshError) {
        // If refresh fails, logout user
        console.error('Token refresh failed:', refreshError);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userData');
        window.location.href = '/login'; // Force redirect
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export { api }