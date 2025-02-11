// server.js
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { rankCache } from "./scripts/rankService.js";
import { historyCache } from "./scripts/historyService.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({ path: '.env' });

import express from "express";
import { PORT } from "./config.js";
import { fetchPlayerData } from "./scripts/rankService.js";
import { processLastFiveGames } from "./scripts/historyService.js";

const app = express();

const CACHE_TTL = 35 * 60 * 1000; // 35 minutes in milliseconds



app.get("/", async(req,res) => {
  res.status(200).send("ChickenNuggets ChickenNuggets");
});

// Add this to index.js
app.get("/debug/cache", (req, res) => {
  const rankStats = rankCache.getStats();
  const historyStats = historyCache.getStats();
  
  res.json({
      rank: rankStats,
      history: historyStats
  });
});

app.get("/rank/:uid", async (req, res) => {
  try {
    const playerData = await fetchPlayerData(req.params.uid);
    res.send(playerData);
  } catch (error) {
    res.status(500).send("500");
  }
});

app.get("/history/:uid", async (req, res) => {
  try {
    const games = await processLastFiveGames(req.params.uid);
    res.send(`LAST 5 GAMES: ${games}`);
  } catch (error) {
    res.status(500).send("500");
  }
});

app.listen(PORT, () => {
  console.log(`Logged In.`);
});
