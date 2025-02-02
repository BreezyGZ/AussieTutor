export function removeDuplicateCards(cards) {
  const seen = new Set();
  return cards.filter(card => {
    // Skip cards with 0 stock
    if (card.stock === 0) {
      return false;
    }

    const identifier = `
      ${card.cardname.toLowerCase()}|
      ${(card.details?.toLowerCase() || '')}|
      ${(card.set?.toLowerCase() || '')}|
      ${(card.price)}|
      ${(card.condition?.toLowerCase() || '')}
      ${(card.stock)}
      ${(card.finish?.toLowerCase() || '')}|
    `;

    if (seen.has(identifier)) {
      return false;
    }
    seen.add(identifier);
    return true;
  });
}

export function parseCardString(cardString) {
  const pattern = /^(.*?)\s*(?:\((.*?)\))?\s*\[(.*?)\]\s*-\s*(.+)$/;
  const match = cardString.match(pattern);
  const conditions = ["Damaged", "Near Mint", "Lightly Played", "Moderately Played", "Heavily Played"];

  if (!match) {
    console.log(cardString)
    throw new Error("Invalid string format");
  }

  // Extract the components with defaults
  const [_, cardName, details = "", setName, conditionRaw] = match;
  let condition = "";
  for (let i = 0; i < conditions.length; i++) {
    if (conditionRaw.trim().includes(conditions[i])) {
      condition = conditions[i];
      break;
    }
  }
  
  const finish = conditionRaw.trim().replace(condition, "").trim();
  return [cardName.trim(), details.trim().replace(/[^a-zA-Z0-9 ]/g, ''), setName.trim(), condition, finish ? finish : "Nonfoil"];
}