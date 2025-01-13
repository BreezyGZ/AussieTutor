const axios = require('axios');
const cheerio = require('cheerio');

// export {}

// URL to scrape
const MTGMATE_URL = 'https://www.mtgmate.com.au/cards/search?q=';
const MAGICCARDS_URL = 'https://magiccards.com.au/search/product?search_api_views_fulltext='

async function scrapeMtgMate(card: string): Promise<any[]> {
  try {
    const { data } = await axios.get(MTGMATE_URL + card);
    const $ = cheerio.load(data);
    const reactProps = $('div[data-react-class="FilterableTable"]').attr('data-react-props');
    const parsedData = JSON.parse(reactProps).uuid;
    console.log(parsedData)
    let cleanData = [];

    for (const key in parsedData) {
      // console.log(parsedData[key])
      
      const name = parsedData[key].name;
      const stock = parsedData[key].quantity;
      const price = parsedData[key].price / 100;
      const match = name.match(/^(.*?)\s*\((.*?)\)$/);
      let cardname = name;
      let details = null;
      // console.log(name)
      if (match) {
          cardname = match[1].trim();
          details = match[2].trim();
      }

      if (stock === 0) {
        continue;
      }
      else if (cardname.toLowerCase() !== card.toLowerCase()) {
        continue;
      }
      cleanData.push({
        store: "MTGMate",
        cardname,
        details,
        set: parsedData[key].set_name,
        price,
        condition: parsedData[key].condition,
        stock,
        finish: parsedData[key].finish
      });
    }
    // console.log(cleanData)
    return cleanData;
  } 
  catch (error) {
    console.error(error);
    return [];
  }
}

function removeDuplicateCards(cards: any[]): any[] {
  const seen = new Set<string>();
  return cards.filter(card => {
    const identifier = `
      ${card.cardname.toLowerCase()}|
      ${(card.details?.toLowerCase() || '')}|
      ${(card.set?.toLowerCase() || '')}|
      ${(card.price)}|
      ${(card.condition?.toLowerCase() || '')}
      ${(card.stock)}
      ${(card.finish?.toLowerCase() || '')}|
    `;

      if (seen.has(identifier)) {
          return false;
      }
      seen.add(identifier);
      return true;
  });
}

async function scrapeMagicHothub(card: string): Promise<any> {
  let baseUrl = MAGICCARDS_URL + card;
  let url = null;
  let index = 0;
  let allCards: any[] = [];

  while (true) {
    try {
      if (index === 0) {
        url = baseUrl
      } else {
        url = baseUrl + `&page=${index.toString()}`
      }
      try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const cards: any[] = [];
        $('.commerce-product-field-commerce-price').each((i: number, elem: any) => {
          const name = $(elem).closest('.group-descript').find('h2 a').text().trim();
          const stock = parseInt($(elem).closest('.group-descript').find('.commerce-product-field-commerce-stock .field-item').text().trim());
          const match = name.match(/^\((.*?)\)\s*(.+)$/);
          let cardname = name
          let details = null
          if (match) {
            cardname = match[2].trim()
            details = match[1].trim()
          }

          const price = $(elem).find('.price-amount').text().trim().slice(1);
          const finish = $(elem).closest('.group-descript').find('.commerce-product-field-field-foil .field-item').text().trim();
          const set = $(elem).closest('.group-descript').find('.commerce-product-field-field-set li').text().trim();
          const condition = $(elem).closest('.group-descript').find('.commerce-product-field-field-condition li').text().trim();
          
          if (stock === 0) {
            return;
          } else if (cardname.toLowerCase() !== card.toLowerCase()) {
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
          });
        });
        if (cards.length === 0) {
          break;
        }

        allCards.push(...cards);
        index++;
        // console.log(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      
    } catch (error) {
      console.error(error);
      break;
    }
  }
  allCards = removeDuplicateCards(allCards)
  // console.log(allCards); 
  return allCards;
}

// async function scrapeData(): Promise<void> {
//   try {
//     // Fetch the HTML content of the page
//     const { data } = await axios.get(url);

//     // Load the HTML into cheerio
//     const $ = cheerio.load(data);
//     // console.log(data)
//     const reactProps = $('div[data-react-class="FilterableTable"]').attr('data-react-props');
//     const prices: any = []

//     $('.jss67').each((index:any, element:any) => {
//       console.log($(element).text())
//       // console.log($(element))
      
//       const price = $(element).text();
//       if (price) {
//           prices.push(price);
//       }
//   });

//     console.log(prices)
//     if (reactProps) {
//         // The 'data-react-props' is a stringified JSON, so we need to parse it
//         const parsedData = JSON.parse(reactProps);
  
//         // Access the cards data
//         const cards = parsedData.cards;

//         console.log(cards)
  
//         // // Extract and log card names and prices
//         // cards.forEach((card: { name: string; price: string }) => {
//         //   console.log(`Card Name: ${card.name}, Price: ${card.price}`);
//         // });
//       } else {
//         console.error('No "data-react-props" attribute found.');
//       }
//   } catch (error) {
//     if (error instanceof Error) {
//         console.error('Error scraping data:', error.message);
//       }
//   }
// }

// // Run the scraper
// scrapeData();

// scrapeMtgMate("Firebolt")
// scrapeMagicHothub("Firebolt")

export default async function scrape(card:string) {
  // const hothub = await scrapeMagicHothub(card);
  const mate = await scrapeMtgMate(card);

  // let allCards = [...hothub, ...mate]
  let allCards = [...mate]
  const sortedCards = allCards.sort((a, b) => a.price - b.price)

  console.log(sortedCards)
  return sortedCards
}

// scrape("Exhume")