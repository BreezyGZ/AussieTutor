'use client'

import { useEffect, useRef, useState } from "react";
import { useRouter } from 'next/navigation';
import { BACKEND_URL } from '@/app/backendConfig'

export default function DecklistSearch() {
  const [input, setInput] = useState<string>("")

  const handleChange = (e:React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
  };

  const isNumeric = (str: string): boolean => {
    return !isNaN(Number(str)) && str.trim() !== '';
  };
  const handleSubmit = () => {
    const output: Array<Array<string|number>> = []
    const lines: Array<string> = input.split('\n');
    console.log(lines)

    for (const line of lines) {
      const trimmed = line.trim()
      if (trimmed === "") {
        continue;
      }
      const raw = trimmed.split(' ')
      const cleaned: Array<string|number> = []

      if (isNumeric(raw[0])) {
        cleaned.push(Number(raw.shift()))
      } else {
        cleaned.push(1)
      }
      cleaned.push(raw.join(" "))
      console.log(cleaned)
    }

  }

  return (
    <div className="flex flex-col items-center mt-20">
      <textarea
        className="w-1/2 min-h-[200px] p-3"
        value={input}
        onChange={handleChange}
       />
      <button className="px-4 py-2 text-white rounded bg-at-red"
        onClick={handleSubmit}>
        Go!
      </button>
    </div>
  )
}

function isNumeric(arg0: string) {
  throw new Error("Function not implemented.");
}
