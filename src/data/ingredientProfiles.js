// Beskriver hur olika proteiner och kolhydrater faktiskt bör tillagas,
// så att recepttexterna stämmer med den valda råvaran istället för att
// alltid säga samma sak (t.ex. "genomstekt" om räkor eller musslor).
//
// Saknas en råvara här faller den tyst tillbaka på DEFAULT-profilen och
// receptet blir vagare. Lägger du till något i themes.js — lägg till det här.

export const PROTEIN_PROFILES = {
  'Kyckling':          { verb:'Bryn', time:'6-8 minuter', state:'köttet är vitt igenom och saftigt' },
  'Kycklingfilé':      { verb:'Bryn', time:'6-8 minuter', state:'köttet är vitt igenom och saftigt' },
  'Kycklinglår':       { verb:'Stek', time:'8-10 minuter', state:'skinnet är knaprigt och köttet genomstekt' },
  'Kycklingstrimlor':  { verb:'Stek', time:'4-5 minuter', state:'strimlorna är vita igenom' },
  'Färdig kyckling':   { verb:'Värm', time:'2-3 minuter', state:'den är genomvarm' },
  'Kalkon':            { verb:'Stek', time:'6-8 minuter', state:'köttet är vitt igenom',
                          note:'Kalkon torkar lätt — ta av pannan så fort den är klar.' },
  'Anka':              { verb:'Stek', time:'6-8 minuter på skinnsidan', state:'skinnet är knaprigt och köttet rosa i mitten',
                          prep:'Rita ett rutmönster i skinnet och börja i kall panna, så smälter fettet ut ordentligt.' },
  'Fläskfilé':         { verb:'Bryn', time:'5-7 minuter', state:'det fått fin stekyta och är genomstekt' },
  'Fläskkarré':        { verb:'Stek', time:'6-8 minuter', state:'köttet fått färg och är genomstekt' },
  'Fläskkotlett':      { verb:'Stek', time:'4-5 minuter per sida', state:'den fått gyllene yta och är genomstekt' },
  'Nötfärs':           { verb:'Bryn', time:'5-6 minuter', state:'färsen är helt genomstekt och smulig' },
  'Nötstrimlor':       { verb:'Stek', time:'2-3 minuter', state:'de fått hastig färg men är rosa inuti',
                          note:'Stek i omgångar så pannan inte tappar värmen.' },
  'Högrev':            { verb:'Bryn', time:'8-10 minuter', state:'alla sidor fått rejäl färg',
                          note:'Högrev vill ha lång tid — låt det puttra vidare minst en timme om du har tiden.' },
  'Kalops':            { verb:'Bryn', time:'8-10 minuter', state:'köttbitarna fått färg runt om',
                          note:'Låt sedan puttra på svag värme tills köttet faller isär.' },
  'Pannbiff':          { verb:'Stek', time:'3-4 minuter per sida', state:'de fått mörk stekyta och är genomstekta' },
  'Köttbullar':        { verb:'Stek', time:'8-10 minuter', state:'de är runda om och genomstekta',
                          note:'Skaka pannan då och då så de blir jämnt bruna.' },
  'Korv':              { verb:'Stek', time:'5-6 minuter', state:'ytan är gyllene och lite krispig' },
  'Falukorv':          { verb:'Stek', time:'4-5 minuter', state:'skivorna fått gyllene kanter' },
  'Bacon':             { verb:'Stek', time:'3-4 minuter', state:'det är knaprigt' },
  'Lax':               { verb:'Stek', time:'3-4 minuter per sida', state:'ytan fått färg men mitten fortfarande är saftig' },
  'Rökt lax':          { verb:'Lägg i', time:'sista minuten', state:'den precis blivit ljummen',
                          note:'Rökt lax ska inte tillagas — den läggs i på slutet.' },
  'Torsk':             { verb:'Stek', time:'2-3 minuter per sida', state:'fisken precis går isär i flingor' },
  'Sej':               { verb:'Stek', time:'3-4 minuter per sida', state:'fisken går isär i flingor' },
  'Hälleflundra':      { verb:'Stek', time:'3-4 minuter per sida', state:'köttet är vitt och fast men fortfarande saftigt' },
  'Tonfisk':           { verb:'Stek', time:'1-2 minuter per sida', state:'utsidan fått färg men mitten är rosa' },
  'Tonfisk (burk)':    { verb:'Rör ner', time:'sista minuten', state:'den är genomvarm',
                          note:'Låt rinna av ordentligt först.' },
  'Räkor':             { verb:'Stek', time:'2-3 minuter', state:'de precis fått färg',
                          note:'Ta av värmen direkt så de inte blir gummiga.' },
  'Scampi':            { verb:'Stek', time:'2-3 minuter', state:'de precis fått färg' },
  'Kräftstjärtar':     { verb:'Värm', time:'1-2 minuter', state:'de är genomvarma',
                          note:'De är redan kokta — värm bara försiktigt.' },
  'Musslor':           { verb:'Ånga', time:'4-5 minuter', state:'skalen öppnat sig',
                          note:'Släng de som förblir stängda.' },
  'Kammusslor':        { verb:'Stek', time:'1-2 minuter per sida', state:'de fått en gyllene yta men fortfarande är mjuka i mitten' },
  'Bläckfisk':         { verb:'Stek', time:'1-2 minuter', state:'den precis blivit ogenomskinlig',
                          note:'Antingen supersnabbt eller väldigt länge — allt däremellan blir segt.' },
  'Tofu':              { verb:'Stek', time:'6-8 minuter', state:'alla sidor är gyllenbruna och krispiga',
                          prep:'Pressa ur tofun ordentligt i hushållspapper innan du skär den, så blir stekytan krispigare.' },
  'Tempeh':            { verb:'Stek', time:'5-6 minuter', state:'skivorna är gyllene och nötiga i doften' },
  'Seitan':            { verb:'Stek', time:'4-5 minuter', state:'bitarna fått mörk yta runt om' },
  'Halloumi':          { verb:'Stek', time:'2-3 minuter per sida', state:'ytan är gyllenbrun' },
  'Falafel':           { verb:'Stek', time:'4-5 minuter', state:'de är knapriga runt om och varma inuti' },
  'Kikärtor':          { verb:'Fräs', time:'4-5 minuter', state:'de är genomvarma och lätt krispiga i kanten' },
  'Svarta bönor':      { verb:'Fräs', time:'3-4 minuter', state:'de är genomvarma' },
  'Vita bönor':        { verb:'Värm', time:'3-4 minuter', state:'de är genomvarma och krämiga' },
  'Linser':            { verb:'Värm', time:'3-4 minuter', state:'de är genomvarma' },
  'Quorn':             { verb:'Stek', time:'5-6 minuter', state:'ytan fått färg' },
  'Ägg':               { verb:'Stek eller vispa', time:'3-4 minuter', state:'äggen precis stelnat' },
  'Cashewnötter':      { verb:'Rosta', time:'2-3 minuter', state:'nötterna doftar och fått lite färg' }
};

