import axios from 'axios';
import * as cheerio from 'cheerio';
// URL to scrape
const urlmm = 'https://www.mtgmate.com.au/cards/search?q=Goblin';
// const urlgg = 'https://tcg.goodgames.com.au/search?q=sol+ring'

async function scrapeDatamm(url: string): Promise<void> {
    try {
        // Fetch the HTML content of the page
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        // console.log(data)
    
        const reactProps = $('div[data-react-class="FilterableTable"]').attr('data-react-props');
        if (!reactProps) {
            throw Error("No react props")
        }
        const parsedData = JSON.parse(reactProps).uuid;
        // console.log(parsedData)

        let cleanData = []
        for (const key in parsedData) {
            if (parsedData[key].quantity > 0) {
                const name = parsedData[key].name;
                const match = name.match(/^(.*?)\s*\((.*?)\)$/);

                let cardname = name
                console.log(name)
                let details = null
                if (match) {
                      cardname = match[1].trim()
                      details = match[2].trim()
                    }

                cleanData.push({
                    cardname,
                    details,
                    set: parsedData[key].set_name,
                    price: parsedData[key].price,
                    condition: parsedData[key].condition,
                    quantity: parsedData[key].quantity,
                    finish: parsedData[key].finish
                })
                // console.log(parsedData[key].name)
                // console.log(parsedData[key].set_name)
                // console.log(parsedData[key].price)
                // console.log(parsedData[key].condition)
                // console.log(parsedData[key].quantity)
            }
        }
        // console.log(cleanData)
    }
    catch (error) {
        console.error(error)
    }
    // const {data} = await axios2.get("https://api.scryfall.com/catalog/card-names")
    // const allCards = data.data.filter((s: string) => !s.startsWith('A-'));
    // // const allCards = ['"Ach! Hans, Run!"', '"Brims" Barone, Midway Mobster'];
    // const nonAlphanumericCards = allCards.filter((card: string) => /[^a-zA-Z0-9\-,(//)\s]/.test(card));

    // console.log(nonAlphanumericCards);
}

scrapeDatamm(urlmm)