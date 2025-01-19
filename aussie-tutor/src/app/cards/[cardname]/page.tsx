"use client";

import scrape from "./scrape"
import getCardFace from "./getCardFace";
import { useParams, useRouter } from 'next/navigation'
import { JSX, useEffect, useState } from "react";
import {InfoPanelProps, CardDetails} from '../../interfaces.js'
import '../../globals.css';
import './cards.css';

function InfoPanel({ card }: InfoPanelProps): JSX.Element {
  const description = card.details ? `${card.set} (${card.details})` : card.set
  const [face, setFace] = useState<string>("")
  
  const priceString = '$' + card.price.toFixed(2).toString()
  // console.log(priceString)
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
        <h2>{card.store}</h2>
        <p>{description}</p>
        <h2>Price: {priceString}</h2>
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
        fetch("http://localhost:5000/api/magiccards?card=Counterspell")
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Proxy fetch error:', error));
        const result = await scrape(cardname);
        setData(result);
        console.log(result)
      } else {
        console.error("cardname is not a string");
      }
    };
    fetchData();
  }, [cardname]);

  return (
    <div className="flex justify-around">
      <div className="card-list">
        <h1 className="text-blue-500">{cardname}</h1>
        {data.map((card: CardDetails, index) => (
          <InfoPanel key={index} card={card} />
        ))}
      </div>
    </div>
  );
}
