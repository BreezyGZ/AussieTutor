"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from 'next/navigation';
import { BACKEND_URL } from '@/app/backendConfig'

async function getPartialMatches(partial: string) {
  const response = await fetch(`${BACKEND_URL}/api/allCards`);
  const allCards = await response.json()
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

interface SearchBarProps {
  size: number;
}

export default function SearchBar({ size }: SearchBarProps) {
  const [search, setSearch] = useState<string>("");
  const [matches, setMatches] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
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
        setSelectedIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle keyboard events
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      setSelectedIndex((prevIndex) =>
        prevIndex < matches.length - 1 ? prevIndex + 1 : prevIndex
      );
    } else if (e.key === "ArrowUp") {
      setSelectedIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : prevIndex
      );
    } else if (e.key === "Enter" && selectedIndex !== -1) {
      router.push(`/cards/${encodeURIComponent(matches[selectedIndex])}`);
    }
  };

  return (
    <div ref={searchRef} className={`relative w-${size} flex flex-col gap-0 shadow-xl`}>
      <input
        className="px-2 py-1 border rounded"
        type="text"
        placeholder="Search"
        onChange={(e) => {
          setSearch(e.target.value);
          setIsDropdownOpen(true);
          setSelectedIndex(-1);
        }}
        value={search}
        onKeyDown={handleKeyDown}
      />
      {isDropdownOpen && matches.length > 0 && (
        <div className="absolute mt-8 w-full bg-white border shadow-xl">
          {matches.slice(0, 10).map((item, index) => (
            <div
              key={index}
              className={`pl-2 hover:bg-gray-200 cursor-pointer ${selectedIndex === index ? 'bg-gray-300' : ''}`}
              onClick={() => {
                router.push(`/cards/${encodeURIComponent(item)}`);
              }}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              {item.length > 31 ? item.slice(0, 28) + '...' : item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}