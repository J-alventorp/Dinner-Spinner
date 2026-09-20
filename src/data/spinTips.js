// Småprat som visas under hjulet medan det snurrar. Ren utfyllnad — men
// det är utfyllnaden som gör väntan rolig istället för död.

export const SPIN_TIPS = [
  'Hjulet tänker…',
  'Konsulterar kylskåpet…',
  'Frågar mormor…',
  'Räknar kalorier. Ger upp.',
  'Letar efter vitlöken…',
  'Värmer upp pannan…',
  'Slumpen lagar bäst mat.',
  'Nästan där…',
  'Hjulet gillar dig idag.',
  'Ingen vet vad som kommer.',
  'Snurrar bort alla ursäkter…',
  'Det blir nog bra.',
  'Kockens magkänsla laddar…',
  'Sätter ugnen på 200°C i tanken…',
  'Skär lök. Gråter lite.',
  'Öppnar kryddskåpet…',
  'Kollar vad som är i frysen…',
  'Hjulet har en idé…',
  'Beräknar smaknivå…',
  'Ringer en kompis…',
  'Ett ögonblick, det här blir bra.',
  'Smakar av. Nickar.',
  'Letar efter den där burken längst bak…',
  'Hjulet vägrar tråkig mat.',
  'Justerar saltet…',
  'Diskar i förväg. Skämt.',
  'Hittar på något oväntat…',
  'Middagen närmar sig…',
  'Kastar tärning. Två gånger.',
  'Ikväll blir det något gott.'
];

export function randomTip(previous){
  const pool = SPIN_TIPS.filter(t => t !== previous);
  return pool[Math.floor(Math.random() * pool.length)];
}
