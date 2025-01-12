
const axios2 = require('axios');
const cheerio2 = require('cheerio');

// URL to scrape
const urlmm = 'https://www.mtgmate.com.au/cards/search?q=Goblin';
const urlgg = 'https://tcg.goodgames.com.au/search?q=sol+ring'

async function scrapeDatamm(url: string): Promise<void> {
    try {
        // Fetch the HTML content of the page
        const { data } = await axios2.get(url);
        const $ = cheerio2.load(data);
        // console.log(data)
    
        const reactProps = $('div[data-react-class="FilterableTable"]').attr('data-react-props');
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

async function scrapegg(url: string) {
    try {
        // Fetch the HTML content of the page
        const { data } = await axios2.get(url);
        const $ = cheerio2.load(data);
        console.log(data)
        
        const scriptContent = $('script')
        .toArray()
        .map((script: any) => $(script).html())
        .find((content: any) => content.includes('search_submitted'));

        if (!scriptContent) {
            console.log('Data not found');
            return;
        }
        // console.log(scriptContent)

        const regex = /search_submitted\s*\(\s*({[\s\S]*?})\s*\)/;
        const match = scriptContent.match(regex);
        // console.log(match)

        // Use regex to extract the JavaScript variable
        // const regex = /var gsf_conversion_data\s*=\s*(\{[\s\S]*?\});/;
        // const match = scriptContent.match(regex);
        // // console.log(match[1])
        // let jsonData = match[1]
        // .replace(/'/g, '"') // Replace single quotes with double quotes
        // .replace(/(\w+)\s*:/g, '"$1":') // Add quotes around keys
        // .replace(/(\d+(\.\d+)?)/g, '$1') // Ensure numbers remain as they are
        // .trim();
        // jsonData = jsonData.replace(/""Magic": The Gathering"/g, '"Magic: The Gathering"')
        // console.log(jsonData)

        // const parsedData = JSON.parse(jsonData);
        // console.log(parsedData.data)
    }
    catch (error){
        console.error(error)
    }
}

scrapeDatamm(urlmm)