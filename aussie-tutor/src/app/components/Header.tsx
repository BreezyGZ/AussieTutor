"use client";

import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import SearchBar from "./SearchBar";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const isLanding = pathname === "/";

  const textColor = isLanding ? "text-white" : "text-black"
  const hover = isLanding ? "hover:text-black" : "hover:text-at-red"

  return (
    // <div className="flex justify-between h-16 bg-at-red items-center p-4">
    <div className="fixed top-0 left-0 w-full z-50 flex justify-between h-16 items-center p-4 sm:p-10 lg:p-10">
      <div
        className={`tracking-[0.05em] hover:cursor-pointer flex gap-10 font-inlander text-xl ${textColor}`}
      >
        <div className={hover} onClick={() => {router.push("/")}}>
          home
        </div>
        <div className={hover} onClick={() => {router.push("/decklist_search")}}>
          decklist search
        </div>
      </div>
      <SearchBar size="w-1/3 sm:w-48 lg:w-60" text="Search"/>
    </div>
  )
}