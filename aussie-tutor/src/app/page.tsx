"use client";
const axios = require('axios');

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';

async function getPartialMatches(partial: string) {
  const {data} = await axios.get("https://api.scryfall.com/catalog/card-names")
  const allCards = data.data.filter((s: string) => !s.startsWith('A-'));
  const filteredCards = allCards.filter((card: string) =>
    card.toLowerCase().includes(partial.toLowerCase())
  );

  // Sort the matches to prioritize exact matches or closer matches
  const sortedCards = filteredCards.sort((a: string, b: string) => {
    const aIndex = a.toLowerCase().indexOf(partial.toLowerCase());
    const bIndex = b.toLowerCase().indexOf(partial.toLowerCase());

    if (a.toLowerCase() === partial.toLowerCase()) return -1;
    if (b.toLowerCase() === partial.toLowerCase()) return 1;

    if (aIndex !== bIndex) return aIndex - bIndex;

    return a.localeCompare(b);
  });
  return sortedCards;
}

export default function Home() {
  const [search, setSearch] = useState("")
  const [matches, setMatches] = useState([])
  const router = useRouter();

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const newMatches = await getPartialMatches(search); // Call your async function
        setMatches(newMatches); // Update state with results
      } catch (error) {
        console.error("Error fetching matches:", error);
      }
    };
  
    if (search === "") {
      setMatches([]);
    } else {
      fetchMatches();
    }
  }, [search]);

  return (
    <div>
      <div>
        <label>
          Card
        </label>
        <input
          type="text"
          placeholder="Search for a card"
          onChange={(e)=>setSearch(e.target.value)}
        >
        </input>
          
      </div>
      <div className="matchlist">
        {matches.slice(0, 10).map((item, index) => (
          <div key={index} className="match" onClick={() => {router.push(`/cards/${item}`)}}>
            {item}
          </div>
        ))}

      </div>
    </div>
  )
}
