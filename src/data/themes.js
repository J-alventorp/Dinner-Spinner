export const COLORS = ['var(--wheel-1)','var(--wheel-2)','var(--wheel-3)','var(--wheel-4)','var(--wheel-5)','var(--wheel-6)'];

export const THEMES = {
  classic: { label:'Klassiskt',
    protein:['Kyckling','Fläskfilé','Nötfärs','Lax','Räkor','Tofu','Bacon','Kikärtor'],
    carb:['Ris','Jasminris','Pasta','Potatis','Couscous','Bulgur','Tortilla','Quinoa','Nudlar','Glasnudlar'],
    veggie:['Paprika','Broccoli','Morot','Zucchini','Champinjoner','Rödlök','Spenat','Majs','Aubergine','Vitkål','Pak choi','Sockerärtor'],
    sauce:['Teriyaki','Vitlökssmör','Curry','Tomatsås','Pesto','Gräddsås','Chimichurri','Soja & ingefära','Sweet chili','Oystersås','Röd curry'],
    topping:['Riven ost','Rostade nötter','Krispig lök','Färska örter','Syrad rödlök','Ströbröd (rostat)','Chiliflakes','Citronzest'],
    wild:['Chili & choklad','Kokos i currysås','Extra chili','Karamelliserad lök med fisksås','Popcorn som topping','Fritt val – du väljer']
  },
  vegetarian: { label:'Vegetariskt',
    protein:['Tofu','Halloumi','Kikärtor','Linser','Svarta bönor','Quorn','Ägg','Cashewnötter'],
    carb:['Ris','Pasta','Potatis','Couscous','Bulgur','Tortilla','Quinoa','Nudlar'],
    veggie:['Paprika','Broccoli','Morot','Zucchini','Champinjoner','Rödlök','Spenat','Majs','Aubergine','Vitkål'],
    sauce:['Teriyaki','Vitlökssmör','Curry','Tomatsås','Pesto','Gräddsås','Chimichurri','Soja & ingefära'],
    topping:['Riven ost','Rostade nötter','Krispig lök','Färska örter','Syrad rödlök','Ströbröd (rostat)'],
    wild:['Chili & choklad','Kokos i currysås','Extra chili','Karamelliserad lök','Popcorn som topping','Fritt val – du väljer']
  },
  seafood: { label:'Fisk & skaldjur',
    protein:['Lax','Torsk','Räkor','Musslor','Tonfisk','Scampi','Kammusslor'],
    carb:['Ris','Potatis','Pasta','Couscous','Focaccia','Quinoa'],
    veggie:['Fänkål','Zucchini','Cherrytomater','Sparris','Spenat','Paprika','Rödlök','Gurka'],
    sauce:['Vitlökssmör','Citron & smör','Vitvinssås','Salsa verde','Tomatsås','Currysås'],
    topping:['Kapris','Oliver','Dill','Parmesan','Pinjenötter','Citronzest'],
    wild:['Chili','Ansjovis','Extra kapris','Karamelliserad citron','Fritt val – du väljer']
  }
};

export const THEME_ORDER = ['classic','vegetarian','seafood'];

export const STATIONS = [
  {key:'cuisine', label:'Nation/kök', icon:'🌍', picks:1},
  {key:'protein', label:'Protein', icon:'🍗', picks:1},
  {key:'carb', label:'Kolhydrat', icon:'🍚', picks:1},
  {key:'veggie', label:'Grönsaker', icon:'🥦', picks:3},
  {key:'sauce', label:'Sås', icon:'🥣', picks:1},
  {key:'topping', label:'Topping', icon:'🧀', picks:1},
  {key:'wild', label:'Extra wild', icon:'✨', picks:1}
];
