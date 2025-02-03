"use client";
// import axios from 'axios';
// import fs from "fs/promises"
import { useEffect, useRef, useState } from "react";
import { useRouter } from 'next/navigation';

async function getPartialMatches(partial: string) {
  // const { data } = await axios.get("https://api.scryfall.com/catalog/card-names");
  // const allCards = data.data.filter((s: string) => !s.startsWith('A-'));
  const response = await fetch('http://localhost:5000/api/allCards');
  // console.log(response)
  const allCards = await response.json()
  // console.log(allCards)

  const filteredCards = allCards.filter((card: string) =>
    card.toLowerCase().includes(partial.toLowerCase())
  );

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

export default function SearchBar() {
  const [search, setSearch] = useState<string>("");
  const [matches, setMatches] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const newMatches = await getPartialMatches(search);
        setMatches(newMatches);
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={searchRef} className="w-1/6 flex flex-col gap-0 shadow-xl border">
      <input
        className="px-2 py-1 border rounded"
        type="text"
        placeholder="Find"
        onChange={
          (e) => {
            setSearch(e.target.value)
            setIsDropdownOpen(true)
          }
        }
        value={search}
      />
      {isDropdownOpen && matches.length > 0 && (
      <div className="absolute top-7 w-1/6 bg-white border shadow-xl">
        {matches.slice(0, 10).map((item, index) => (
          <div
            key={index}
            className="pl-2 hover:bg-gray-200 cursor-pointer"
            onClick={() => {
              router.push(`/cards/${encodeURIComponent(item)}`);
              // console.log(encodeURIComponent(item))
            }}
          >
            {item.length > 31 ? item.slice(0, 28) + '...' : item}
          </div>
        ))}
      </div> 
    )}
    </div>
  );
}
