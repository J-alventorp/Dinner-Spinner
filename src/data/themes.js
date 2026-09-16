export const COLORS = ['var(--wheel-1)','var(--wheel-2)','var(--wheel-3)','var(--wheel-4)','var(--wheel-5)','var(--wheel-6)'];

export const THEMES = {
  classic: { label:'Klassiskt',
    protein:['Kyckling','Fläskfilé','Nötfärs','Lax','Räkor','Tofu','Bacon','Kikärtor'],
    carb:['Ris','Pasta','Potatis','Couscous','Bulgur','Tortilla','Quinoa','Nudlar'],
    veggie:['Paprika','Broccoli','Morot','Zucchini','Champinjoner','Rödlök','Spenat','Majs','Aubergine','Vitkål'],
    sauce:['Teriyaki','Vitlökssmör','Curry','Tomatsås','Pesto','Gräddsås','Chimichurri','Soja & ingefära'],
    wild:['Chili & choklad','Ananas','Fetaost','Kokos','Rostad vitlök','Extra chili','Lime & koriander','Karamelliserad lök','Pinjenötter','Fritt val – du väljer']
  },
  vegetarian: { label:'Vegetariskt',
    protein:['Tofu','Halloumi','Kikärtor','Linser','Svarta bönor','Quorn','Ägg','Cashewnötter'],
    carb:['Ris','Pasta','Potatis','Couscous','Bulgur','Tortilla','Quinoa','Nudlar'],
    veggie:['Paprika','Broccoli','Morot','Zucchini','Champinjoner','Rödlök','Spenat','Majs','Aubergine','Vitkål'],
    sauce:['Teriyaki','Vitlökssmör','Curry','Tomatsås','Pesto','Gräddsås','Chimichurri','Soja & ingefära'],
    wild:['Chili & choklad','Ananas','Fetaost','Kokos','Rostad vitlök','Extra chili','Lime & koriander','Karamelliserad lök','Pinjenötter','Fritt val – du väljer']
  },
  asian: { label:'Asiatiskt',
    protein:['Kyckling','Räkor','Tofu','Fläskkarré','Anka','Nötkött'],
    carb:['Jasminris','Äggnudlar','Glasnudlar','Baobröd','Klibbris','Ramennudlar'],
    veggie:['Pak choi','Morot','Vårlök','Shiitake','Sockerärtor','Majs','Paprika','Broccoli'],
    sauce:['Teriyaki','Soja & ingefära','Sweet chili','Oystersås','Sesam & chili','Röd curry'],
    wild:['Sesamfrön','Jordnötter','Chiliolja','Lime','Koriander','Ananas','Kokosmjölk','Fritt val – du väljer']
  },
  seafood: { label:'Fisk & skaldjur',
    protein:['Lax','Torsk','Räkor','Musslor','Tonfisk','Scampi','Kammusslor'],
    carb:['Ris','Potatis','Pasta','Couscous','Focaccia','Quinoa'],
    veggie:['Fänkål','Zucchini','Cherrytomater','Sparris','Spenat','Paprika','Rödlök','Gurka'],
    sauce:['Vitlökssmör','Citron & smör','Vitvinssås','Salsa verde','Tomatsås','Currysås'],
    wild:['Kapris','Oliver','Chili','Dill','Parmesan','Pinjenötter','Fritt val – du väljer']
  }
};

export const THEME_ORDER = ['classic','vegetarian','asian','seafood'];

export const STATIONS = [
  {key:'protein', label:'Protein', icon:'🍗', picks:1},
  {key:'carb', label:'Kolhydrat', icon:'🍚', picks:1},
  {key:'veggie', label:'Grönsaker', icon:'🥦', picks:3},
  {key:'sauce', label:'Sås', icon:'🥣', picks:1},
  {key:'wild', label:'Extra wild', icon:'✨', picks:1}
];

export const PANTRY_CANDIDATES = ['Salt','Peppar','Olivolja','Smör','Vitlök','Gul lök','Ägg','Mjöl','Socker','Soja','Vinäger','Buljong','Ströbröd','Citron'];
