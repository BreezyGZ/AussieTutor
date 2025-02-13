"use client";

import { useRouter } from "next/navigation";
import SearchBar from "./SearchBar";

export default function Header() {
  const router = useRouter();
  return (
    <div className="flex justify-between h-16 bg-at-red items-center p-4">
      <div className="flex gap-4">
        <div className="hover:text-at-white hover:cursor-pointer" onClick={() => {router.push("/")}}>
          Home
        </div>
        <div className="hover:text-at-white hover:cursor-pointer" onClick={() => {router.push("/decklist_search")}}>
          Decklist Search
        </div>
      </div>
      <SearchBar size={72}/>
    </div>
  )
}