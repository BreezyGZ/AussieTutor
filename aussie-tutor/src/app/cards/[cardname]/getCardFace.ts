import { CardDetails } from "@/app/interfaces";
import axios from 'axios';
import fuzzysort from 'fuzzysort';

interface MTGSet {
  name: string;
  code: string;
}

// Fetch the mapping of set names to codes, with caching in localStorage
async function fetchSetNameToCodeMap(): Promise<Record<string, string>> {
  const cacheKey = "mtgSetNameToCodeMap";

  const cachedData = localStorage.getItem(cacheKey);
  if (cachedData) {
    return JSON.parse(cachedData); // Return cached data if available
  }

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
async function getSetCode(setName: string, threshold: number = 80): Promise<string | null> {
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

  return null;
}

export default async function getCardFace(card: CardDetails) {
  const setCode = await getSetCode(card.set)
  if (!setCode) {
    return ""
  }
  let extraSearchParams = ""
  if (card.details) {
    if (card.details.includes("Retro") || card.details.includes("retro")) {
      extraSearchParams += "+is%3Aold"
    }
    if (card.details.includes("Borderless") || card.details.includes("borderless")) {
      extraSearchParams += "+is%3Aborderless"
    }
  }
  const { data } = await axios.get(`https://api.scryfall.com/cards/search?q=${card.cardname}+set%3A${setCode}${extraSearchParams}`);
  const face = data.data[0].image_uris.border_crop;
  return face
}

// // Example Usage
// (async () => {
//   const setNameInput = "Dominaria Remastered";
//   const setCode = await getSetCode(setNameInput);
//   getCardFace(setCode);
// })();