export const CARB_PROFILES = {
  'Ris':             { verb:'Koka', method:'enligt paketets anvisning' },
  'Jasminris':       { verb:'Koka', method:'enligt paketets anvisning' },
  'Risottoris':      { verb:'Koka', method:'långsamt med buljong, en slev i taget, tills kärnorna är krämiga med lite tuggmotstånd' },
  'Färdigkokt ris':  { verb:'Värm', method:'i pannan eller mikron tills det ryker lätt' },
  'Pasta':           { verb:'Koka', method:'i väl saltat vatten enligt paketets anvisning' },
  'Makaroner':       { verb:'Koka', method:'i saltat vatten enligt paketets anvisning' },
  'Gnocchi':         { verb:'Koka', method:'tills de flyter upp, och stek dem gärna gyllene i smör efteråt' },
  'Potatis':         { verb:'Koka', method:'i saltat vatten tills den är mjuk' },
  'Potatismos':      { verb:'Koka och mosa', method:'potatisen mjuk och rör ner smör och mjölk tills moset är len' },
  'Klyftpotatis':    { verb:'Rosta', method:'i ugnen på 225°C i ca 25 minuter tills klyftorna är gyllene' },
  'Rotmos':          { verb:'Koka och mosa', method:'rotfrukterna mjuka och smaka av med smör, salt och vitpeppar' },
  'Sötpotatis':      { verb:'Rosta', method:'i ugnen på 220°C i ca 25 minuter tills bitarna är mjuka och lite karamelliserade' },
  'Couscous':        { verb:'Låt svälla', method:'i kokande vatten eller buljong under lock i ca 5 minuter' },
  'Bulgur':          { verb:'Koka', method:'enligt paketets anvisning' },
  'Matvete':         { verb:'Koka', method:'enligt paketets anvisning tills kärnorna är sega och saftiga' },
  'Quinoa':          { verb:'Koka', method:'enligt paketets anvisning tills kärnorna öppnat sig' },
  'Polenta':         { verb:'Rör ihop', method:'med kokande buljong och vispa tills den tjocknat, smaka av med smör och parmesan' },
  'Nudlar':          { verb:'Koka', method:'enligt paketets anvisning' },
  'Äggnudlar':       { verb:'Koka', method:'enligt paketets anvisning, ca 4 minuter' },
  'Risnudlar':       { verb:'Blötlägg', method:'i varmt vatten tills de är mjuka men fortfarande har tuggmotstånd' },
  'Udon':            { verb:'Koka', method:'snabbt enligt paketets anvisning och skölj i kallt vatten' },
  'Glasnudlar':      { verb:'Blötlägg', method:'i varmt vatten enligt paketets anvisning tills de är mjuka' },
  'Tortilla':        { verb:'Värm', method:'snabbt i en torr panna eller i ugnen tills den är mjuk och böjlig' },
  'Bao-bröd':        { verb:'Ånga', method:'i ca 8 minuter tills de är mjuka och fluffiga' },
  'Focaccia':        { verb:'Värm', method:'i ugnen några minuter tills den är varm och krispig i ytterkanten' },
  'Bröd till':       { verb:'Rosta', method:'några skivor gyllene och gnid dem gärna med en klyfta vitlök' }
};

const DEFAULT_PROTEIN_PROFILE = { verb:'Tillaga', time:'5-8 minuter', state:'det är genomstekt' };
const DEFAULT_CARB_PROFILE = { verb:'Tillaga', method:'enligt paketets anvisning' };

export function proteinProfile(name){
  return PROTEIN_PROFILES[name] || DEFAULT_PROTEIN_PROFILE;
}

export function carbProfile(name){
  return CARB_PROFILES[name] || DEFAULT_CARB_PROFILE;
}
