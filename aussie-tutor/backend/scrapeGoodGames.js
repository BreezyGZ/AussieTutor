import axios from 'axios';
import * as cheerio from 'cheerio';

const URL = "https://tcg.goodgames.com.au";


function parseRawJsonString(rawString) {
    let formattedString = rawString.replace(/([{,]\s*)(\w+)(\s*:)/g, '$1"$2"$3');
    formattedString = formattedString.replace(/\[\s*"([^"]+)"\s*:\s*([^"\]]+)\]/g, '["$1: $2"]');
    formattedString = formattedString.replace(/;\s*$/, '');
    const parsedObj = JSON.parse(formattedString);
    return parsedObj;
}

function splitCardInfo(cardString) {
    const regex = /^([^\(]+)(?:\s*\(([^)]+)\))?\s*\[([^\]]+)\]$/;
    const match = cardString.match(regex);
    
    if (match) {
        const cardname = match[1].trim();
        const details = match[2] ? match[2].trim() : '';  // If details exist, use them; otherwise, set to an empty string
        const set = match[3].trim();
        return { cardname, details, set };
    }
    
    return null;
}

function parseConditionFinish(input) {
    const conditions = ["Damaged", "Near Mint", "Lightly Played", "Moderately Played", "Heavily Played"];
    
    for (let condition of conditions) {
        if (input.startsWith(condition)) {
            let finish = input.substring(condition.length).trim();
            if (!finish) finish = "Nonfoil"; 
            return { condition, finish };
        }
    }
    
    return { condition: input, finish: "" };
}

function formatGG2AT(obj, cardname) {
    const match = splitCardInfo(obj.title)
    if (match.cardname !== cardname) {
        return []
    }

    const allCards = []

    for (const variant of obj.variants) {
        // console.log(variant)
        if (variant.inventory_quantity === 0) {
            continue;
        }
        const variantDetails = parseConditionFinish(variant.title)
        const card = {
            cardname: match.cardname,
            condition: variantDetails.condition,
            details: match.details,
            finish: variantDetails.finish,
            price: variant.price / 100,
            set: match.set,
            stock: variant.inventory_quantity,
            store: "Good Games",
            image: null,
            link: `${URL}/products/${obj.handle}`,
        }
        allCards.push(card)
    }
    return allCards
}

export default async function scrapeGoodGames(cardURI) {
    const cardname = decodeURIComponent(cardURI);

    try {
        const { data } = await axios.get(`${URL}/search?q=${cardURI}&f_Availability=Exclude Out Of Stock`, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36"
            }
        });
        
        const $ = cheerio.load(data);
        const raw = $('script:contains("Spurit.Preorder2.snippet.products")').html();
        const regex = /Spurit\.Preorder2\.snippet\.products\['([^']+)'\]\s*=\s*(\{.*?\});/gs;
        const jsonDataStrings = raw.match(regex);


        let cards = []
        // console.log(cards)
        for (const match of jsonDataStrings) {
            const pairs = match.split(" = ")
            // console.log(toJsonString(pairs[1]))
            const cleanData = parseRawJsonString(pairs[1])
            // console.log(cleanData)
            const variants = formatGG2AT(cleanData, cardname)
            cards = [...cards, ...variants]

            
        }
        return(cards)


    } catch (error) {
        console.log(error)
    }
}

// scrapeGoodGames("faithless looting")