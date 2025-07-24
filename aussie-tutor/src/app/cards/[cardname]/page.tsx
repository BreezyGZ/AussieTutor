"use client";

import scrape from "./scrape"
import getCardFace from "./getCardFace";
import { useParams } from 'next/navigation'
import { JSX, useEffect, useState } from "react";
import {InfoPanelProps, CardDetails} from '@/app/interfaces.js'
import Image from "next/image";
import axios from "axios";
import '@/app/globals.css';
import ManaCost from "@/app/components/ManaCost";
import LoadingWheel from "@/app/components/LoadingWheel";
import FilterBar from "@/app/components/FilterBar";

function InfoPanel({ card }: InfoPanelProps): JSX.Element {
  const [face, setFace] = useState<string>("")
  
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
      <div className="flex flex-col gap-1 w-1/2">
        {card.store === "Magic Hothub" && <Image src="/assets/magichothub-logo.jpg" alt="Magic HotHub" width={130} height={50}/>}
        {card.store === "MTGMate" && <Image src="/assets/mtgmate-logo.png" alt="MtgMate" width={130} height={50}/>}
        {card.store === "Ronin Games" && <Image src="/assets/ronin-logo.png" alt="RoninGames" width={70} height={50}/>}
        {card.store === "Good Games" && <Image src="/assets/goodgames-logo.png" alt="GoodGames" width={130} height={50}/>}
        {card.store === "Games Portal" && <Image src="/assets/gamesportal-logo.png" alt="Games Portal" width={130} height={50}/>}

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
  const [flavor, setFlavor] = useState<string>("");
  const [manaCost, setManaCost] = useState<string>("{}");
  const [isSearching, setIsSearching] = useState<boolean>(true);
  const decodedCardname = cardname ? decodeURIComponent(cardname) : undefined;

  const [priceData, setPriceData] = useState<CardDetails[]>([]);
  const [filteredPriceData, setFilteredPriceData] = useState<CardDetails[]>([]);
  
  const [selectedSets, setSelectedSets] = useState<string[]>([])
  const [selectedFinishs, setSelectedFinishs] = useState<string[]>([])
  const [selectedStores, setSelectedStores] = useState<string[]>([])
  const [selectedConditions, setSelectedConditions] = useState<string[]>([])

  // const handleSetChange = (selected: string[]) => {
  //   setSelectedSets(selected)
  // }
  useEffect(() => {
    let updated = priceData
    if (selectedSets.length > 0) {
      updated = updated.filter((details) => selectedSets.includes(details.set))
    }
    if (selectedFinishs.length > 0) {
      updated = updated.filter((details) => selectedFinishs.includes(details.finish))
    }
    if (selectedStores.length > 0) {
      updated = updated.filter((details) => selectedStores.includes(details.store))
    }
    if (selectedConditions.length > 0) {
      updated = updated.filter((details) => selectedConditions.includes(details.condition))
    }
    setFilteredPriceData(updated)

  }, [selectedSets, selectedFinishs, selectedStores, selectedConditions, priceData])
  
  // useEffect(() => {
  //   if (selectedFinishs.length !== 0) {
  //     const updated = priceData.filter((details) => selectedFinishs.includes(details.finish))
  //     console.log(updated)
  //     setFilteredPriceData(updated)
  //   }
  //   else {
  //     setFilteredPriceData(priceData)
  //   }
  // }, [selectedSets, selectedFinishs])
  
  useEffect(() => {
    const fetchData = async () => {
      if (typeof decodedCardname === 'string') {
        const result = await scrape(decodedCardname);
        setPriceData(result);
        setFilteredPriceData(result);
        setIsSearching(false);
      } else {
        console.error("cardname is not a string");
      }
    };

    const decorate = async() => {
      try {
        const {data} = await axios.get(`https://api.scryfall.com/cards/search?q=!"${decodedCardname}"&unique=prints`)
        // console.log(data)

        if (!data.data) {
          return;
        }
        if (data.data[0].mana_cost) {
          setManaCost(data.data[0].mana_cost)
        }
        
        for (const card of data.data) {
          // console.log(card)
          if (card.flavor_text) {
            setFlavor(`${card.flavor_text}`);
            break;
          }
        }
      } catch (error) {
        console.log("flavor scryfall fail" + error)
      }
    }
    fetchData();
    decorate();
  }, [cardname]);

  return (
    <div className="flex justify-center">
      <FilterBar 
        priceData={priceData} 
        setSets={setSelectedSets} 
        setFinishs={setSelectedFinishs} 
        setStores={setSelectedStores} 
        setConditions={setSelectedConditions}
      />
      <div className="flex flex-col items-center w-full">
        <div className="flex items-center space-x-8 pt-5 px-10">
          <h1 className="font-beleren">{decodedCardname && decodeURIComponent(decodedCardname)}</h1>
          <ManaCost manaCost={manaCost}/>
        </div>
        
        {flavor && <p className="w-2/3 text-center italic py-3">{flavor}</p>}
        <div className="flex items-center justify-center w-full">
          <div className="flex flex-wrap flex-row justify-center w-2/3 gap-4">
          {isSearching && <LoadingWheel/>}
          {(!isSearching && data.length === 0) && 
          <p className="mt-20 italic text-gray-400">Looks like this card is playing hard to get. It&apos;s out of stock for now!</p>}
            {data.map((card: CardDetails, index) => (
              <InfoPanel key={index} card={card} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
