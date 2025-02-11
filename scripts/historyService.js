// historyService.js
import axios from "axios";
import { apiConfig } from "../config.js";
import { CacheService } from "../cache/cacheService.js";

// Create and export cache instance
export const historyCache = new CacheService(300000);

const CACHE_TIMEOUT = 35 * 60 * 1000; // 35 minutes

export async function processLastFiveGames(UID) {
  const cachedEntry = historyCache.get(UID);
  
  if (cachedEntry) {
    if (Date.now() - cachedEntry.timestamp > CACHE_TIMEOUT) {
      // Return cache but update in background
      updateHistoryCacheInBackground(UID);
    }
    return cachedEntry.value;
  }

  return await fetchAndCacheHistory(UID);
}

async function updateHistoryCacheInBackground(UID) {
  fetchAndCacheHistory(UID).catch(err => 
    console.error('Background history cache update failed:', err)
  );
}

async function fetchAndCacheHistory(UID) {
  const url = `https://marvelrivalsapi.com/api/v1/player/${UID}`;
  const response = await axios.request({ ...apiConfig, url });
  const results = processHistoryData(response.data);
  
  historyCache.set(UID, {
    value: results,
    timestamp: Date.now()
  });
  
  return results;
}

function processHistoryData(data) {
  const lastFiveGames = data.match_history.slice(0, 5);
  const results = lastFiveGames.map((item) => {
    const isWin = item.player_performance?.is_win.score;
    if (isWin === 0) return "L";
    if (isWin === 1) return "W";
    if (isWin === 2) return "D";
    return "N/A";
  });
  return results.join(" ");
}