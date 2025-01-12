"use client";

import scrape from "./scrape"
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from "react";

export default function Card() {
  const { cardname } = useParams<{ cardname: string | string[] | undefined }>();
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (typeof cardname === 'string') {
        // Safe to use cardname as a string
        const result = await scrape(cardname);
        setData(result);
      } else {
        console.error("cardname is not a string");
      }
    };
    fetchData();
  }, [cardname]);

  return (
    <div>
      <h1>{cardname}</h1>
      {data.map((card, index) => (
        <div key={index}>
          <p>{card.store}</p>
          <p>{card.price}</p>
        </div>
      ))}
    </div>
  );
}
