import { JSX, useEffect, useState } from "react"
import scrape from "./cards/[cardname]/scrape"

interface InfoPanelProps {
  face: string;
  card: CardDetails;
}

interface CardDetails {
  cardname: string;
  condition: string;
  details: string | null;
  finish: string;
  price: number;
  set: string;
  stock: number;
  store: string;
}

function InfoPanel({ face, card }: InfoPanelProps): JSX.Element {
  const description = card.details ? `${card.set} ${card.details}` : card.set
	return (
    <div className="flex">
      <img src={face} width={488} height={680}></img>
      <div>
        {/* change this to store's logo */}
        penis
        {/* <h1>{card.store}</h1> */}
        <p>{description}</p>
        <h2>Price: {card.price}</h2>
      </div>
    </div>
  )
} 

export default function Card(cardname:string) {
	const [data, setData] = useState<CardDetails[]>([])

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
			{/* {
				data.map((card, index) => (
					<div>
						<p>{card.store}</p>
						<p>{card.price}</p>
					</div>
				))
			} */}
      {
				data.map((card, index) => (
          <InfoPanel
          face={""}
          card={card}
          />

				))
			}
		</div>
	)
}