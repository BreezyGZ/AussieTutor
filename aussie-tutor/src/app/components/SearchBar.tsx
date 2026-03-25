"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from 'next/navigation';
import { BACKEND_URL } from '@/app/backendConfig'
import { FaSearch } from "react-icons/fa";

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

function ResponsiveTruncatedText({ text }: { text: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [maxChars, setMaxChars] = useState(28);

  useEffect(() => {
    function updateMaxChars() {
      if (!containerRef.current) return;
      const width = containerRef.current.offsetWidth;

      if (width > 400) setMaxChars(50);
      else if (width > 350) setMaxChars(45);
      else if (width > 300) setMaxChars(35);
      else if (width > 200) setMaxChars(25);
      else if (width > 150) setMaxChars(18);
      else setMaxChars(10);
    }

    updateMaxChars();
    window.addEventListener("resize", updateMaxChars);
    return () => window.removeEventListener("resize", updateMaxChars);
  }, []);

  const displayText =
    text.length > maxChars ? text.slice(0, maxChars - 3) + "..." : text;

  return <div ref={containerRef}>{displayText}</div>;
}

interface SearchBarProps {
  size: string;
  text: string;
}

export default function SearchBar({ size, text }: SearchBarProps) {
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      setSelectedIndex((prevIndex) =>
        prevIndex < matches.length - 1 ? prevIndex + 1 : prevIndex
      );
    } else if (e.key === "ArrowUp") {
      setSelectedIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : prevIndex
      );
    } else if (e.key === "Enter") {
        if (selectedIndex === -1) router.push(`/cards/${encodeURIComponent(search)}`);
        else router.push(`/cards/${encodeURIComponent(matches[selectedIndex])}`);
      
    }
  };

  return (
    <div ref={searchRef} className={`relative ${size} flex flex-col gap-0 z-10`}>
      <input
        className="px-4 py-2 text-lg rounded-2xl z-20"
        type="text"
        placeholder={text}
        onChange={(e) => {
          setSearch(e.target.value);
          setIsDropdownOpen(true);
          setSelectedIndex(-1);
        }}
        value={search}
        onKeyDown={handleKeyDown}
      />
      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-500 z-20">
        <FaSearch />
      </div>
      {isDropdownOpen && matches.length > 0 && (
        <div className="absolute mt-4 pt-7 w-full bg-white border z-1 rounded-2xl">
          {matches.slice(0, 10).map((item, index) => (
            <div
              key={index}
              className={`p-1 pl-3 hover:bg-gray-200 cursor-pointer ${selectedIndex === index ? 'bg-gray-300' : ''} rounded-xl`}
              onClick={() => {
                router.push(`/cards/${encodeURIComponent(item)}`);
              }}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <ResponsiveTruncatedText text={item} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}