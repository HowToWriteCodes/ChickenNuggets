// config.js
export const PORT = process.env.PORT || 3000;
export const API_KEY = process.env.API_KEY;
export const CACHE_TTL = 300000; // 5 minutes in milliseconds

export const apiConfig = {
  method: "get",
  url: "",
  headers: {
    "x-api-key": API_KEY,
  },
};