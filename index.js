// server.js
import express from "express";
import { PORT } from "./config.js";
import { fetchPlayerData } from "./scripts/rankService.js";
import { processLastFiveGames } from "./scripts/historyService.js";

const app = express();

app.get("/", async(req,res) => {
  res.status(200).send("Running just fine")
});

app.get("/rank/:uid", async (req, res) => {
  try {
    const playerData = await fetchPlayerData(req.params.uid);
    res.send(playerData);
  } catch (error) {
    res.status(500).send("Code 500");
  }
});

app.get("/history/:uid", async (req, res) => {
  try {
    const games = await processLastFiveGames(req.params.uid);
    res.send(`LAST 5 GAMES: ${games}`);
  } catch (error) {
    res.status(500).send("Code 500");
  }
});

app.listen(PORT, () => {
  console.log(`Logged In.`);
});
