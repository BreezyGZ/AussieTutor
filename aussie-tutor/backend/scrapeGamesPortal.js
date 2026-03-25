import axios from "axios";
import * as cheerio from "cheerio";
import { parseCardString } from "./helpers.js";

const GAMESPORTAL_URL = "https://gamesportal.com.au";

export default async function scrapeGamesPortal(card) {
  try {
    let links = new Map();
    const { data } = await axios.get(
      `${GAMESPORTAL_URL}/search?type=product&options%5Bprefix%5D=last&q=${card}`,
    );
    const $ = cheerio.load(data);

    $(".grid-view-item:not(.product-price--sold-out)").each(
      (index, element) => {
        const title = $(element)
          .find(".grid-view-item__title")
          .text()
          .trim()
          .split(" - ")[0];
        const match = title.match(/^([^\[\(\]]+)/);
        const cardname = match[1];

        if (cardname.trim().toLowerCase() !== decodeURI(card).toLowerCase()) {
          return;
        }
        const info = {
          image: $(element).find(".grid-view-item__image").attr("src"),
          link: $(element).find("a").attr("href"),
        };
        links.set(title, info);
      },
    );
    let allCards = [];
    const matchedDivs = $('div[id^="productCardList2-js-"]');
    matchedDivs.each((i, element) => {
      let json = JSON.parse(
        $(element)
          .attr("data-product-variants")
          .replace(/&quot;/g, '"'),
      );
      json.forEach((rawCard, index) => {
        const match = rawCard.name.match(/^([^\[\(\]]+)/);
        const cardname = match[1];

        if (cardname.trim().toLowerCase() !== decodeURI(card).toLowerCase()) {
          return;
        }
        if (!rawCard.available) {
          return;
        }
        const title = parseCardString(rawCard.name);
        const raw = rawCard.name.split(" - ")[0];
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
        };
        allCards.push(clean);
      });
    });
    return allCards;
  } catch (error) {
    console.error("gamesportal" + error);
  }
}
