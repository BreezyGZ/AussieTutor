import { useEffect, useState } from "react"
import scrape from "./cards/[cardname]/scrape"

function CardInfo(face:string, store:string, set:string, price: string, details:any) {
	return (
    <div className="flex">
      <img src={face} width={488} height={680}></img>
      <div>
        {/* change this to store's logo */}
        <h1>{store}</h1>
        <h2></h2>
        <p>Set: {set}</p>
      </div>
    </div>
  )
} 

export default function Card(cardname:string) {
	const [data, setData] = useState<any[]>([])

	useEffect(() => {
		const fetchData = async () => {
			const result = await scrape(cardname);
			setData(result);
		};
		fetchData();
	}, [cardname])
	// scrape(cardname)
	return (
		<div>
			<h1>
				{cardname}
			</h1>
			{
				data.map((card, index) => (
					<div>
						<p>{card.store}</p>
						<p>{card.price}</p>
					</div>
				))
			}
		</div>
	)
}