import express from 'express';
import * as cheerio from 'cheerio';
import axios from 'axios';
import cors from 'cors';
import { removeDuplicateCards, parseCardString } from './helpers.js';
import fs from "fs"

const app = express();
const PORT = 5000;
const MAGICHOTHUB_URL = "https://magiccards.com.au"
const GAMESPORTAL_URL = "https://gamesportal.com.au";
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
    // console.log(`Received request for card: ${req.query.card}`);
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
  // console.log("allCards")
  // console.log(allCards)
  res.json(allCards);
});

app.get('/api/gamesportal', async (req, res, next) => {
  const card = req.query.card;
    if (!card) {
      res.status(400).json({ error: 'Missing "card" query parameter' });
      return;
    }
  
    // const regex = /^(.+?)\s*(?:\((.*?)\))?\s*\[(.+?)\]$/;

    try {
      let links = new Map();
      const { data } = await axios.get(`${GAMESPORTAL_URL}/search?type=product&options%5Bprefix%5D=last&q=${card}`);
      // const { data } = await axios.get("https://gamesportal.com.au/search?options%5Bprefix%5D=last&page=2&q=faithless+looting&type=product");
      const $ = cheerio.load(data);
  
      $(".grid-view-item:not(.product-price--sold-out)").each((index, element) => {
        const title = $(element).find(".grid-view-item__title").text().trim().split(" - ")[0]
        const match = title.match(/^([^\[\(\]]+)/);
        const cardname = match[1]
  
        if (cardname.trim() !== decodeURI(card)) {
          // console.log(`Not a match ${title}`)
          return;
        }
        const info = {
          image: $(element).find(".grid-view-item__image").attr("src"),
          link: $(element).find('a').attr('href')
        }
            
        links.set(title, info)
        // console.log(title)
      })
      // console.log(links)
  
      let allCards = []
      const matchedDivs = $('div[id^="productCardList2-js-"]');
      matchedDivs.each((i, element) => {
        let json = JSON.parse($(element).attr('data-product-variants').replace(/&quot;/g, '"'));
        json.forEach((rawCard, index) => {
          // console.log(rawCard.name)
          const match = rawCard.name.match(/^([^\[\(\]]+)/);
          const cardname = match[1]
  
          if (cardname.trim() !== decodeURI(card)) {
            // console.log(`Not a match ${rawCard.name}`)
            // console.log(cardname.trim())
            // console.log(card.trim())
            return;
          }
          if (!rawCard.available) {
            return;
          }
          const title = parseCardString(rawCard.name)
          const raw = rawCard.name.split(" - ")[0]
          // console.log(raw)
          // console.log(links.get(raw))
          const clean = {
            cardname: title[0],
            condition: title[3],
            details: title[1],
            finish: title[4],
            price: rawCard.price / 100,
            set: title[2],
            stock: "Available",
            store: "Games Portal",
            image: links.get(raw).image,
            link: GAMESPORTAL_URL + links.get(raw).link,
          }
          allCards.push(clean)
  
          
        });
        // console.log(json);
      });
      // console.log(data)
      res.json(allCards);
      
    }
    catch (error) {
      console.error(error)
    }
  
})

app.use((err, req, res, next) => {
  res.status(500).json({ error: 'Internal Server Error' });
});
// Start the server
app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});