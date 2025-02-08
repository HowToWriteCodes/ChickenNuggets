/*Fetches MMR from Marvel Rivals API
and returns the corresponding rank
*/

import axios from "axios";
import { apiConfig } from "../config.js";
import { getRank } from "./rankUtils.js";


export async function fetchPlayerData(UID) {

  const url = `https://marvelrivalsapi.com/api/v1/player/${UID}`
 
  try {
    const response = await axios.request({...apiConfig, url});

    const rankData = response.data.match_history;
    const targetGame = rankData.find(game => game.game_mode_id === 2);
    var points,rankVal;

    if (targetGame && targetGame.player_performance) {
      points = targetGame.player_performance.new_score ?? 3000;
      rankVal = targetGame.player_performance.new_level ?? 1;
    } else {
      const tempFallback = response.data?.player?.info?.rank_game_season ?? {};
      const recentSeason = Object.keys(tempFallback).sort().reverse()[0];
      points = tempFallback[recentSeason]?.rank_score ?? 3000;
      rankVal = tempFallback[recentSeason]?.level ?? 1;
    }
    

    var [ eloRating,rankName ] = getRank(rankVal);
    eloRating = parseInt(points) - eloRating;
    
    return `${rankName} [${eloRating}]`;
  } catch (error) {
    console.log("Timed Out");
  }
}
