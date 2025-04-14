import { useState } from "react";
import Card from "../cards/[cardname]/page";
import { CardDetails } from "../interfaces";
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'

interface FilterBarProps {
  priceData: CardDetails[];
  setSets: (selected: string[]) => void;
  setFinishs: (selected: string[]) => void;
  setStores: (selected: string[]) => void;
  setConditions: (selected: string[]) => void;
}

export default function FilterBar({priceData, setSets, setFinishs, setStores, setConditions}: FilterBarProps) {
  const sets = new Set<string>();
  const finishs = new Set<string>();
  const stores = new Set<string>();
  const conditions = new Set<string>();

  const [selectedSets, setSelectedSets] = useState<string[]>([])
  const [selectedFinishs, setSelectedFinishs] = useState<string[]>([])
  const [selectedStores, setSelectedStores] = useState<string[]>([])
  const [selectedConditions, setSelectedConditions] = useState<string[]>([])

  const [isCollapsed, setIsCollapsed] = useState<boolean[]>([true, true, true, true])
  
  
  for (const card of priceData) {
    sets.add(card.set)
    finishs.add(card.finish)
    stores.add(card.store)
    conditions.add(card.condition)
  }

  const handleCollapse = (i: number) => {
    let updated = [...isCollapsed]
    updated[i] = !updated[i]
    setIsCollapsed(updated)
  }

  const handleCollapseAll = () => {
    if (isCollapsed.every(elem => elem === false)) {
      setIsCollapsed([true, true, true, true])
    }
    else {
      setIsCollapsed([false, false, false, false])
    }
  }

  return (
    <div className="flex flex-col w-1/3 border-[2px] border-black bg-white p-4 rounded-md space-y-2">
      <div className="text-lg font-semibold">
        Filter by:
        <button onClick={() => handleCollapseAll()}>
          {isCollapsed.every(elem => elem === false) ? "Collapse All" : "Expand All"}
        </button>
      </div>
      <div className="border-[2px] border-black rounded-md text-sm" onClick={() => handleCollapse(0)}>
        Set:
        <button onClick={() => handleCollapse(0)}>{isCollapsed[0] ? <FaChevronDown/> : <FaChevronUp/>} </button>
        {!isCollapsed[0] && [... sets].sort().map((set: string) => (
          <label key={set} className="block m-2">
            {set}
            <input
            className="ml-1"
            type="checkbox"
            checked={selectedSets.includes(set)}
            onChange={() => {
              const updated = selectedSets.includes(set)
              ? selectedSets.filter((s) => s !== set)
              : [...selectedSets, set];
              setSelectedSets(updated);
              setSets(updated)
            }}
            key={set}
            />
          </label>
        ))}
      </div>
      <div className="border-[2px] border-black rounded-md text-sm" onClick={() => handleCollapse(1)}>
        Finish:
        <button onClick={() => handleCollapse(1)}>{isCollapsed[1] ? <FaChevronDown/> : <FaChevronUp/>} </button>
        {!isCollapsed[1] && [... finishs].sort().map((finish: string) => (
          <label key={finish} className="block m-2">
            {finish}
            <input
            className="ml-1"
            type="checkbox"
            checked={selectedFinishs.includes(finish)}
            onChange={() => {
              const updated = selectedFinishs.includes(finish)
              ? selectedFinishs.filter((s) => s !== finish)
              : [...selectedFinishs, finish];
              setSelectedFinishs(updated);
              setFinishs(updated)
            }}
            key={finish}
            />
          </label>
        ))}
      </div>
      <div className="border-[2px] border-black rounded-md text-sm" onClick={() => handleCollapse(2)}>
        Store:
        <button onClick={() => handleCollapse(2)}>{isCollapsed[2] ? <FaChevronDown/> : <FaChevronUp/>} </button>
        {!isCollapsed[2] && [... stores].sort().map((store: string) => (
          <label key={store} className="block m-2">
            {store}
            <input
            className="ml-1"
            type="checkbox"
            checked={selectedStores.includes(store)}
            onChange={() => {
              const updated = selectedStores.includes(store)
              ? selectedStores.filter((s) => s !== store)
              : [...selectedStores, store];
              setSelectedStores(updated);
              setStores(updated)
            }}
            key={store}
            />
          </label>
        ))}
      </div>
      <div className="border-[2px] border-black rounded-md text-sm" onClick={() => handleCollapse(3)}>
        Condition:
        <button onClick={() => handleCollapse(3)}>{isCollapsed[3] ? <FaChevronDown/> : <FaChevronUp/>} </button>
        {!isCollapsed[3] && [... conditions].sort().map((condition: string) => (
          <label key={condition} className="block m-2">
            {condition}
            <input
            className="ml-1"
            type="checkbox"
            checked={selectedConditions.includes(condition)}
            onChange={() => {
              const updated = selectedConditions.includes(condition)
              ? selectedConditions.filter((s) => s !== condition)
              : [...selectedConditions, condition];
              setSelectedConditions(updated);
              setConditions(updated)
            }}
            key={condition}
            />
          </label>
        ))}
      </div>
    </div>
  )
}