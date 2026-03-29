import express from "express";
import cors from "cors";
import scrapeRonin from "./scrapeRonin.js";
import scrapeGoodGames from "./scrapeGoodGames.js";
import scrapeGamesPortal from "./scrapeGamesPortal.js";
import scrapeHotHub from "./scrapeHotHub.js";
import { getAllCards, updateCardNames  } from "./getAllCards.js";

const app = express();
const PORT = 5000;

app.use(cors());

app.get("/api/allcards", async (req, res) => {
  try {
    const cardNames = await getAllCards();
    // console.log(cardNames)
    res.status(200).json(cardNames);
  } catch (error) {
    console.error("Error reading file:", error);
    res.status(500).json({ message: "Error reading the file" });
  }
});
// Magic Hothub
app.get("/api/magiccards", async (req, res) => {
  const card = req.query.card;
  if (!card) {
    res.status(400).json({ error: 'Missing "card" query parameter' });
    return;
  }
  const data = await scrapeHotHub(card);
  res.json(data);
});

app.get("/api/ronin", async (req, res) => {
  const card = req.query.card;
  if (!card) {
    res.status(400).json({ error: 'Missing "card" query parameter' });
    return;
  }
  const data = await scrapeRonin(card);
  res.json(data);
});

app.get("/api/goodgames", async (req, res) => {
  const card = req.query.card;
  if (!card) {
    res.status(400).json({ error: 'Missing "card" query parameter' });
    return;
  }
  const data = await scrapeGoodGames(card);
  res.json(data);
});

app.get("/api/gamesportal", async (req, res) => {
  const card = req.query.card;
  if (!card) {
    res.status(400).json({ error: 'Missing "card" query parameter' });
    return;
  }
  const data = await scrapeGamesPortal(card);
  res.json(data);
});

app.use((err, req, res) => {
  res.status(500).json({ error: "Internal Server Error" });
});

updateCardNames();
setInterval(updateCardNames, 24 * 60 * 60 * 1000);

// Start the server
app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
