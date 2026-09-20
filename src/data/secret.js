// Gyllene läget — appens hemliga läge.
//
// Det går inte att slå på från början. Man förtjänar det genom att spela:
// antingen många snurr totalt, eller genom att jaga bonusrutor.

export const SECRET_UNLOCK_SPINS = 40;
export const SECRET_UNLOCK_BONUSES = 5;

// Ledtråden visas först när man passerat halvvägs — innan dess ska inget
// avslöja att det finns något att låsa upp.
export const SECRET_TEASE_AT = 0.5;

export function secretProgress(stats){
  const bySpins = (stats.totalSpins || 0) / SECRET_UNLOCK_SPINS;
  const byBonus = (stats.bonusHits || 0) / SECRET_UNLOCK_BONUSES;
  return Math.min(1, Math.max(bySpins, byBonus));
}

export function meetsSecretUnlock(stats){
  return (stats.totalSpins || 0) >= SECRET_UNLOCK_SPINS
      || (stats.bonusHits || 0) >= SECRET_UNLOCK_BONUSES;
}

export const SECRET_STATION = { key:'mystery', label:'Mystisk ingrediens', icon:'🔮', picks:1 };

export const SECRET_WHEEL_STYLE = {
  palette:['#ff2d95','#ff9f1c','#ffe14d','#3ddc84','#00c2ff','#9b5cff'],
  patternId:'pat-sparkle'
};

// Absurditeter som blandas in i de vanliga hjulen när läget är på.
export const SECRET_ITEMS = {
  protein:['Enhörningsfilé','Drakkorv','Mystiskt kött'],
  carb:['Regnbågsris','Moln-mos','Pasta från framtiden'],
  veggie:['Osynlig broccoli','Glitterärtor','Grönsak X'],
  sauce:['Enhörningssås','Lavasås','Sås utan namn'],
  topping:['Stjärnstoft','Popcornregn','Ätbart glitter'],
  wild:['Allt på en gång','Kockens hämnd','Ingen vet']
};

export const MYSTERY_ITEMS = [
  '🔮 Något blått',
  '🔮 Smakar som söndag',
  '🔮 Mormors hemlighet',
  '🔮 Fråga inte',
  '🔮 Det du glömde',
  '🔮 En prick chili',
  '🔮 Rök & eld',
  '🔮 Helt magiskt',
  '🔮 Kockens val',
  '🔮 Stjärnfall'
];

export const SECRET_TIPS = [
  'Gyllene läget är på. Allt kan hända. 🌈',
  'Hjulet har fått för mycket socker.',
  'Fysikens lagar är avstängda ikväll.'
];
