/* Fetches match history from Marvel Rivals API
and returns the last five games results as a string*/

import axios from "axios";
import { apiConfig } from "../config.js";

export async function processLastFiveGames(UID) {
  const url = `https://marvelrivalsapi.com/api/v1/player/${UID}`;

  const response = await axios.request({ ...apiConfig, url });

  const lastFiveGames = response.data.match_history.slice(0, 5);

  const results = lastFiveGames.map((item) => {
    const isWin = item.player_performance?.is_win;
    if (isWin === 1) return "W";
    if (isWin === 0) return "L";
    return "N/A"; // For any unexpected cases
  });
  return results.join(" ");
}
