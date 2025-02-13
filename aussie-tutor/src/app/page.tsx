"use client";
import Image from 'next/image';
import './globals.css'
import './landing.css'
import SearchBar from './components/SearchBar';

export default function Home() {
  // const [search, setSearch] = useState<string>("")
  // const [matches, setMatches] = useState<string[]>([])
  // const router = useRouter();

  // useEffect(() => {
  //   const fetchMatches = async () => {
  //     try {
  //       const newMatches = await getPartialMatches(search); // Call your async function
  //       setMatches(newMatches); // Update state with results
  //     } catch (error) {
  //       console.error("Error fetching matches:", error);
  //     }
  //   };
  
  //   if (search === "") {
  //     setMatches([]);
  //   } else {
  //     fetchMatches();
  //   }
  // }, [search]);

  return (
    <div className="flex flex-col items-center gap-20 pb-20 mt-10 justify-between min-h-screen">
      <div className="flex flex-col gap-8 items-center p-10">
        <h1>AussieTutor</h1>
        <SearchBar size={96} />
        <p className="text-center">
          Search for any card and instantly compare prices across multiple Australian vendors. <br />
          Get the best price and save on your collection!
        </p>
      </div>
  
      {/* Responsive Image Container */}
      <div className="absolute bottom-0 left-0 w-full flex h-[40vh]">
      <Image
        src="/assets/apac_rabbit.jpg"
        alt="APAC Rabbit"
        width={650}
        height={300}
        className="w-1/3 h-auto object-cover"
      />
      <Image
        src="/assets/apac_dragon.png"
        alt="APAC Dragon"
        width={680}
        height={300}
        className="w-1/3 h-auto object-cover"
      />
      <Image
        src="/assets/apac_snake.jpg"
        alt="APAC Snake"
        width={600}
        height={300}
        className="w-1/3 h-auto object-cover"
      />
    </div>
    </div>
  );
  
}
