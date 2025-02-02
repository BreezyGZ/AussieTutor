import axios from 'axios';
import * as cheerio from 'cheerio';

const urlmc = 'https://magiccards.com.au/search/product?search_api_views_fulltext=giant growth&page=';

async function scrapeDataMC(url: string): Promise<any> {
    let index = 0;
    // let url = 
    const allCards: any[] = [];
    const sets: string[] = [];

    while (true) {
        // console.log(`Scraping page: ${index}`);
        try {
            // Fetch page data
            if (index === 0) {

            }
            const { data } = await axios.get(url + index.toString());
            const $ = cheerio.load(data);

            // Extract card data
            const cards: any[] = [];
            $('.commerce-product-field-commerce-price').each((i: number, elem: any) => {
                const name = $(elem).closest('.group-descript').find('h2 a').text().trim();
                const price = $(elem).find('.price-amount').text().trim();
                const foil = $(elem).closest('.group-descript').find('.commerce-product-field-field-foil .field-item').text().trim();
                const set = $(elem).closest('.group-descript').find('.commerce-product-field-field-set li').text().trim();
                const type = $(elem).closest('.group-descript').find('.commerce-product-field-field-type .field-item').text().trim();
                const condition = $(elem).closest('.group-descript').find('.commerce-product-field-field-condition li').text().trim();
                const stock = $(elem).closest('.group-descript').find('.commerce-product-field-commerce-stock .field-item').text().trim();

                const match = name.match(/^\((.*?)\)\s*(.+)$/);

                let cardname = name
                let details = null
                if (match) {
                      cardname = match[2].trim()
                      details = match[1].trim()
                    }
                sets.push(set)
                cards.push({
                    cardname,
                    details,
                    price,
                    foil,
                    set,
                    type,
                    condition,
                    stock,
                    index
                });
            });

            if (cards.length === 0) {
                console.log(`No more cards found. Terminating at page: ${index}`);
                break;
            }

            allCards.push(...cards);
            index++;
        } catch (error) {
            console.error(error);
            break;
        }
    }

    // Output all extracted data
    // console.log(`Total cards scraped: ${allCards.length}`);
    console.log(allCards); // Pretty print
    console.log(sets)
    return allCards;
}

scrapeDataMC(urlmc);
