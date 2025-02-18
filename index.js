import express from "express";
import { rankCache } from "./scripts/rankService.js";
import { historyCache } from "./scripts/historyService.js";
import { PORT } from "./config.js";
import { fetchPlayerData } from "./scripts/rankService.js";
import { processLastFiveGames } from "./scripts/historyService.js";
import { updateData } from './scripts/updateService.js';

const app = express();

app.get("/", async(req,res) => {
  res.status(200).send("ChickenNuggets ChickenNuggets");
});

app.get("/debug/cache", (req, res) => {
  const rankStats = rankCache.getStats();
  const historyStats = historyCache.getStats();
  
  res.json({
      rank: rankStats,
      history: historyStats
  });
});

app.get("/update/:uid", async (req, res) => {
  try {
    await updateData(req.params.uid);
  } catch (error) {
    res.status(500).send("500");
  }
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
