import axios from "axios";
import * as cheerio from "cheerio";

const url = "https://roningames.com.au";

function parseCleanJson(jsonString) {
  try {
    // Remove JavaScript variable assignments (like "collection = null," at the start)
    jsonString = jsonString.replace(/^[^{[]+/, ""); // Remove everything before the first `{` or `[`
    jsonString = jsonString.split("\n")[0];

    // Remove trailing commas before closing braces/brackets
    jsonString = jsonString.replace(/,(\s*[}\]])/g, "$1");

    // Decode Unicode escape sequences
    jsonString = jsonString
      .replace(/\\u003c/g, "<")
      .replace(/\\u003e/g, ">")
      .replace(/\\u0022/g, '"')
      .replace(/\\u0027/g, "'")
      .replace(/\\u0026/g, "&");
    jsonString = jsonString.replace(/(?<=\{.*\}),$/, "");
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Invalid JSON:", error);
    return null;
  }
}

function splitCardInfo(cardString) {
  const regex = /^([^\(]+)(?:\s*\(([^)]+)\))?\s*\[([^\]]+)\]$/;
  const match = cardString.match(regex);

  if (match) {
    const cardname = match[1].trim();
    const details = match[2] ? match[2].trim() : ""; // If details exist, use them; otherwise, set to an empty string
    const set = match[3].trim();
    return { cardname, details, set };
  }

  return null;
}

function parseConditionFinish(input) {
  const conditions = [
    "Damaged",
    "Near Mint",
    "Lightly Played",
    "Moderately Played",
    "Heavily Played",
  ];

  for (let condition of conditions) {
    if (input.startsWith(condition)) {
      let finish = input.substring(condition.length).trim();
      if (!finish) finish = "Nonfoil";
      return { condition, finish };
    }
  }

  return { condition: input, finish: "" };
}

export default async function scrapeRonin(cardURI) {
  const cardname = decodeURIComponent(cardURI);
  try {
    const { data } = await axios.get(
      `${url}/search?type=product&options%5Bprefix%5D=last&q=${cardURI}`,
    );
    const $ = cheerio.load(data);

    let allCards = [];
    const scripts = $("script:not([src])")
      .map((i, el) => $(el).html())
      .get();

    for (const script of scripts) {
      const match = script.match(/product\s*=\s*({[\s\S]*?});/);
      if (match) {
        const parsedData = parseCleanJson(match[1]);
        const title = splitCardInfo(parsedData.title);
        if (!title) {
          continue;
        }
        if (title.cardname.toLowerCase() !== cardname.toLowerCase()) {
          continue;
        }
        for (const variant of parsedData.variants) {
          if (!variant.available) {
            continue;
          }
          const variantTitle = parseConditionFinish(variant.title);
          const card = {
            cardname: title.cardname,
            condition: variantTitle.condition,
            details: title.details,
            finish: variantTitle.finish,
            price: variant.price / 100,
            set: title.set,
            stock: "Available",
            store: "Ronin Games",
            image: parsedData.featured_image,
            link: `${url}/products/${parsedData.handle}`,
          };
          allCards.push(card);
        }
      }
    }
    return allCards;
  } catch (error) {
    console.error("ronin" + error);
  }
}

// scrapeRonin("Faithless Looting")
