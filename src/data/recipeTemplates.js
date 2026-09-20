import { dc, cap } from '../utils/text.js';
import { proteinProfile, carbProfile } from './ingredientProfiles.js';

const FALLBACK_CUISINE = { label:'Fritt', flavorTags:['salt','peppar'], seasoningLine:'Smaka av med salt, peppar och lite syra om det behövs.' };

function withCuisine(ctx){
  return ctx.cuisine || FALLBACK_CUISINE;
}

function prepStep(pp){
  return pp.prep ? [pp.prep] : [];
}

function withNote(pp){
  return pp.note ? ' '+pp.note : '';
}

export const RECIPE_TEMPLATES = [
  {
    id:'wok',
    titleFragment:(protein, carb) => 'Wokad ' + dc(protein) + ' med ' + dc(carb),
    meta:'~25 min · 2 portioner · panna/wok',
    buildSteps(ctx){
      const cu = withCuisine(ctx);
      const pp = proteinProfile(ctx.protein);
      const cp = carbProfile(ctx.carb);
      return [
        ...prepStep(pp),
        'Hetta upp olja i en stekpanna eller wok på hög värme.',
        pp.verb+' '+dc(ctx.protein)+' '+pp.time+' tills '+pp.state+'.'+withNote(pp)+' Lägg åt sidan.',
        cp.verb+' '+dc(ctx.carb)+' '+cp.method+' (eller i samma panna om det passar).',
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
      const pp = proteinProfile(ctx.protein);
      const cp = carbProfile(ctx.carb);
      return [
        ...prepStep(pp),
        'Sätt ugnen på 200°C.',
        'Lägg '+dc(ctx.protein)+' och '+ctx.veggieLower+' på en plåt, ringla över olja och rör runt.',
        'Baka i mitten av ugnen 20-25 minuter tills '+pp.state+' och grönsakerna fått lite färg.',
        'Under tiden, '+cp.verb.toLowerCase()+' '+dc(ctx.carb)+' '+cp.method+'.',
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
      const pp = proteinProfile(ctx.protein);
      const cp = carbProfile(ctx.carb);
      return [
        ...prepStep(pp),
        cp.verb+' '+dc(ctx.carb)+' '+cp.method+' och lägg som bas i en skål.',
        pp.verb+' '+dc(ctx.protein)+' '+pp.time+' tills '+pp.state+' och skär i bitar.'+withNote(pp),
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
      const pp = proteinProfile(ctx.protein);
      const cp = carbProfile(ctx.carb);
      return [
        ...prepStep(pp),
        pp.verb+' '+dc(ctx.protein)+' i en gryta på medelvärme tills '+pp.state+'.'+withNote(pp),
        'Tillsätt '+ctx.veggieLower+' och fräs med i 2-3 minuter.',
        'Häll i '+dc(ctx.sauce)+' tillsammans med lite vatten eller buljong så det precis täcker, låt sjuda 15-20 minuter under lock.',
        cp.verb+' '+dc(ctx.carb)+' separat ('+cp.method+') och servera vid sidan av eller rör ner det i grytan sista minuterna.',
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
      const pp = proteinProfile(ctx.protein);
      const cp = carbProfile(ctx.carb);
      return [
        ...prepStep(pp),
        pp.verb+' '+dc(ctx.protein)+' '+pp.time+' tills '+pp.state+' och låt svalna något, skär i bitar.'+withNote(pp),
        cp.verb+' '+dc(ctx.carb)+' '+cp.method+', skölj kallt om du vill ha en kall sallad.',
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
      const pp = proteinProfile(ctx.protein);
      const cp = carbProfile(ctx.carb);
      return [
        ...prepStep(pp),
        pp.verb+' '+dc(ctx.protein)+' i en het panna tills '+pp.state+', dela ner i mindre bitar.'+withNote(pp),
        cp.verb+' '+dc(ctx.carb)+' '+cp.method+'.',
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
      const pp = proteinProfile(ctx.protein);
      return [
        ...prepStep(pp),
        'Sätt ugnen på 200°C och smörj en ugnsform.',
        'Varva '+dc(ctx.protein)+', '+dc(ctx.carb)+' och '+ctx.veggieLower+' i formen.',
        'Häll '+dc(ctx.sauce)+' jämnt över allt så det nästan täcks.',
        'Strö '+dc(ctx.topping)+' över som gratängskorpa.',
        'Baka 25-30 minuter tills '+pp.state+' och ytan fått fin färg, toppa sist med '+dc(ctx.wild)+'.',
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
      const pp = proteinProfile(ctx.protein);
      const cp = carbProfile(ctx.carb);
      return [
        ...prepStep(pp),
        'Skär '+dc(ctx.protein)+' i bitar och trä upp på spett tillsammans med '+ctx.veggieLower+'.',
        'Pensla spetten med '+dc(ctx.sauce)+' och krydda med '+cu.flavorTags.join(', ')+'.',
        'Grilla eller ugnsbaka (225°C) spetten 12-15 minuter, vänd halvvägs, tills '+pp.state+'.'+withNote(pp),
        cp.verb+' '+dc(ctx.carb)+' '+cp.method+' som tillbehör under tiden.',
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
      const pp = proteinProfile(ctx.protein);
      const cp = carbProfile(ctx.carb);
      return [
        ...prepStep(pp),
        pp.verb+' '+dc(ctx.protein)+' i smör eller olja på medelhög värme tills '+pp.state+'.'+withNote(pp),
        'Tillsätt '+ctx.veggieLower+' i samma panna och stek ytterligare 3-4 minuter.',
        'Rör ner '+dc(ctx.carb)+' (redan tillagad) direkt i pannan så allt blandas.',
        'Häll i '+dc(ctx.sauce)+' och låt allt värmas ihop någon minut.',
        'Avsluta med '+dc(ctx.topping)+' och en skvätt '+dc(ctx.wild)+' på toppen.',
        cu.seasoningLine
      ];
    }
  },
  {
    id:'soppa',
    titleFragment:(protein, carb) => 'Soppa på ' + dc(protein) + ' med ' + dc(carb),
    meta:'~30 min · 2 portioner · gryta/soppa',
    buildSteps(ctx){
      const cu = withCuisine(ctx);
      const pp = proteinProfile(ctx.protein);
      const cp = carbProfile(ctx.carb);
      return [
        ...prepStep(pp),
        'Fräs '+ctx.veggieLower+' i en gryta med lite olja på medelvärme 3-4 minuter.',
        'Häll på vatten eller buljong så det täcker rejält, låt sjuda 10 minuter.',
        'Lägg i '+dc(ctx.protein)+' och låt sjuda '+pp.time+' tills '+pp.state+'.'+withNote(pp),
        'Rör ner '+dc(ctx.sauce)+' och smaka av med '+cu.flavorTags.join(', ')+'.',
        cp.verb+' '+dc(ctx.carb)+' '+cp.method+' och servera vid sidan av eller direkt i soppan.',
        'Toppa varje skål med '+dc(ctx.topping)+' och avsluta med '+dc(ctx.wild)+'.',
        cu.seasoningLine
      ];
    }
  },
  {
    id:'krispig',
    titleFragment:(protein, carb) => 'Krispig ' + dc(protein) + ' med ' + dc(carb),
    meta:'~30 min · 2 portioner · panerad/krispig',
    buildSteps(ctx){
      const cu = withCuisine(ctx);
      const pp = proteinProfile(ctx.protein);
      const cp = carbProfile(ctx.carb);
      return [
        ...prepStep(pp),
        'Panera '+dc(ctx.protein)+' i ströbröd eller fritera/stek i rikligt med olja tills '+pp.state+' och krispig utanpå.'+withNote(pp),
        cp.verb+' '+dc(ctx.carb)+' '+cp.method+' som tillbehör.',
        'Strimla eller riv '+ctx.veggieLower+' till en fräsch, rå sallad.',
        'Blanda '+dc(ctx.sauce)+' till en dipsås och krydda med '+cu.flavorTags.join(', ')+'.',
        'Servera det krispiga tillsammans med '+dc(ctx.carb)+', salladen och dippen. Toppa med '+dc(ctx.topping)+' och '+dc(ctx.wild)+'.',
        cu.seasoningLine
      ];
    }
  },
  {
    id:'curry',
    titleFragment:(protein, carb) => 'Curry på ' + dc(protein) + ' med ' + dc(carb),
    meta:'~30 min · 2 portioner · gryta',
    buildSteps(ctx){
      const cu = withCuisine(ctx);
      const pp = proteinProfile(ctx.protein);
      const cp = carbProfile(ctx.carb);
      return [
        ...prepStep(pp),
        'Fräs lök och vitlök mjuka i en rymlig panna, tillsätt '+cu.flavorTags.join(', ')+' och rör om tills det doftar.',
        pp.verb+' '+dc(ctx.protein)+' '+pp.time+' tills '+pp.state+'.'+withNote(pp),
        'Tillsätt '+ctx.veggieLower+' och låt fräsa med någon minut.',
        'Häll i '+dc(ctx.sauce)+' tillsammans med en skvätt grädde eller kokosmjölk och låt sjuda 10-12 minuter tills såsen tjocknat.',
        cp.verb+' '+dc(ctx.carb)+' '+cp.method+' och servera currygrytan över.',
        'Toppa med '+dc(ctx.topping)+' och '+dc(ctx.wild)+'.',
        cu.seasoningLine
      ];
    }
  },
  {
    id:'taco',
    titleFragment:(protein, carb) => 'Tacobord med ' + dc(protein) + ' och ' + dc(carb),
    meta:'~25 min · 2 portioner · allt på bordet',
    buildSteps(ctx){
      const cu = withCuisine(ctx);
      const pp = proteinProfile(ctx.protein);
      const cp = carbProfile(ctx.carb);
      return [
        ...prepStep(pp),
        pp.verb+' '+dc(ctx.protein)+' '+pp.time+' tills '+pp.state+' och krydda rejält med '+cu.flavorTags.join(', ')+'.'+withNote(pp),
        cp.verb+' '+dc(ctx.carb)+' '+cp.method+' — det blir basen alla bygger på.',
        'Hacka '+ctx.veggieLower+' i småbitar och lägg upp i separata skålar.',
        'Rör ihop '+dc(ctx.sauce)+' i en egen skål och ställ fram den mitt på bordet.',
        'Ställ fram '+dc(ctx.topping)+' och '+dc(ctx.wild)+' bredvid och låt alla bygga sin egen.',
        cu.seasoningLine
      ];
    }
  },
  {
    id:'risotto',
    titleFragment:(protein, carb) => 'Krämig ' + dc(carb) + '-risotto med ' + dc(protein),
    meta:'~35 min · 2 portioner · en kastrull, mycket omrörning',
    buildSteps(ctx){
      const cu = withCuisine(ctx);
      const pp = proteinProfile(ctx.protein);
      return [
        ...prepStep(pp),
        'Fräs finhackad lök blank i smör, tillsätt '+dc(ctx.carb)+' och rör tills allt är glansigt.',
        'Tillsätt varm buljong en slev i taget och rör hela tiden, ca 18 minuter, tills det är krämigt men har lite tuggmotstånd.',
        'Under tiden: '+dc(pp.verb)+' '+dc(ctx.protein)+' '+pp.time+' i en egen panna tills '+pp.state+'.'+withNote(pp),
        'Fräs '+ctx.veggieLower+' hastigt och vänd ner i risotton på slutet.',
        'Rör ner '+dc(ctx.sauce)+' och en klick smör, ta av värmen och låt vila två minuter under lock.',
        'Lägg upp med '+dc(ctx.protein)+' ovanpå, strö över '+dc(ctx.topping)+' och avsluta med '+dc(ctx.wild)+'.',
        cu.seasoningLine
      ];
    }
  },
  {
    id:'ramen',
    titleFragment:(protein, carb) => 'Nudelskål med ' + dc(protein) + ' och ' + dc(carb),
    meta:'~25 min · 2 portioner · djup skål',
    buildSteps(ctx){
      const cu = withCuisine(ctx);
      const pp = proteinProfile(ctx.protein);
      const cp = carbProfile(ctx.carb);
      return [
        ...prepStep(pp),
        'Koka upp buljong med '+cu.flavorTags.join(', ')+' och låt den dra på svag värme 10 minuter.',
        'Rör ner '+dc(ctx.sauce)+' i buljongen och smaka av — den ska vara en aning för salt, basen tar upp mycket.',
        cp.verb+' '+dc(ctx.carb)+' '+cp.method+' och fördela i två djupa skålar.',
        pp.verb+' '+dc(ctx.protein)+' '+pp.time+' tills '+pp.state+' och skiva upp.'+withNote(pp),
        'Blanchera '+ctx.veggieLower+' hastigt i buljongen så de behåller färgen.',
        'Häll den heta buljongen över basen och lägg upp protein och grönsaker i prydliga högar.',
        'Toppa med '+dc(ctx.topping)+' och '+dc(ctx.wild)+' precis innan servering.',
        cu.seasoningLine
      ];
    }
  },
  {
    id:'burgare',
    titleFragment:(protein, carb) => 'Burgare på ' + dc(protein) + ' med ' + dc(carb) + ' vid sidan',
    meta:'~30 min · 2 portioner · panna/grill',
    buildSteps(ctx){
      const cu = withCuisine(ctx);
      const pp = proteinProfile(ctx.protein);
      const cp = carbProfile(ctx.carb);
      return [
        ...prepStep(pp),
        'Forma eller skiva '+dc(ctx.protein)+' till burgarstorlek och krydda med salt, peppar och '+cu.flavorTags.join(', ')+'.',
        pp.verb+' '+dc(ctx.protein)+' '+pp.time+' i het panna tills '+pp.state+'.'+withNote(pp),
        cp.verb+' '+dc(ctx.carb)+' '+cp.method+' som tillbehör.',
        'Strimla '+ctx.veggieLower+' tunt så det går att stapla i burgaren.',
        'Bred '+dc(ctx.sauce)+' på både över- och underdelen av brödet.',
        'Bygg: bröd, grönt, '+dc(ctx.protein)+', '+dc(ctx.topping)+' och en klick '+dc(ctx.wild)+' överst.',
        cu.seasoningLine
      ];
    }
  },
  {
    id:'omelett',
    titleFragment:(protein, carb) => 'Fluffig omelett med ' + dc(protein) + ' och ' + dc(carb),
    meta:'~15 min · 2 portioner · en panna',
    buildSteps(ctx){
      const cu = withCuisine(ctx);
      const pp = proteinProfile(ctx.protein);
      return [
        ...prepStep(pp),
        'Vispa 5-6 ägg med en skvätt mjölk, salt och peppar tills smeten är helt jämn.',
        pp.verb+' '+dc(ctx.protein)+' '+pp.time+' tills '+pp.state+' och lägg åt sidan.'+withNote(pp),
        'Fräs '+ctx.veggieLower+' mjuka i samma panna, 3-4 minuter.',
        'Häll äggsmeten över grönsakerna på medelvärme och dra in kanterna mot mitten tills omeletten precis stelnat på ytan.',
        'Lägg '+dc(ctx.protein)+' och '+dc(ctx.sauce)+' på ena halvan och vik ihop.',
        'Toppa med '+dc(ctx.topping)+' och '+dc(ctx.wild)+', servera direkt med '+dc(ctx.carb)+' vid sidan.',
        cu.seasoningLine
      ];
    }
  },
  {
    id:'pita',
    titleFragment:(protein, carb) => 'Fylld pita med ' + dc(protein) + ' och ' + dc(carb),
    meta:'~20 min · 2 portioner · bröd & fyllning',
    buildSteps(ctx){
      const cu = withCuisine(ctx);
      const pp = proteinProfile(ctx.protein);
      const cp = carbProfile(ctx.carb);
      return [
        ...prepStep(pp),
        pp.verb+' '+dc(ctx.protein)+' '+pp.time+' tills '+pp.state+', krydda med '+cu.flavorTags.join(', ')+'.'+withNote(pp),
        cp.verb+' '+dc(ctx.carb)+' '+cp.method+' och blanda med lite olivolja och citron.',
        'Hacka '+ctx.veggieLower+' grovt till en fräsch salladsblandning.',
        'Värm pitabröden hastigt och öppna dem försiktigt till fickor.',
        'Fyll med kolhydraten, salladen och '+dc(ctx.protein)+', ringla in '+dc(ctx.sauce)+' i varje ficka.',
        'Avsluta med '+dc(ctx.topping)+' och '+dc(ctx.wild)+' överst.',
        cu.seasoningLine
      ];
    }
  },
  {
    id:'poke',
    titleFragment:(protein, carb) => 'Poké-skål med ' + dc(protein) + ' på ' + dc(carb),
    meta:'~20 min · 2 portioner · kall skål',
    buildSteps(ctx){
      const cu = withCuisine(ctx);
      const pp = proteinProfile(ctx.protein);
      const cp = carbProfile(ctx.carb);
      return [
        ...prepStep(pp),
        cp.verb+' '+dc(ctx.carb)+' '+cp.method+' och låt svalna till ljummet — basen ska inte vara het.',
        pp.verb+' '+dc(ctx.protein)+' '+pp.time+' tills '+pp.state+', skär i jämna tärningar.'+withNote(pp),
        'Marinera tärningarna i '+dc(ctx.sauce)+' i 10 minuter medan du förbereder resten.',
        'Skiva '+ctx.veggieLower+' tunt och lägg upp i egna sektioner ovanpå basen.',
        'Lägg det marinerade proteinet i mitten och ringla över resten av marinaden.',
        'Strö '+dc(ctx.topping)+' över hela skålen och toppa med '+dc(ctx.wild)+'.',
        cu.seasoningLine
      ];
    }
  },
  {
    id:'chili',
    titleFragment:(protein, carb) => 'Mustig chili på ' + dc(protein) + ' med ' + dc(carb),
    meta:'~45 min · 2 portioner · gryta som får puttra',
    buildSteps(ctx){
      const cu = withCuisine(ctx);
      const pp = proteinProfile(ctx.protein);
      const cp = carbProfile(ctx.carb);
      return [
        ...prepStep(pp),
        pp.verb+' '+dc(ctx.protein)+' i en tjockbottnad gryta tills '+pp.state+'.'+withNote(pp),
        'Tillsätt '+ctx.veggieLower+' och fräs med tills de mjuknat, 4-5 minuter.',
        'Krydda rejält med '+cu.flavorTags.join(', ')+' och rör om tills det doftar kraftigt.',
        'Häll i '+dc(ctx.sauce)+' plus krossade tomater och bönor, låt puttra på svag värme minst 25 minuter.',
        cp.verb+' '+dc(ctx.carb)+' '+cp.method+' och servera chilin över.',
        'Toppa varje portion med '+dc(ctx.topping)+' och '+dc(ctx.wild)+'.',
        cu.seasoningLine
      ];
    }
  }
];
