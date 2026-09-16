# Spin for Dinner 🎡🍽️

En liten webbapp där du snurrar fram kvällens middag istället för att bestämma själv. Snurra hjul för protein, kolhydrat, grönsaker, sås och en "wild card"-ingrediens, välj mellan fyra teman (Klassiskt, Vegetariskt, Asiatiskt, Fisk & skaldjur), och få tre olika receptförslag baserat på resultatet.

## Funktioner
- Snurrbara hjul per station med animation
- Fyra maträttsteman
- Anpassa vad som finns på varje hjul (lägg till/ta bort/återställ)
- "Mitt skafferi" – kryssa i vad du alltid har hemma, det vägs in i recepten
- Spara måltider som favoriter, med det genererade receptet
- Historik över de senaste måltiderna, så du slipper upprepningar
- Allt sparas lokalt i webbläsaren (`localStorage`) – inget konto behövs

## Köra lokalt
```
npm install
npm run dev
```
Bygg för produktion med `npm run build` (output i `dist/`), förhandsgranska med `npm run preview`.

## Status
Byggd med React + Vite. All persistens sker fortfarande lokalt i webbläsaren (`localStorage`) – inget konto eller backend behövs.
