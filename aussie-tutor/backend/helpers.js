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
