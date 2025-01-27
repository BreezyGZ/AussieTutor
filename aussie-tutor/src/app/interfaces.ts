export interface InfoPanelProps {
  card: CardDetails;
}
  
export interface CardDetails {
  cardname: string;
  condition: string;
  details: string | null;
  finish: string;
  price: number;
  set: string;
  stock: number | string;
  store: string;
  image: string | null;
  link: string;
}