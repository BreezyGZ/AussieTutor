import axios from 'axios';
import * as cheerio from 'cheerio';

const url = "https://gamesportal.com.au";

function parseCardString(cardString) {
  const pattern = /^(.*?)\s*(?:\((.*?)\))?\s*\[(.*?)\]\s*-\s*(.+)$/;
  const match = cardString.match(pattern);
  const conditions = ["Damaged", "Near Mint", "Lightly Played", "Moderately Played", "Heavily Played"];

  if (!match) {
    console.log(cardString)
    throw new Error("Invalid string format");
  }

  // Extract the components with defaults
  const [_, cardName, details = "", setName, conditionRaw] = match;
  let condition = "";
  for (let i = 0; i < conditions.length; i++) {
    if (conditionRaw.trim().includes(conditions[i])) {
      condition = conditions[i];
      break;
    }
  }
  
  const finish = conditionRaw.trim().replace(condition, "").trim();
  return [cardName.trim(), details.trim().replace(/[^a-zA-Z0-9 ]/g, ''), setName.trim(), condition, finish];
}

async function scrapeGamesPortal(cardURI) {
  const card = decodeURIComponent(cardURI);
  const regex = /^(.+?)\s*(?:\((.*?)\))?\s*\[(.+?)\]$/;

  try {
    let links = new Map();
    const { data } = await axios.get(`${url}/search?type=product&options%5Bprefix%5D=last&q=${cardURI}`);
    // const { data } = await axios.get("https://gamesportal.com.au/search?options%5Bprefix%5D=last&page=2&q=faithless+looting&type=product");
    const $ = cheerio.load(data);

    $(".grid-view-item:not(.product-price--sold-out)").each((index, element) => {
      const title = $(element).find(".grid-view-item__title").text().trim()
      const match = title.match(/^([^\[\(\]]+)/);
      const cardname = match[1]

      if (cardname.trim() !== card.trim()) {
        console.log(`Not a match ${title}`)
        return;
      }
      const info = {
        image: $(element).find(".grid-view-item__image").attr("src"),
        link: $(element).find('a').attr('href')
      }
          
      links.set(title, info)
      // console.log(title)
    })

    let allCards = []
    const matchedDivs = $('div[id^="productCardList2-js-"]');
    matchedDivs.each((i, element) => {
      let json = JSON.parse($(element).attr('data-product-variants').replace(/&quot;/g, '"'));
      

      json.forEach((rawCard, index) => {
        // console.log(rawCard.name)
        const match = rawCard.name.match(/^([^\[\(\]]+)/);
        const cardname = match[1]

        if (cardname.trim() !== card.trim()) {
          console.log(`Not a match ${rawCard.name}`)
          return;
        }
        if (!rawCard.available) {
          return;
        }
        const title = parseCardString(rawCard.name)
        const raw = rawCard.name.split(" - ")[0]
        console.log(raw)
        console.log(links.get(raw))
        const clean = {
          cardname: title[0],
          condition: title[3],
          details: title[1],
          finish: title[4],
          price: rawCard.price,
          set: title[2],
          stock: "Available",
          store: "Games Portal",
          image: links.get(raw).image,
          link: links.get(raw).link,
        }
        allCards.push(clean)

        
      });
      // console.log(json);
    });
    // console.log(data)
    console.log(allCards)
    // console.log(links)
  }
  catch (error) {
    console.error(error)
  }
}

scrapeGamesPortal("Faithless Looting")