# Dinner Spinner 🎡🍽️

En liten webbapp där du snurrar fram kvällens middag istället för att bestämma själv. Snurra ett hjul per station – kök, protein, kolhydrat, tre grönsaker, sås, topping och ett wild card – och få ett recept som faktiskt anpassar sig efter råvarorna du fick.

## Snurrlägen
- **🎡 Klassiskt** – ett hjul i taget, en station åt gången
- **⚡ Turbo** – alla hjul snurrar samtidigt i ett rutnät, hela tallriken fylls på några sekunder

## Funktioner
- **Bonusrutor** – en gyllene ruta dyker ibland upp i hjulet (i klassiskt läge). Landar du på den får du en extra-topping, en jackpot med flera extras och stor fest, eller ett gratis extraspin på nästa station – och sedan snurrar du om gratis
- **Sex teman** – Klassiskt, Vegetariskt, Fisk & skaldjur, Asiatiskt, Husmanskost och 15 minuter
- **Tretton kök** att inspireras av, från Nordiskt till Vietnamesiskt
- **Tjugo recept-mallar** som kombineras med råvaruprofiler, så att räkor får "2–3 minuter, ta av värmen direkt" medan högrev får puttra
- Anpassa vad som finns på varje hjul (lägg till / ta bort / återställ)
- Spara måltider som favoriter, med det genererade receptet
- Historik över de senaste måltiderna, så du slipper upprepningar
- Ljud, konfetti och vibration – allt går att stänga av med 🔊-knappen
- Respekterar `prefers-reduced-motion`
- Allt sparas lokalt i webbläsaren (`localStorage`) – inget konto behövs

## Köra lokalt
```
npm install
npm run dev
```
Bygg för produktion med `npm run build` (output i `dist/`), förhandsgranska med `npm run preview`.

## Teknik
React + Vite, utan fler beroenden än så. Alla ljud är syntetiserade med WebAudio (inga ljudfiler), och konfetti är egen canvas-kod. All persistens sker lokalt i webbläsaren – ingen backend.
