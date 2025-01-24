import express from 'express';
import * as cheerio from 'cheerio';
import axios from 'axios';
import cors from 'cors';
import { removeDuplicateCards } from './helpers.js';
import fs from "fs"
const app = express();
const PORT = 5000;
const MAGICHOTHUB_URL = "https://magiccards.com.au"
// Enable CORS for local development
app.use(cors());

app.get('/api/allcards', async (req, res, next) => {
  try {
    const fileContent = await fs.promises.readFile('../public/allCards.txt', 'utf8');
    const cardNames = JSON.parse(fileContent);
    res.status(200).json(cardNames); // Respond with card names
  } catch (error) {
    console.error('Error reading file:', error);
    res.status(500).json({ message: 'Error reading the file' });
  }
})
// Magic Hothub
app.get('/api/magiccards', async (req, res, next) => { 
    const card = req.query.card;
    if (!card) {
      res.status(400).json({ error: 'Missing "card" query parameter' });
      return;
    }
    const baseUrl = `${MAGICHOTHUB_URL}/search/product?search_api_views_fulltext=${encodeURIComponent(card)}`;
    console.log(`Received request for card: ${req.query.card}`);
    // console.log(`Fetching URL: ${targetUrl}`);

    let targetUrl = null
    let index = 0
    let allCards = []
    while (true) {
      if (index === 0) {
        targetUrl = baseUrl;
      } else {
        targetUrl = `${baseUrl}&page=${index.toString()}`;
      }
      // console.log("loop")
      try {
        // console.log(`Fetching URL: ${targetUrl}`);

        const { data } = await axios.get(targetUrl);
        // console.log(data)
        const $ = cheerio.load(data);
        const cards = [];

        $('.commerce-product-field-commerce-price').each((i, elem) => {
          const name = $(elem).closest('.group-descript').find('h2 a').text().trim();
          const link = $(elem).closest('.group-descript').find('h2 a').attr('href');
          // console.log(link)
          const stock = parseInt($(elem).closest('.group-descript').find('.commerce-product-field-commerce-stock .field-item').text().trim());
          const match = name.match(/^\((.*?)\)\s*(.+)$/);
          let cardname = name;
          let details = null;
          if (match) {
            cardname = match[2].trim();
            details = match[1].trim();
          }

          const price = $(elem).find('.price-amount').text().trim().slice(1);
          const finish = $(elem).closest('.group-descript').find('.commerce-product-field-field-foil .field-item').text().trim();
          const set = $(elem).closest('.group-descript').find('.commerce-product-field-field-set li').text().trim();
          const condition = $(elem).closest('.group-descript').find('.commerce-product-field-field-condition li').text().trim();

          // if (stock === 0) {
          //   return;
          // }
          if (cardname.toLowerCase() !== card.toLowerCase()) {
            return;
          }
          cards.push({
            store: "Magic Hothub",
            cardname,
            details,
            set,
            price: parseFloat(price),
            condition,
            stock,
            finish,
            image: null,
            link: `${MAGICHOTHUB_URL}${link}`,
          });
        });
        // console.log(cards)

        if (cards.length === 0) {
          break;
        }

        allCards.push(...cards);
        index++;
      
    } catch (error) {
      console.error(error);
      break;
    }
  }
  allCards = removeDuplicateCards(allCards);
  console.log("allCards")
  console.log(allCards)
  res.json(allCards);
});



app.use((err, req, res, next) => {
  res.status(500).json({ error: 'Internal Server Error' });
});
// Start the server
app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});