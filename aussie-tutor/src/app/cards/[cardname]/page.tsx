"use client";

import scrape from "./scrape"
import getCardFace from "./getCardFace";
import { useParams, useRouter } from 'next/navigation'
import { JSX, useEffect, useState } from "react";
import {InfoPanelProps, CardDetails} from '../../interfaces'
import '../../globals.css';

function InfoPanel({ card }: InfoPanelProps): JSX.Element {
  const description = card.details ? `${card.set} (${card.details})` : card.set
  const [face, setFace] = useState<string>("")
  
  useEffect(() => {
    // Define the async function inside the effect
    const fetchCardFace = async () => {
      try {
        const faceUrl = await getCardFace(card);
        setFace(faceUrl);
      } catch (error) {
        console.error("Error fetching card face:", error);
      }
    };
    fetchCardFace();
  }, [card]);

  return (
    <div className="flex">
      <img src={face || undefined} width={146} height={204}></img>
      <div>
        {/* change this to store's logo */}
        {/* <h1>{card.store}</h1> */}
        <p>{description}</p>
        <h2>Price: {card.price}</h2>
      </div>
    </div>
  )
} 

export default function Card() {
  const { cardname } = useParams<{ cardname: string | string[] | undefined }>();
  const [data, setData] = useState<CardDetails[]>([]);

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
    <div className="flex justify-between">
      <div className="flex flex-col">
        <h1 className="text-blue-500">{cardname}</h1>
        {data.map((card: CardDetails, index) => (
          <InfoPanel key={index} card={card} />
        ))}
      </div>
    </div>
  );
}
