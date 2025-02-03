import axios from 'axios';
import * as cheerio from 'cheerio';

const url = "https://tcg.goodgames.com.au";

async function scrapeGoodGames(cardURI) {
    const card = decodeURIComponent(cardURI);

    try {
        const { data } = await axios.get(`${url}/search?q="${cardURI}"&f_Availability=Exclude Out Of Stock`) 
        console.log(data)

        const $ = cheerio.load(data)

        $("div.product-inner").each((index, element) => {
            const classname = $(element).attr("class")
            console.log(classname)
        })
    } catch (error) {
        console.log(error)
    }
}

scrapeGoodGames("counterspell")