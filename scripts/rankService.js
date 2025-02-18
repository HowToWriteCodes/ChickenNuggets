// rankService.js
import axios from "axios";
import { apiConfig, CACHE_TIMEOUT } from "../config.js";
import { getRank } from "./rankUtils.js";
import { CacheService } from "../cache/cacheService.js";
import { updateData } from "./updateService.js";
// Create and export cache instance
export const rankCache = new CacheService(300000);

export async function fetchPlayerData(UID) {
  try {
    const cachedEntry = rankCache.get(UID);
    
    if (cachedEntry) {
      // Check if cache is stale
      if (Date.now() - cachedEntry.timestamp > CACHE_TIMEOUT) {
        // Update in background but return existing cache
        updateCacheInBackground(UID);
      }
      return cachedEntry.value; // Return the cached value
    }

    return await fetchAndCacheData(UID);

  } catch (error) {
    console.error('Error fetching player data:', error.message);
    throw error;
  }
}

async function updateCacheInBackground(UID) {
  try {
    // First call update API
    await updateData(UID);
    
    // Wait 20 seconds for data to propagate
    console.log(`Waiting 20s for ${UID} data to update...`);
    await new Promise(resolve => setTimeout(resolve, 20000));
    
    // Now fetch and cache fresh data
    await fetchAndCacheData(UID)
      .catch(err => console.error('Failed to fetch updated data:', err));
      
  } catch (err) {
    console.error('Background cache update failed:', err);
  }
}

async function fetchAndCacheData(UID) {
  const url = `https://marvelrivalsapi.com/api/v1/player/${UID}`;
  const response = await axios.request({...apiConfig, url});
  
  if (!response.data) {
    throw new Error('No data received from API');
  }

  const result = processPlayerData(response.data);
  
  // Store with timestamp
  rankCache.set(UID, {
    value: result,
    timestamp: Date.now()
  });
  
  return result;
}

function processPlayerData(data) {
  const rankData = data.match_history;
  const targetGame = rankData.find(game => game.game_mode_id === 2);
  let points = 3000;
  let rankVal = 1;

  if (targetGame?.player_performance) {
    points = targetGame.player_performance.new_score ?? 3000;
    rankVal = targetGame.player_performance.new_level ?? 1;
  } else {
    const tempFallback = data?.player?.info?.rank_game_season ?? {};
    const recentSeason = Object.keys(tempFallback).sort().reverse()[0];
    points = tempFallback[recentSeason]?.rank_score ?? 3000;
    rankVal = tempFallback[recentSeason]?.level ?? 1;
  }

  const [eloRating, rankName] = getRank(rankVal);
  const finalElo = parseInt(points) - eloRating;
  return `${rankName} [${finalElo}]`;
}