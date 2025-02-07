/*Fetches MMR from Marvel Rivals API
and returns the corresponding rank*/

import axios from "axios";
import { apiConfig } from "../config.js";
import { getRank } from "./rankUtils.js";


export async function fetchPlayerData(UID) {

  const url = `https://marvelrivalsapi.com/api/v1/player/${UID}`
 
  try {
    const response = await axios.request({...apiConfig, url});

    const rankData = response.data.player.info.rank_game_season;
    const points = rankData["1001002"].rank_score;
    
    const elo = getRank(points) - parseInt(points);
    const rank = response.data.player.rank.rank;
    
    if (rank != "Eternity") {
      return `${rank} [${elo}]`;
    } else {
      return `${rank} [${parseInt(points - 5000)}]`;
    }
  } catch (error) {
    console.log("Timed Out");
  }
}


  /* Alternate way for the time being
    Will switch back to original later  

    const rankData = response.data.match_history;

    const targetGame = rankData.find(game => game.game_mode_id === 2);

    var points;

    if (targetGame) {
      points = targetGame.player_performance.new_score;
    } else {
      const tempFallback = response.data.player.info.rank_game_season
      points = tempFallback["1001002"].rank_score
    }
    */