// frontend/src/services/api.js

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const getToken = () => localStorage.getItem("ssc_token");

const request = async (method, endpoint, body = null) => {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      credentials: "include",
    });

    let data = {};

    if (response.status !== 204) {
      data = await response.json();
    }

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong.");
    }

    return data;
  } catch (error) {
    console.error("API ERROR =", error);
    throw new Error(error.message || "Unable to connect to the server.");
  }
};

export const api = {
  get: (endpoint) => request("GET", endpoint),

  post: (endpoint, body) => request("POST", endpoint, body),

  put: (endpoint, body) => request("PUT", endpoint, body),

  patch: (endpoint, body) => request("PATCH", endpoint, body),

  delete: (endpoint) => request("DELETE", endpoint),
};
