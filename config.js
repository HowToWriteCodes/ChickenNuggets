// Just some random config need not worry about
export const PORT = process.env.PORT || 3000;
export const API_KEY = process.env.API_KEY;
export const CACHE_TIMEOUT = 35 * 60 * 1000; // Recommended: 35 minutes, Min: 30 minutes

export const apiConfig = {
  method: "get",
  url: "",
  baseURL:"https://marvelrivalsapi.com/api/v1/player",
  headers: {
    "x-api-key": API_KEY,
  },
};

