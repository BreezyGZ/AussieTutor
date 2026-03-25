"use client";
import './globals.css'
import './landing.css'
import SearchBar from './components/SearchBar';

export default function Home() {
  // flex flex-col items-center justify-between 
  return (
    <div 
      className="gap-20 pb-20 min-h-screen bg-landing bg-cover bg-center "
    >
      <div className="absolute inset-0 bg-at-red bg-opacity-60 z-0" />
      <div className="flex flex-col gap-4 items-center p-10 pt-40">
        <h1 className='font-inlander tracking-[0.25em] text-4xl md:text-5xl lg:text-6xl text-white z-10'>aussietutor</h1>
        <p className="text-center z-10 text-xl text-white pb-5">
          A one-stop site to find the best deals in Australia!
        </p>
        <SearchBar size="w-full sm:w-2/3 lg:w-1/3" text="Type any card name..."/>
      </div>
    </div>
  );
  
}
