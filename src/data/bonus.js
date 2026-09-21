// Bonusrutan: en gyllene ruta som ibland smyger in i hjulet.
//
// Rutan är bara en vanlig sträng i poolen — hjulet ritar den guldigt genom
// att jämföra mot BONUS_TOKEN, och useWheelSpin väljer den precis som vilken
// annan ruta som helst. Det gör att inget i snurrmotorn behöver veta något
// om bonusar.

export const BONUS_TOKEN = '🎁 BONUS';

// Sannolikhet att en station får en bonusruta. Beslutet tas EN gång per
// stationsbesök (App håller det i state) — annars skulle hjulet byta
// utseende mellan renderingar.
export const BONUS_CHANCE = 0.28;

// Givet att bonusrutan redan träffats: chans att den blir en jackpot
// istället för en vanlig bonus — fler extras, större fest.
export const JACKPOT_CHANCE = 0.16;

// Givet att bonusrutan träffats (och det inte blev jackpot): chans att den
// ger en gratis extraspin på NÄSTA station istället för en extra-topping.
export const EXTRASPIN_CHANCE = 0.3;

// Stationer som aldrig får bonusruta. Kök-hjulet är för litet och styr
// hela receptets ton, så en bonusruta där känns mest som en miss.
export const BONUS_EXCLUDED_STATIONS = ['cuisine'];

export const BONUS_EXTRAS = [
  'Dubbel sås',
  'Extra ost på allt',
  'Krispig topping ×2',
  'En skvätt honung',
  'Rostade nötter',
  'Picklad rödlök',
  'Brynt smör på slutet',
  'Färsk chili',
  'Citronzest',
  'Tryffelolja (bara lite)',
  'Krispig vitlök',
  'En klick créme fraiche',
  'Rostade sesamfrön',
  'Färska örter i mängd',
  'Flingsalt',
  'Ett stekt ägg ovanpå',
  'Sirap & soja-glaze',
  'Rostat bröd till',
  'Extra vitlök'
];

export function randomBonusExtra(exclude){
  const taken = exclude || [];
  const pool = BONUS_EXTRAS.filter(x => taken.indexOf(x) === -1);
  const from = pool.length ? pool : BONUS_EXTRAS;
  return from[Math.floor(Math.random() * from.length)];
}

// Lägger in bonusrutan på en slumpad plats i poolen. Returnerar en ny array
// så anroparen kan memoisera på den.
export function injectBonus(pool){
  const next = pool.slice();
  next.splice(Math.floor(Math.random() * (next.length + 1)), 0, BONUS_TOKEN);
  return next;
}

export function shouldRollBonus(stationKey){
  if(BONUS_EXCLUDED_STATIONS.indexOf(stationKey) !== -1) return false;
  return Math.random() < BONUS_CHANCE;
}

// Avgör vad en träffad bonusruta faktiskt blir: 'jackpot' (flera extras och
// stor fest), 'extraspin' (gratis snurr på nästa station) eller 'extra' (den
// vanliga, en extra-topping).
export function rollBonusKind(){
  if(Math.random() < JACKPOT_CHANCE) return 'jackpot';
  if(Math.random() < EXTRASPIN_CHANCE) return 'extraspin';
  return 'extra';
}
