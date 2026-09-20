// Beskriver hur olika proteiner och kolhydrater faktiskt bör tillagas,
// så att recepttexterna stämmer med den valda råvaran istället för att
// alltid säga samma sak (t.ex. "genomstekt" om räkor eller musslor).

export const PROTEIN_PROFILES = {
  'Kyckling':      { verb:'Bryn', time:'6-8 minuter', state:'köttet är vitt igenom och saftigt' },
  'Fläskfilé':     { verb:'Bryn', time:'5-7 minuter', state:'det fått fin stekyta och är genomstekt' },
  'Nötfärs':       { verb:'Bryn', time:'5-6 minuter', state:'färsen är helt genomstekt och smulig' },
  'Bacon':         { verb:'Stek', time:'3-4 minuter', state:'det är knaprigt' },
  'Lax':           { verb:'Stek', time:'3-4 minuter per sida', state:'ytan fått färg men mitten fortfarande är saftig' },
  'Torsk':         { verb:'Stek', time:'2-3 minuter per sida', state:'fisken precis går isär i flingor' },
  'Tonfisk':       { verb:'Stek', time:'1-2 minuter per sida', state:'utsidan fått färg men mitten är rosa' },
  'Räkor':         { verb:'Stek', time:'2-3 minuter', state:'de precis fått färg',
                      note:'Ta av värmen direkt så de inte blir gummiga.' },
  'Scampi':        { verb:'Stek', time:'2-3 minuter', state:'de precis fått färg' },
  'Musslor':       { verb:'Ånga', time:'4-5 minuter', state:'skalen öppnat sig',
                      note:'Släng de som förblir stängda.' },
  'Kammusslor':    { verb:'Stek', time:'1-2 minuter per sida', state:'de fått en gyllene yta men fortfarande är mjuka i mitten' },
  'Tofu':          { verb:'Stek', time:'6-8 minuter', state:'alla sidor är gyllenbruna och krispiga',
                      prep:'Pressa ur tofun ordentligt i hushållspapper innan du skär den, så blir stekytan krispigare.' },
  'Halloumi':      { verb:'Stek', time:'2-3 minuter per sida', state:'ytan är gyllenbrun' },
  'Kikärtor':      { verb:'Fräs', time:'4-5 minuter', state:'de är genomvarma och lätt krispiga i kanten' },
  'Svarta bönor':  { verb:'Fräs', time:'3-4 minuter', state:'de är genomvarma' },
  'Linser':        { verb:'Värm', time:'3-4 minuter', state:'de är genomvarma' },
  'Quorn':         { verb:'Stek', time:'5-6 minuter', state:'ytan fått färg' },
  'Ägg':           { verb:'Stek eller vispa', time:'3-4 minuter', state:'äggen precis stelnat' },
  'Cashewnötter':  { verb:'Rosta', time:'2-3 minuter', state:'nötterna doftar och fått lite färg' }
};

export const CARB_PROFILES = {
  'Ris':        { verb:'Koka', method:'enligt paketets anvisning' },
  'Jasminris':  { verb:'Koka', method:'enligt paketets anvisning' },
  'Pasta':      { verb:'Koka', method:'i väl saltat vatten enligt paketets anvisning' },
  'Potatis':    { verb:'Koka', method:'i saltat vatten tills den är mjuk' },
  'Couscous':   { verb:'Låt svälla', method:'i kokande vatten eller buljong under lock i ca 5 minuter' },
  'Bulgur':     { verb:'Koka', method:'enligt paketets anvisning' },
  'Quinoa':     { verb:'Koka', method:'enligt paketets anvisning tills kärnorna öppnat sig' },
  'Nudlar':     { verb:'Koka', method:'enligt paketets anvisning' },
  'Glasnudlar': { verb:'Blötlägg', method:'i varmt vatten enligt paketets anvisning tills de är mjuka' },
  'Tortilla':   { verb:'Värm', method:'snabbt i en torr panna eller i ugnen tills den är mjuk och böjlig' },
  'Focaccia':   { verb:'Värm', method:'i ugnen några minuter tills den är varm och krispig i ytterkanten' }
};

const DEFAULT_PROTEIN_PROFILE = { verb:'Tillaga', time:'5-8 minuter', state:'det är genomstekt' };
const DEFAULT_CARB_PROFILE = { verb:'Tillaga', method:'enligt paketets anvisning' };

export function proteinProfile(name){
  return PROTEIN_PROFILES[name] || DEFAULT_PROTEIN_PROFILE;
}

export function carbProfile(name){
  return CARB_PROFILES[name] || DEFAULT_CARB_PROFILE;
}
