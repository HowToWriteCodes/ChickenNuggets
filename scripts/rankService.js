/*Fetches MMR from Marvel Rivals API
and returns the corresponding rank*/

import axios from "axios";
import { apiConfig } from "../config.js";
import { getRank } from "./rankUtils.js";


export async function fetchPlayerData(UID) {

  const url = `https://marvelrivalsapi.com/api/v1/player/${UID}`
 
  try {
    const response = await axios.request({...apiConfig, url});

    /*const rankData = response.data.player.info.rank_game_season;
    const points = rankData["1001002"].rank_score;
    Broken as on 06/0/2025 */
    
    /* Alternate way for the time being
    Will switch back to original later */
    
    const rankData = response.data.match_history[0];
    const points = rankData.player_performance.new_score;
    const rank = getRank(points);
    
    if (rank != "Eternity") {
      return `${rank} [${Math.round(points % 100)}RS]`;
    } else {
      return `${rank} [${Math.round(points - 5000)}RS]`;
    }
  } catch (error) {
    console.log("Timed Out");
  }
}
