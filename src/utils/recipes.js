export function dc(s){ if(!s) return s; return s.charAt(0).toLowerCase()+s.slice(1); }
export function cap(s){ if(!s) return s; return s.charAt(0).toUpperCase()+s.slice(1); }

export function shuffle(arr){
  var a = arr.slice();
  for(var i=a.length-1;i>0;i--){
    var j = Math.floor(Math.random()*(i+1));
    var tmp=a[i]; a[i]=a[j]; a[j]=tmp;
  }
  return a;
}

export function formatDate(ts){
  var d = new Date(ts);
  return d.toLocaleDateString('sv-SE', {day:'numeric', month:'short'}) + ' ' + d.toLocaleTimeString('sv-SE',{hour:'2-digit',minute:'2-digit'});
}

export function craftRecipes(results, pantry){
  var protein = results.protein, carb = results.carb,
      veggies = results.veggie, sauce = results.sauce, wild = results.wild;
  var veggieLower = veggies.map(dc).join(', ');
  var pantryLine = pantry.length ? ('Smaka av med ' + pantry.map(dc).join(', ') + '.') : 'Smaka av med salt och peppar.';

  var r1 = {
    title: cap(dc(wild)) + ' ' + dc(protein) + ' med ' + dc(carb) + ' och ' + dc(sauce),
    meta: '~25 min · 2 portioner · panna/wok',
    steps: [
      'Hetta upp olja i en stekpanna eller wok på hög värme.',
      'Bryn '+dc(protein)+' 4-6 minuter tills det fått fin färg. Lägg åt sidan.',
      'Tillaga '+dc(carb)+' separat enligt paketets anvisning (eller i samma panna om det passar, t.ex. nudlar).',
      'Fräs '+veggieLower+' i samma panna 3-4 minuter tills grönsakerna mjuknat men fortfarande har tuggmotstånd.',
      'Lägg tillbaka '+dc(protein)+', rör ner '+dc(sauce)+' och låt allt puttra ihop 2-3 minuter.',
      'Toppa med '+dc(wild)+' precis innan servering – det är din twist för kvällen.',
      pantryLine
    ]
  };
  var r2 = {
    title: cap(dc(carb)) + '-bowl med ' + dc(protein) + ' och ' + dc(sauce),
    meta: '~20 min · 2 portioner · skål',
    steps: [
      'Koka eller värm '+dc(carb)+' och lägg som bas i en skål.',
      'Stek eller ugnsbaka '+dc(protein)+' 8-10 minuter tills genomstekt och skär i bitar.',
      'Skär eller riv '+veggieLower+', rått eller lätt sauterat, och lägg ovanpå basen.',
      'Ringla över '+dc(sauce)+' generöst över hela skålen.',
      'Avsluta med '+dc(wild)+' som crunch eller smakskott.',
      pantryLine
    ]
  };
  var r3 = {
    title: 'Ugnsbakad ' + dc(protein) + ' med ' + dc(carb) + ' och ' + dc(sauce),
    meta: '~35 min · 2 portioner · ugn, en plåt',
    steps: [
      'Sätt ugnen på 200°C.',
      'Lägg '+dc(protein)+' och '+veggieLower+' på en plåt, ringla över olja och rör runt.',
      'Baka i mitten av ugnen 20-25 minuter tills protein är genomstekt och grönsakerna fått lite färg.',
      'Under tiden, tillaga '+dc(carb)+' enligt paketets anvisning.',
      'Blanda '+dc(sauce)+' med stekskyn från plåten och häll över när allt är klart.',
      'Toppa med '+dc(wild)+' direkt innan servering.',
      pantryLine
    ]
  };
  return shuffle([r1, r2, r3]);
}
