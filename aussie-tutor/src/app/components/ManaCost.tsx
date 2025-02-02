import React from "react";

interface ManaCostProps {
  manaCost: string;
}

const MANA_COLORS: { [key: string]: string } = {
  '{T}': 'https://svgs.scryfall.io/card-symbols/T.svg',
  '{Q}': 'https://svgs.scryfall.io/card-symbols/Q.svg',
  '{E}': 'https://svgs.scryfall.io/card-symbols/E.svg',
  '{P}': 'https://svgs.scryfall.io/card-symbols/P.svg',
  '{PW}': 'https://svgs.scryfall.io/card-symbols/PW.svg',
  '{CHAOS}': 'https://svgs.scryfall.io/card-symbols/CHAOS.svg',
  '{TK}': 'https://svgs.scryfall.io/card-symbols/TK.svg',
  '{X}': 'https://svgs.scryfall.io/card-symbols/X.svg',
  '{0}': 'https://svgs.scryfall.io/card-symbols/0.svg',
  '{1}': 'https://svgs.scryfall.io/card-symbols/1.svg',
  '{2}': 'https://svgs.scryfall.io/card-symbols/2.svg',
  '{3}': 'https://svgs.scryfall.io/card-symbols/3.svg',
  '{4}': 'https://svgs.scryfall.io/card-symbols/4.svg',
  '{5}': 'https://svgs.scryfall.io/card-symbols/5.svg',
  '{6}': 'https://svgs.scryfall.io/card-symbols/6.svg',
  '{7}': 'https://svgs.scryfall.io/card-symbols/7.svg',
  '{8}': 'https://svgs.scryfall.io/card-symbols/8.svg',
  '{9}': 'https://svgs.scryfall.io/card-symbols/9.svg',
  '{10}': 'https://svgs.scryfall.io/card-symbols/10.svg',
  '{11}': 'https://svgs.scryfall.io/card-symbols/11.svg',
  '{12}': 'https://svgs.scryfall.io/card-symbols/12.svg',
  '{13}': 'https://svgs.scryfall.io/card-symbols/13.svg',
  '{14}': 'https://svgs.scryfall.io/card-symbols/14.svg',
  '{15}': 'https://svgs.scryfall.io/card-symbols/15.svg',
  '{16}': 'https://svgs.scryfall.io/card-symbols/16.svg',
  '{17}': 'https://svgs.scryfall.io/card-symbols/17.svg',
  '{18}': 'https://svgs.scryfall.io/card-symbols/18.svg',
  '{19}': 'https://svgs.scryfall.io/card-symbols/19.svg',
  '{20}': 'https://svgs.scryfall.io/card-symbols/20.svg',
  '{W/U}': 'https://svgs.scryfall.io/card-symbols/WU.svg',
  '{W/B}': 'https://svgs.scryfall.io/card-symbols/WB.svg',
  '{B/R}': 'https://svgs.scryfall.io/card-symbols/BR.svg',
  '{B/G}': 'https://svgs.scryfall.io/card-symbols/BG.svg',
  '{U/B}': 'https://svgs.scryfall.io/card-symbols/UB.svg',
  '{U/R}': 'https://svgs.scryfall.io/card-symbols/UR.svg',
  '{R/G}': 'https://svgs.scryfall.io/card-symbols/RG.svg',
  '{R/W}': 'https://svgs.scryfall.io/card-symbols/RW.svg',
  '{G/W}': 'https://svgs.scryfall.io/card-symbols/GW.svg',
  '{G/U}': 'https://svgs.scryfall.io/card-symbols/GU.svg',
  '{B/G/P}': 'https://svgs.scryfall.io/card-symbols/BGP.svg',
  '{B/R/P}': 'https://svgs.scryfall.io/card-symbols/BRP.svg',
  '{G/U/P}': 'https://svgs.scryfall.io/card-symbols/GUP.svg',
  '{G/W/P}': 'https://svgs.scryfall.io/card-symbols/GWP.svg',
  '{R/G/P}': 'https://svgs.scryfall.io/card-symbols/RGP.svg',
  '{R/W/P}': 'https://svgs.scryfall.io/card-symbols/RWP.svg',
  '{U/B/P}': 'https://svgs.scryfall.io/card-symbols/UBP.svg',
  '{U/R/P}': 'https://svgs.scryfall.io/card-symbols/URP.svg',
  '{W/B/P}': 'https://svgs.scryfall.io/card-symbols/WBP.svg',
  '{W/U/P}': 'https://svgs.scryfall.io/card-symbols/WUP.svg',
  '{C/W}': 'https://svgs.scryfall.io/card-symbols/CW.svg',
  '{C/U}': 'https://svgs.scryfall.io/card-symbols/CU.svg',
  '{C/B}': 'https://svgs.scryfall.io/card-symbols/CB.svg',
  '{C/R}': 'https://svgs.scryfall.io/card-symbols/CR.svg',
  '{C/G}': 'https://svgs.scryfall.io/card-symbols/CG.svg',
  '{2/W}': 'https://svgs.scryfall.io/card-symbols/2W.svg',
  '{2/U}': 'https://svgs.scryfall.io/card-symbols/2U.svg',
  '{2/B}': 'https://svgs.scryfall.io/card-symbols/2B.svg',
  '{2/R}': 'https://svgs.scryfall.io/card-symbols/2R.svg',
  '{2/G}': 'https://svgs.scryfall.io/card-symbols/2G.svg',
  '{H}': 'https://svgs.scryfall.io/card-symbols/H.svg',
  '{W/P}': 'https://svgs.scryfall.io/card-symbols/WP.svg',
  '{U/P}': 'https://svgs.scryfall.io/card-symbols/UP.svg',
  '{B/P}': 'https://svgs.scryfall.io/card-symbols/BP.svg',
  '{R/P}': 'https://svgs.scryfall.io/card-symbols/RP.svg',
  '{G/P}': 'https://svgs.scryfall.io/card-symbols/GP.svg',
  '{W}': 'https://svgs.scryfall.io/card-symbols/W.svg',
  '{U}': 'https://svgs.scryfall.io/card-symbols/U.svg',
  '{B}': 'https://svgs.scryfall.io/card-symbols/B.svg',
  '{R}': 'https://svgs.scryfall.io/card-symbols/R.svg',
  '{G}': 'https://svgs.scryfall.io/card-symbols/G.svg',
  '{C}': 'https://svgs.scryfall.io/card-symbols/C.svg',
  '{S}': 'https://svgs.scryfall.io/card-symbols/S.svg'
}

export default function ManaCost({ manaCost }: ManaCostProps) {
  const symbols = manaCost.match(/{(.*?)}/g)?.map((symbol) => symbol.replace(/[{}]/g, "").toUpperCase());
  return (
    <span className="flex">
      {symbols?.map((symbol, index) => {
        const svgUrl = MANA_COLORS[`{${symbol}}`];
        return svgUrl ? (
          <img
            key={index}
            src={svgUrl}
            alt={symbol}
            style={{ width: "20px", height: "20px", marginRight: "2px" }}
          />
        ) : null;
      })}
    </span>
  );
}
