import { CardDetails } from "@/interfaces";

const axios = require('axios');
const fuzzysort = require('fuzzysort');

interface MTGSet {
  name: string;
  code: string;
}

// Fetch the mapping of set names to codes, with caching in localStorage
async function fetchSetNameToCodeMap(): Promise<Record<string, string>> {
  const cacheKey = "mtgSetNameToCodeMap";

  // Check if cache exists in localStorage
  const cachedData = localStorage.getItem(cacheKey);
  if (cachedData) {
    return JSON.parse(cachedData); // Return cached data if available
  }

  // If not in cache, fetch data from Scryfall API
  const url = "https://api.scryfall.com/sets";
  try {
    console.log("Fetching from API...");
    const response = await axios.get(url);
    const setsData: MTGSet[] = response.data.data;

    // Build the map
    const nameToCodeMap: Record<string, string> = {};
    for (const set of setsData) {
      nameToCodeMap[set.name.toLowerCase()] = set.code;
    }

    // Cache the data in localStorage
    localStorage.setItem(cacheKey, JSON.stringify(nameToCodeMap));
    return nameToCodeMap;
  } catch (error) {
    throw new Error(`Failed to fetch sets: ${error}`);
  }
}

// Get set code with fuzzy matching, using cached data
async function getSetCode(setName: string, threshold: number = 80): Promise<string> {
  const nameToCode = await fetchSetNameToCodeMap();
  const setNames = Object.keys(nameToCode);

  // Exact match
  const exactMatch = nameToCode[setName.toLowerCase()];
  if (exactMatch) {
    return exactMatch;
  }

  // Fuzzy matching
  const fuzzyResults = fuzzysort.go(setName, setNames, {
    threshold: -Infinity, // Accept all matches initially
  });

  if (fuzzyResults.length > 0) {
    const bestMatch = fuzzyResults[0];
    const matchScore = bestMatch.score;
    if (matchScore >= -threshold) {
      const matchedSetName = bestMatch.target!;
      return nameToCode[matchedSetName.toLowerCase()];
    }
  }

  return `Set name '${setName}' not found in Scryfall database.`;
}

export default async function getCardFace(card: CardDetails) {
  const setCode = await getSetCode(card.set)
  const { data } = await axios.get(`https://api.scryfall.com/cards/search?q=${card.cardname}+set%3A${setCode}`);
  // Just going to use the first return for now (sloppy)
  // needs to check for card variants in card.details
  const face = data.data[0].image_uris.border_crop;
  return face
}

// // Example Usage
// (async () => {
//   const setNameInput = "Dominaria Remastered";
//   const setCode = await getSetCode(setNameInput);
//   getCardFace(setCode);
// })();
