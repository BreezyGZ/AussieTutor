import { useEffect, useRef, useState } from "react";
import { CardDetails } from "../interfaces";
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'

interface FilterBarProps {
  setIsFilterOpen: (isFilterOpen: boolean) => void;
  priceData: CardDetails[];

  selectedSets: string[];
  setSelectedSets: (selected: string[]) => void;

  selectedFinishs: string[];
  setSelectedFinishs: (selected: string[]) => void;

  selectedStores: string[];
  setSelectedStores: (selected: string[]) => void;

  selectedConditions: string[];
  setSelectedConditions: (selected: string[]) => void;
}

export default function FilterBar({
    setIsFilterOpen, priceData, selectedSets, setSelectedSets, selectedFinishs, setSelectedFinishs,
    selectedStores, setSelectedStores, selectedConditions, setSelectedConditions
  }: FilterBarProps) {
  const sets = new Set<string>();
  const finishs = new Set<string>();
  const stores = new Set<string>();
  const conditions = new Set<string>();

  // const [selectedSets, setSelectedSets] = useState<string[]>([])
  // const [selectedFinishs, setSelectedFinishs] = useState<string[]>([])
  // const [selectedStores, setSelectedStores] = useState<string[]>([])
  // const [selectedConditions, setSelectedConditions] = useState<string[]>([])
  const [isCollapsed, setIsCollapsed] = useState<boolean[]>([false, false, false, false])
  
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (overlayRef.current && !overlayRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setIsFilterOpen]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);
  
  for (const card of priceData) {
    sets.add(card.set)
    finishs.add(card.finish)
    stores.add(card.store)
    conditions.add(card.condition)
  }

  const handleCollapse = (i: number) => {
    const updated = [...isCollapsed]
    updated[i] = !updated[i]
    setIsCollapsed(updated)
  }

  const handleClearAll = () => {
    setSelectedSets([])
    setSelectedFinishs([])
    setSelectedStores([])
    setSelectedConditions([])
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center z-50 bg-gray-600 bg-opacity-60" >
      <div className="flex flex-col relative w-2/3 sm:w-1/2 max-h-[80vh] overflow-y-auto p-5 bg-white space-y-2 rounded-2xl" ref={overlayRef}>
        {[
          { label: "set", data: sets, selected: selectedSets, setSelected: setSelectedSets },
          { label: "finish", data: finishs, selected: selectedFinishs, setSelected: setSelectedFinishs },
          { label: "store", data: stores, selected: selectedStores, setSelected: setSelectedStores },
          { label: "condition", data: conditions, selected: selectedConditions, setSelected: setSelectedConditions },
        ].map(({ label, data, selected, setSelected }, i) => (
        <div
          key={label}
          className="sm p-3 transition-all"
        >
          <div 
            className="flex justify-between items-center cursor-pointer select-none"
            onClick={() => handleCollapse(i)}
          >
            <span className="font-inlander font-medium tracking-[0.05em]">{label}</span>
            <button>
              {isCollapsed[i] ? (
                <FaChevronDown className="text-gray-500" />
              ) : (
                <FaChevronUp className="text-gray-500" />
              )}
            </button>
          </div>
          <hr className="w-full h-0.5 bg-gray-300 border-none my-2" />
          {!isCollapsed[i] && (
            <div className="flex flex-wrap gap-3 mt-2 pr-1">
              {[...data].sort().map((item: string) => (
                <label key={item} className="flex items-center gap-2 text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    className="accent-blue-600"
                    checked={selected.includes(item)}
                    onChange={() => {
                      const updated = selected.includes(item)
                        ? selected.filter((s) => s !== item)
                        : [...selected, item];
                      setSelected(updated);
                    }}
                  />
                  {item}
                </label>
              ))}
            </div>
          )}

        </div>
        ))}
        <div className="flex justify-between px-4 pt-2">
          <button
            onClick={handleClearAll}
            className="text-sm font-semibold text-gray-600 hover:text-at-red transition"
          >
            Clear All
          </button>
          <button
            onClick={() => setIsFilterOpen(false)}
            className="text-sm font-semibold text-gray-600 hover:text-at-red transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
  
}