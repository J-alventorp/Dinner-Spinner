# Spin for Dinner 🎡🍽️

En liten webbapp där du snurrar fram kvällens middag istället för att bestämma själv. Snurra ett hjul per station – kök, protein, kolhydrat, tre grönsaker, sås, topping och ett wild card – och få ett recept som faktiskt anpassar sig efter råvarorna du fick.

## Snurrlägen
- **🎡 Klassiskt** – ett hjul i taget, en station åt gången
- **🎯 Skicklighet** – hjulet friersnurrar tills du trycker STOPP. Träffa den gyllene rutan så får du bonus
- **⚡ Turbo** – alla hjul snurrar samtidigt, hela tallriken fylls på några sekunder
- **🎰 Jackpot** – tre hjul per station; två lika ger jackpot och en bonus

## Funktioner
- **Bonusrutor** – en gyllene ruta dyker ibland upp i hjulet. Landar du på den startar minispelet, och sedan får du snurra om gratis. Turen går aldrig förlorad
- **🍳 Fånga ingrediensen** – ett minispel på elva sekunder. Tryck på ingredienserna, undvik bomberna. Poängen avgör hur många bonusar du får. Går även att spela fritt via 🎮 i toppen
- **🌈 Gyllene läget** – ett hemligt läge som låses upp när du spelat tillräckligt (40 snurr eller fem bonusar). Regnbågshjul, chiptune-ljud, en extra mystisk station, dubbelt så många bonusrutor och ingredienser som inte borde finnas
- **Sex teman** – Klassiskt, Vegetariskt, Fisk & skaldjur, Asiatiskt, Husmanskost och 15 minuter
- **Tretton kök** att inspireras av, från Nordiskt till Vietnamesiskt
- **Tjugo recept-mallar** som kombineras med råvaruprofiler, så att räkor får "2–3 minuter, ta av värmen direkt" medan högrev får puttra
- Anpassa vad som finns på varje hjul (lägg till / ta bort / återställ)
- Spara måltider som favoriter, med det genererade receptet
- Historik över de senaste måltiderna, så du slipper upprepningar
- Ljud, konfetti, gnistor och vibration – allt går att stänga av med 🔊-knappen
- Respekterar `prefers-reduced-motion`
- Allt sparas lokalt i webbläsaren (`localStorage`) – inget konto behövs

## Köra lokalt
```
npm install
npm run dev
```
Bygg för produktion med `npm run build` (output i `dist/`), förhandsgranska med `npm run preview`.

## Teknik
React + Vite, utan fler beroenden än så. Alla ljud är syntetiserade med WebAudio (inga ljudfiler), och konfetti och gnistor är egen canvas-kod. All persistens sker lokalt i webbläsaren – ingen backend.
