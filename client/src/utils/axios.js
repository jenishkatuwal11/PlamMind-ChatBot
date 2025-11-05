import axios from "axios";

// Create an Axios instance
const instance = axios.create({
  baseURL: "http://localhost:8000/api", // Backend API URL
  withCredentials: true, // To include cookies in the request
});

// Add request interceptor to attach access token in the header
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration and refresh it
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      // If the access token has expired, refresh it using the refresh token
      try {
        const refreshResponse = await axios.post(
          "http://localhost:8000/api/refresh-token", // Refresh token endpoint
          {},
          { withCredentials: true }
        );

        const newAccessToken = refreshResponse.data.accessToken;
        localStorage.setItem("accessToken", newAccessToken); // Save new access token

        // Retry the original request with the new access token
        error.config.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return axios(error.config); // Retry the failed request
      } catch (refreshError) {
        // Handle the error when refreshing the token (logout, redirect, etc.)
        console.log("Token refresh failed", refreshError);
        window.location.href = "/login"; // Redirect to login if token refresh fails
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
