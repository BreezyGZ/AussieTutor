"use client";
import axios from 'axios';
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import './globals.css'
import './landing.css'
import SearchBar from './components/SearchBar';

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
  const [search, setSearch] = useState<string>("")
  const [matches, setMatches] = useState<string[]>([])
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
    <div className="flex flex-col items-center gap-20 pb-20 mt-10 justify-between h-screen">
      <div className="flex flex-col gap-8 items-center p-10">
        <h1>AussieTutor</h1>
        <SearchBar size={96}/>
        <p className="text-center">
        Search for any card and instantly compare prices across multiple Australian vendors. <br/>
        Get the best price and save on your collection!
        </p>
      </div>
      <div className="flex">
        <Image
          src= "/assets/apac_rabbit.jpg"
          alt="APAC Rabbit"
          width={650}
          height={400}
        />
        <Image
          src= "/assets/apac_dragon.png"
          alt="APAC Dragon"
          width={580}
          height={400}
        />
        <Image
          src= "/assets/apac_snake.jpg"
          alt="APAC Snake"
          width={700}
          height={400}
        />
      </div>
    </div>
  )
}
