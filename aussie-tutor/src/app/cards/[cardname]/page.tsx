"use client";

import scrape from "./scrape"
import getCardFace from "./getCardFace";
import { useParams, useRouter } from 'next/navigation'
import { JSX, useEffect, useState } from "react";
import {InfoPanelProps, CardDetails} from '@/app/interfaces.js'
import Image, { StaticImageData } from "next/image";
import axios from "axios";
// import magicHothubLogo from '@/assets/magichothub-logo.jpg'
// import mtgmateLogo from '@/assets/mtgmate-logo.png'
// import pacifism from '@/assets/fdn-501-pacifism.jpg'
import '@/app/globals.css';
// import "@saeris/typeface-beleren-bold"
import ManaCost from "@/app/components/ManaCost";

function InfoPanel({ card }: InfoPanelProps): JSX.Element {
  const [face, setFace] = useState<string>("")
  // const [logo, setLogo] = useState<any>(null)
  
  const priceString = '$' + card.price.toFixed(2).toString();
  const description = card.details ? `${card.set} (${card.details})` : card.set

  useEffect(() => {
    if (card.image) {
      setFace(card.image)
      return
    }
    const fetchCardFace = async () => {
      try {
        const faceUrl = await getCardFace(card);
        setFace(faceUrl);
      } catch (error) {
        console.error("Error fetching card face:", error);
      }
    };
    // console.log(card.store)
    // if (card.store === "MTGMate") {
    //   setLogo(mtgmateLogo)
    // } 
    // else if (card.store === "Magic Hothub") {
    //   setLogo(magicHothubLogo)
    // }
    fetchCardFace();
  }, [card]);

  return (
    <div 
      className="flex w-96 gap-4 bg-at-yellow py-7 pl-4 justify-center gap-5 hover:bg-at-red hover:cursor-point duration-150" 
      onClick={() => window.location.href = card.link}
    >
      
      <div className="flex flex-col items-center">
        <img src={face || undefined} width={146} height={204}></img>
        <p>{priceString}</p>
      </div>
      <div className="w-1/2">
        {/* {logo && <Image src={logo} alt={card.store} width={130} height={50}/>} */}
        {/* {card.store === "Magic Hothub" && <Image src={magicHothubLogo} alt="Magic HotHub" width={130} height={50}/>} */}
        {card.store === "Magic Hothub" && <Image src="/assets/magichothub-logo.jpg" alt="Magic HotHub" width={130} height={50}/>}
        {/* {card.store === "MTGMate" && <Image src={mtgmateLogo} alt="MtgMate" width={130} height={50}/>} */}
        {card.store === "MTGMate" && <Image src="/assets/mtgmate-logo.png" alt="MtgMate" width={130} height={50}/>}
        <p className="font-beleren text- break-words">{description}</p>  
        <p>Condition: {card.condition}</p>
        <p>Finish: {card.finish}</p>
        <p>Stock: {card.stock}</p>
      </div>
    </div>
  )
} 

export default function Card() {
  const { cardname } = useParams<{ cardname: string | undefined }>();
  const [data, setData] = useState<CardDetails[]>([]);
  const [flavor, setFlavor] = useState<string>("")
  const [manaCost, setManaCost] = useState<string>("")

  useEffect(() => {
    const fetchData = async () => {
      if (typeof cardname === 'string') {
        const result = await scrape(cardname);
        setData(result);
        // console.log(result)
      } else {
        console.error("cardname is not a string");
      }
    };

    const decorate = async() => {
      try {
        const {data} = await axios.get(`https://api.scryfall.com/cards/search?q=!"${cardname}"&unique=prints`)
        if (!data.data) {
          return
        }
        setManaCost(data.data[0].mana_cost)
        // console.log(data.data)
        for (const card of data.data) {
          // console.log(card)
          if (card.flavor_text) {
            setFlavor(`${card.flavor_text}`);
            break;
          }
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchData();
    decorate();
  }, [cardname]);

  return (
    <div className="flex justify-center">
      <div className="flex flex-col items-center w-full">
        <div className="flex items-center space-x-8 pt-5 px-10">
          <h1 className="font-beleren">{cardname && decodeURIComponent(cardname)}</h1>
          <ManaCost manaCost={manaCost}/>
        </div>
        
        {flavor && <p className="w-2/3 text-center italic py-3">{flavor}</p>}
        <div className="flex items-center justify-center w-full">

          <div className="flex flex-wrap flex-row justify-center w-2/3 gap-4">
            {data.map((card: CardDetails, index) => (
              <InfoPanel key={index} card={card} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
