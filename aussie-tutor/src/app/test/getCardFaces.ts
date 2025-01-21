const axioscf = require('axios');
const fuzzysortcf = require('fuzzysort');

interface MTGSet {
  name: string;
  code: string;
}

// Global cache variable
let nameToCodeCache: Record<string, string> | null = null;

// Fetch the mapping of set names to codes, with caching in a global variable
async function fetchSetNameToCodeMap(): Promise<Record<string, string>> {
  if (nameToCodeCache) {
    return nameToCodeCache; // Return cached data if available
  }

  // If not in cache, fetch data from Scryfall API
  const url = "https://api.scryfall.com/sets";
  try {
    const response = await axioscf.get(url);
    const setsData: MTGSet[] = response.data.data;

    // Build the map
    const nameToCodeMap: Record<string, string> = {};
    for (const set of setsData) {
      nameToCodeMap[set.name.toLowerCase()] = set.code;
    }

    // Cache the data in the global variable
    nameToCodeCache = nameToCodeMap;
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
  const fuzzyResults = fuzzysortcf.go(setName, setNames, {
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

async function getCardFace(set: string) {
  const { data } = await axioscf.get(`https://api.scryfall.com/cards/search?q=counterspell+set%3A${set}`);
  // just going to use the fiirst return for now -- sloppy
  const card = data.data[0]
  const face = card.image_uris.border_crop
  console.log(face);
}

// Example Usage
(async () => {
  const setNameInput = "Dominaria Remastered";
  const setCode = await getSetCode(setNameInput);
  getCardFace(setCode);
  // console.log(setCode); // Expected output: 'iko'
})();
