import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const axiosInstance = axios.create({
  baseURL: "https://voting-app-kczk.onrender.com/api",
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("userToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const apiService = {
  get: async (path) => {
    try {
      const response = await axiosInstance.get(path);
      return response;
    } catch (error) {
      console.error("Error during API request:", error);
      throw error;
    }
  },

  post: async (path, data) => {
    try {
      const response = await axiosInstance.post(path, data);
      return response.data;
    } catch (error) {
      console.error("Error during API request:", error);
      throw error;
    }
  },

  delete: async (path) => {
    try {
      const response = await axiosInstance.delete(path);
      return response.data;
    } catch (error) {
      console.error("Error during API request:", error);
      throw error;
    }
  },

  put: async (path, data) => {
    try {
      const response = await axiosInstance.put(path, data);
      return response.data;
    } catch (error) {
      console.error("Error during API request:", error);
      throw error;
    }
  },

  patch: async (path, data) => {
    try {
      const response = await axiosInstance.patch(path, data);
      return response.data;
    } catch (error) {
      console.error("Error during API request:", error);
      throw error;
    }
  },
};
