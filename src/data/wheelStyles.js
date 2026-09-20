import { SECRET_WHEEL_STYLE } from './secret.js';

// Varje station har sin egen färgkodning (rött = protein, grönt = grönsaker
// osv.) så att man känner igen hjulet innan man läst rubriken. Paletterna är
// medvetet mättade — dova toner gör hjulet trist i rörelse.
export const WHEEL_STYLES = {
  cuisine: { palette:['#8a5a2b','#b07a3c','#d2a05a','#e8c27d','#9c6f3e','#7a4a22'], patternId:'pat-globe' },
  protein: { palette:['#d43b3b','#f05a4f','#b52a2a','#ff8558','#9c2323','#e07338'], patternId:'pat-meat' },
  carb:    { palette:['#f0ab2e','#ffc94d','#d98f16','#ffe08a','#c47a0e','#ffb733'], patternId:'pat-grain' },
  veggie:  { palette:['#4fae38','#78ce55','#3a8c26','#a3e878','#2c6e1c','#63bd44'], patternId:'pat-leaf' },
  sauce:   { palette:['#e26a26','#ff9340','#c74f16','#ffb36b','#ab3d0d','#f28242'], patternId:'pat-drip' },
  topping: { palette:['#ef8ab8','#ffb0d0','#dd6aa2','#ffd0e4','#c74e8c','#f79cc6'], patternId:'pat-sparkle' },
  wild:    { palette:['#8e46bd','#b85ce8','#6a2e94','#d97ffb','#4f1f75','#a84fd4'], patternId:'pat-zigzag' },
  mystery: SECRET_WHEEL_STYLE
};

const DEFAULT_STYLE = {
  palette:['var(--wheel-1)','var(--wheel-2)','var(--wheel-3)','var(--wheel-4)','var(--wheel-5)','var(--wheel-6)'],
  patternId:'pat-globe'
};

// I gyllene läget byter alla hjul till regnbågspaletten — det är den
// tydligaste signalen om att något är annorlunda.
export function wheelStyle(stationKey, secretOn){
  if(secretOn) return SECRET_WHEEL_STYLE;
  return WHEEL_STYLES[stationKey] || DEFAULT_STYLE;
}

// Bonusrutan ritas alltid i guld oavsett station, så den går att känna igen
// direkt medan hjulet snurrar.
export const BONUS_SLICE_FILL = '#FFC933';
export const BONUS_SLICE_STROKE = '#FFF3B0';
