import * as cheerio from "cheerio";
import axios from "axios";
import { removeDuplicateCards } from "./helpers.js";

const MAGICHOTHUB_URL = "https://magiccards.com.au";

export default async function scrapeHotHub(card) {
  const baseUrl = `${MAGICHOTHUB_URL}/search/product?search_api_views_fulltext=${encodeURIComponent(card)}`;

  let targetUrl = null;
  let index = 0;
  let allCards = [];
  while (true) {
    if (index === 0) {
      targetUrl = baseUrl;
    } else {
      targetUrl = `${baseUrl}&page=${index.toString()}`;
    }

    try {
      const { data } = await axios.get(targetUrl);
      const $ = cheerio.load(data);
      const cards = [];

      $(".commerce-product-field-commerce-price").each((i, elem) => {
        const name = $(elem)
          .closest(".group-descript")
          .find("h2 a")
          .text()
          .trim();
        const link = $(elem)
          .closest(".group-descript")
          .find("h2 a")
          .attr("href");
        const stock = parseInt(
          $(elem)
            .closest(".group-descript")
            .find(".commerce-product-field-commerce-stock .field-item")
            .text()
            .trim(),
        );
        const match = name.match(/^\((.*?)\)\s*(.+)$/);
        let cardname = name;

        let details = null;
        if (match) {
          cardname = match[2].trim();
          details = match[1].trim();
        }

        const price = $(elem).find(".price-amount").text().trim().slice(1);
        let finish = $(elem)
          .closest(".group-descript")
          .find(".commerce-product-field-field-foil .field-item")
          .text()
          .trim();
        const set = $(elem)
          .closest(".group-descript")
          .find(".commerce-product-field-field-set li")
          .text()
          .trim();
        const condition = $(elem)
          .closest(".group-descript")
          .find(".commerce-product-field-field-condition li")
          .text()
          .trim();

        // if (stock === 0) {
        //   return;
        // }
        if (cardname.toLowerCase() !== card.toLowerCase()) {
          return;
        }
        if (finish === "Non Foil") {
          finish = "Nonfoil";
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

      if (cards.length === 0) {
        break;
      }
      allCards.push(...cards);
      index++;
    } catch (error) {
      console.error("hothub" + error);
      break;
    }
  }
  return removeDuplicateCards(allCards);
}
