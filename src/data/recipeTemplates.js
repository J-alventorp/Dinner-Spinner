import { dc, cap } from '../utils/text.js';

const FALLBACK_CUISINE = { label:'Fritt', flavorTags:['salt','peppar'], seasoningLine:'Smaka av med salt, peppar och lite syra om det behövs.' };

function withCuisine(ctx){
  return ctx.cuisine || FALLBACK_CUISINE;
}

export const RECIPE_TEMPLATES = [
  {
    id:'wok',
    titleFragment:(protein, carb) => 'Wokad ' + dc(protein) + ' med ' + dc(carb),
    meta:'~25 min · 2 portioner · panna/wok',
    buildSteps(ctx){
      const cu = withCuisine(ctx);
      return [
        'Hetta upp olja i en stekpanna eller wok på hög värme.',
        'Bryn '+dc(ctx.protein)+' 4-6 minuter tills det fått fin färg. Lägg åt sidan.',
        'Tillaga '+dc(ctx.carb)+' separat enligt paketets anvisning (eller i samma panna om det passar).',
        'Fräs '+ctx.veggieLower+' i samma panna 3-4 minuter tills grönsakerna mjuknat men fortfarande har tuggmotstånd.',
        'Lägg tillbaka '+dc(ctx.protein)+', rör ner '+dc(ctx.sauce)+' och krydda med '+cu.flavorTags.join(', ')+'.',
        'Toppa med '+dc(ctx.topping)+' och avsluta med '+dc(ctx.wild)+' precis innan servering.',
        cu.seasoningLine
      ];
    }
  },
  {
    id:'ugn',
    titleFragment:(protein, carb) => 'Ugnsbakad ' + dc(protein) + ' med ' + dc(carb),
    meta:'~35 min · 2 portioner · ugn, en plåt',
    buildSteps(ctx){
      const cu = withCuisine(ctx);
      return [
        'Sätt ugnen på 200°C.',
        'Lägg '+dc(ctx.protein)+' och '+ctx.veggieLower+' på en plåt, ringla över olja och rör runt.',
        'Baka i mitten av ugnen 20-25 minuter tills protein är genomstekt och grönsakerna fått lite färg.',
        'Under tiden, tillaga '+dc(ctx.carb)+' enligt paketets anvisning.',
        'Blanda '+dc(ctx.sauce)+' med stekskyn från plåten och häll över när allt är klart.',
        'Strö över '+dc(ctx.topping)+' och toppa med '+dc(ctx.wild)+' direkt innan servering.',
        cu.seasoningLine
      ];
    }
  },
  {
    id:'bowl',
    titleFragment:(protein, carb) => cap(dc(carb)) + '-bowl med ' + dc(protein),
    meta:'~20 min · 2 portioner · skål',
    buildSteps(ctx){
      const cu = withCuisine(ctx);
      return [
        'Koka eller värm '+dc(ctx.carb)+' och lägg som bas i en skål.',
        'Stek eller ugnsbaka '+dc(ctx.protein)+' 8-10 minuter tills genomstekt och skär i bitar.',
        'Skär eller riv '+ctx.veggieLower+', rått eller lätt sauterat, och lägg ovanpå basen.',
        'Ringla över '+dc(ctx.sauce)+' generöst över hela skålen.',
        'Avsluta med '+dc(ctx.topping)+' som crunch och '+dc(ctx.wild)+' som smakskott.',
        cu.seasoningLine
      ];
    }
  },
  {
    id:'gryta',
    titleFragment:(protein, carb) => 'Gryta på ' + dc(protein) + ' med ' + dc(carb),
    meta:'~40 min · 2 portioner · gryta',
    buildSteps(ctx){
      const cu = withCuisine(ctx);
      return [
        'Bryn '+dc(ctx.protein)+' i en gryta på medelvärme tills ytan fått färg.',
        'Tillsätt '+ctx.veggieLower+' och fräs med i 2-3 minuter.',
        'Häll i '+dc(ctx.sauce)+' tillsammans med lite vatten eller buljong så det precis täcker, låt sjuda 15-20 minuter under lock.',
        'Koka '+dc(ctx.carb)+' separat och servera vid sidan av eller rör ner det i grytan sista minuterna.',
        'Krydda med '+cu.flavorTags.join(', ')+' och toppa med '+dc(ctx.topping)+' samt en skvätt '+dc(ctx.wild)+'.',
        cu.seasoningLine
      ];
    }
  },
  {
    id:'sallad',
    titleFragment:(protein, carb) => 'Stor sallad med ' + dc(protein) + ' och ' + dc(carb),
    meta:'~15 min · 2 portioner · kall/ljummen',
    buildSteps(ctx){
      const cu = withCuisine(ctx);
      return [
        'Koka eller stek '+dc(ctx.protein)+' snabbt och låt svalna något, skär i bitar.',
        'Koka '+dc(ctx.carb)+' enligt anvisning, skölj kallt om du vill ha en kall sallad.',
        'Blanda '+ctx.veggieLower+' rått i en stor skål tillsammans med kolhydraten.',
        'Vänd ner '+dc(ctx.protein)+' och ringla över '+dc(ctx.sauce)+' som dressing.',
        'Strö över '+dc(ctx.topping)+' och en nypa '+dc(ctx.wild)+' för extra krydda.',
        cu.seasoningLine
      ];
    }
  },
  {
    id:'wrap',
    titleFragment:(protein, carb) => dc(protein).charAt(0).toUpperCase()+dc(protein).slice(1)+'-wrap med ' + dc(carb),
    meta:'~20 min · 2 portioner · wrap/taco',
    buildSteps(ctx){
      const cu = withCuisine(ctx);
      return [
        'Stek '+dc(ctx.protein)+' i en het panna tills genomstekt, dela ner i mindre bitar.',
        'Värm '+dc(ctx.carb)+' (t.ex. tortilla/bröd) enligt anvisning, eller koka som tillbehör.',
        'Strimla '+ctx.veggieLower+' fint så det blir lätt att rulla in.',
        'Bred '+dc(ctx.sauce)+' på botten, lägg på protein och grönsaker.',
        'Toppa med '+dc(ctx.topping)+' och en klick '+dc(ctx.wild)+', rulla ihop och servera.',
        cu.seasoningLine
      ];
    }
  },
  {
    id:'gratang',
    titleFragment:(protein, carb) => 'Gratäng på ' + dc(protein) + ' och ' + dc(carb),
    meta:'~45 min · 2 portioner · ugnsform',
    buildSteps(ctx){
      const cu = withCuisine(ctx);
      return [
        'Sätt ugnen på 200°C och smörj en ugnsform.',
        'Varva '+dc(ctx.protein)+', '+dc(ctx.carb)+' och '+ctx.veggieLower+' i formen.',
        'Häll '+dc(ctx.sauce)+' jämnt över allt så det nästan täcks.',
        'Strö '+dc(ctx.topping)+' över som gratängskorpa.',
        'Baka 25-30 minuter tills ytan fått fin färg, toppa sist med '+dc(ctx.wild)+'.',
        cu.seasoningLine
      ];
    }
  },
  {
    id:'spett',
    titleFragment:(protein, carb) => 'Spett med ' + dc(protein) + ' och ' + dc(carb) + ' som tillbehör',
    meta:'~30 min · 2 portioner · grill/ugn',
    buildSteps(ctx){
      const cu = withCuisine(ctx);
      return [
        'Skär '+dc(ctx.protein)+' i bitar och trä upp på spett tillsammans med '+ctx.veggieLower+'.',
        'Pensla spetten med '+dc(ctx.sauce)+' och krydda med '+cu.flavorTags.join(', ')+'.',
        'Grilla eller ugnsbaka (225°C) spetten 12-15 minuter, vänd halvvägs.',
        'Koka '+dc(ctx.carb)+' som tillbehör under tiden.',
        'Servera spetten på kolhydraten, toppa med '+dc(ctx.topping)+' och '+dc(ctx.wild)+'.',
        cu.seasoningLine
      ];
    }
  },
  {
    id:'panna',
    titleFragment:(protein, carb) => 'Snabb pannrätt med ' + dc(protein) + ' och ' + dc(carb),
    meta:'~18 min · 2 portioner · en panna',
    buildSteps(ctx){
      const cu = withCuisine(ctx);
      return [
        'Stek '+dc(ctx.protein)+' i smör eller olja på medelhög värme tills genomstekt.',
        'Tillsätt '+ctx.veggieLower+' i samma panna och stek ytterligare 3-4 minuter.',
        'Rör ner '+dc(ctx.carb)+' (redan kokt/tillagad) direkt i pannan så allt blandas.',
        'Häll i '+dc(ctx.sauce)+' och låt allt värmas ihop någon minut.',
        'Avsluta med '+dc(ctx.topping)+' och en skvätt '+dc(ctx.wild)+' på toppen.',
        cu.seasoningLine
      ];
    }
  }
];
