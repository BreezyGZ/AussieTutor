// import axios from "axios";
// import fuzzysort from "fuzzysort";

const axios = require('axios');
const fuzzysort = require('fuzzysort');

interface MTGSet {
  name: string;
  code: string;
}

// Cache for set name-to-code map
let nameToCodeCache: Record<string, string> | null = null;

// Fetch the mapping of set names to codes, with caching
async function fetchSetNameToCodeMap(): Promise<Record<string, string>> {
  if (nameToCodeCache) {
    return nameToCodeCache; // Return cached data if available
  }

  const url = "https://api.scryfall.com/sets";
  try {
    console.log("fetching")
    const response = await axios.get(url);
    const setsData: MTGSet[] = response.data.data;

    // Build and cache the map
    nameToCodeCache = {};
    for (const set of setsData) {
      nameToCodeCache[set.name.toLowerCase()] = set.code;
    }
    return nameToCodeCache;
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
    // allowTypo: true, // Allow slight typos
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

// Example Usage
(async () => {
  const setNameInput = "Duel Decks Anthology Jace vs. Chandra";
  const setCode = await getSetCode(setNameInput);
  console.log(setCode); // Expected output: 'iko'

  const anotherSetNameInput = "Theros Beyon";
  const anotherSetCode = await getSetCode(anotherSetNameInput);
  console.log(anotherSetCode); // Expected output: 'thb'
})();

(async () => {
  const setNameInput = "Starter Commander Decks";
  const setCode = await getSetCode(setNameInput);
  console.log(setCode); // Expected output: 'iko'

  const anotherSetNameInput = "The List";
  const anotherSetCode = await getSetCode(anotherSetNameInput);
  console.log(anotherSetCode); // Expected output: 'thb'
})();
