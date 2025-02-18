/* Pulls out match history,
Does processing on it, caches itsends back the result */

import axios from "axios";
import { apiConfig, CACHE_TIMEOUT } from "../config.js";
import { CacheService } from "../cache/cacheService.js";
import { updateData } from "./updateService.js";

// Create and export cache instance
export const historyCache = new CacheService(300000);

const CACHE_TIMEOUT = 35 * 60 * 1000; // Recommended: 35 minutes, Min: 30 minutes

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
  try {
    // First call update API
    await updateData(UID);
    
    // Wait 20 seconds for data to propagate
    console.log(`Waiting 20s for ${UID} history to update...`);
    await new Promise(resolve => setTimeout(resolve, 20000));
    
    // Now fetch and cache fresh data
    await fetchAndCacheHistory(UID)
      .catch(err => console.error('Failed to fetch updated history:', err));
      
  } catch (err) {
    console.error('Background history cache update failed:', err);
  }
}

async function fetchAndCacheHistory(UID) {
  const response = await axios.request({ ...apiConfig, url:`/${UID}/` });
  const results = processHistoryData(response.data);
  
  historyCache.set(UID, {
    value: results,
    timestamp: Date.now()
  });
  
  return results;
}


/* Make changes here to change the way your history is processsed */

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