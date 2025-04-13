import Card from "../cards/[cardname]/page";
import { CardDetails } from "../interfaces";


interface FilterBarProps {
  priceData: CardDetails[];
}

export default function FilterBar({priceData}: FilterBarProps) {
  let sets = new Set<string>();
  let finishs = new Set<string>();
  let stores = new Set<string>();
  let conditions = new Set<string>();

  for (const card of priceData) {
    sets.add(card.set)
    finishs.add(card.finish)
    stores.add(card.store)
    conditions.add(card.condition)
  }


  console.log(sets)
  console.log(finishs)
  console.log(stores)
  console.log(conditions)

  return (
    <div className="flex flex-col w-1/3 border-[2px] border-black bg-white p-4 rounded-md space-y-2">
      <div className="text-lg font-semibold">Filter by:</div>
      <div className="border-[2px] border-black rounded-md text-sm">
        Set:
        {[... sets].sort().map((set: string) => (
          <p>{set}</p>
        ))}
      </div>
      <div className="border-[2px] border-black rounded-md text-sm">
        Finish:
        {[... finishs].sort().map((finish: string) => (
          <p>{finish}</p>
        ))}
      </div>
      <div className="border-[2px] border-black rounded-md text-sm">
        Store:
        {[... stores].sort().map((store: string) => (
          <p>{store}</p>
        ))}
      </div>
      <div className="border-[2px] border-black rounded-md text-sm">
        Condition:
        {[... conditions].sort().map((condition: string) => (
          <p>{condition}</p>
        ))}
      </div>
    </div>
  )
}