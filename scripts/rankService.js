/*Fetches MMR from Marvel Rivals API
and returns the corresponding rank*/

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

    if (targetGame) {
      points = targetGame.player_performance.new_score;
      rankVal = targetGame.player_performance.new_level;
    } else {
      const tempFallback = response.data.player.info.rank_game_season;
      const recentSeason = Object.keys(tempFallback).sort.reverse()[0];
      points = tempFallback[recentSeason].rank_score;
      rankVal = tempFallback[recentSeason].level;
    }

    var [ elo,rank ] = getRank(rankVal);
    elo = elo - parseInt(points);
    
    return `${rank} [${elo}]`;
  } catch (error) {
    console.log("Timed Out");
  }
}
