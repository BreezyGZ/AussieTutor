import axios from "axios";
import fs from "fs";

(async () => {
  try {
    const { data } = await axios.get("https://api.scryfall.com/catalog/card-names");
    const allCards = data.data.filter((name) => !name.startsWith('A-'));
    fs.writeFileSync("allCards.txt", JSON.stringify(allCards, null, 2));
    console.log(`Successfully saved ${allCards.length} card names to allCards.txt.`);
  } catch (error) {
    console.error("Error fetching card names:", error);
  }
})();