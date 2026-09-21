export const COLORS = ['var(--wheel-1)','var(--wheel-2)','var(--wheel-3)','var(--wheel-4)','var(--wheel-5)','var(--wheel-6)'];

// Temana används som fallback-pooler innan ett kök är valt (t.ex. i
// "Anpassa hjul") och styr vegetariskt/fisk & skaldjur-filtret i App.jsx.
// Själva ingredienserna kommer annars från CUISINES (se cuisines.js), som är
// köksspecifika och alltid vinner när ett kök redan är valt.
export const THEMES = {
  classic: { label:'Klassiskt', icon:'🍽️',
    protein:['Kyckling','Fläskfilé','Nötfärs','Lax','Räkor','Tofu','Bacon','Kikärtor','Kycklinglår','Korv','Högrev','Kalkon'],
    carb:['Ris','Jasminris','Pasta','Potatis','Couscous','Bulgur','Tortilla','Quinoa','Nudlar','Glasnudlar','Sötpotatis','Gnocchi'],
    veggie:['Paprika','Broccoli','Morot','Zucchini','Champinjoner','Rödlök','Spenat','Majs','Aubergine','Vitkål','Pak choi','Sockerärtor','Purjolök','Blomkål','Cherrytomater'],
    sauce:['Teriyaki','Vitlökssmör','Curry','Tomatsås','Pesto','Gräddsås','Chimichurri','Soja & ingefära','Sweet chili','Oystersås','Röd curry','Bearnaise','Aioli','Yoghurtsås'],
    topping:['Riven ost','Rostade nötter','Krispig lök','Färska örter','Syrad rödlök','Ströbröd (rostat)','Chiliflakes','Citronzest','Sesamfrön','Fetaost','Granatäpple','Krutonger'],
    wild:['Chili & choklad','Kokos i currysås','Extra chili','Karamelliserad lök med fisksås','Honung & flingsalt','Inlagd gurka','Rostad vitlök','Apelsinskal']
  },
  vegetarian: { label:'Vegetariskt', icon:'🥗',
    protein:['Tofu','Halloumi','Kikärtor','Linser','Svarta bönor','Quorn','Ägg','Cashewnötter','Tempeh','Seitan','Falafel','Vita bönor'],
    carb:['Ris','Pasta','Potatis','Couscous','Bulgur','Tortilla','Quinoa','Nudlar','Polenta','Gnocchi','Matvete','Sötpotatis'],
    veggie:['Paprika','Broccoli','Morot','Zucchini','Champinjoner','Rödlök','Spenat','Majs','Aubergine','Vitkål','Grönkål','Sparris','Ärtor','Rödbeta'],
    sauce:['Teriyaki','Vitlökssmör','Curry','Tomatsås','Pesto','Gräddsås','Chimichurri','Soja & ingefära','Tahinisås','Yoghurtsås','Svampsås','Salsa verde'],
    topping:['Riven ost','Rostade nötter','Krispig lök','Färska örter','Syrad rödlök','Ströbröd (rostat)','Fetaost','Pinjenötter','Granatäpple','Näringsjäst'],
    wild:['Chili & choklad','Kokos i currysås','Extra chili','Karamelliserad lök','Rökt paprika','Tryffelolja','Inlagd chili']
  },
  seafood: { label:'Fisk & skaldjur', icon:'🐟',
    protein:['Lax','Torsk','Räkor','Musslor','Tonfisk','Scampi','Kammusslor','Sej','Hälleflundra','Kräftstjärtar','Bläckfisk','Rökt lax'],
    carb:['Ris','Potatis','Pasta','Couscous','Focaccia','Quinoa','Risottoris','Nudlar','Bröd till'],
    veggie:['Fänkål','Zucchini','Cherrytomater','Sparris','Spenat','Paprika','Rödlök','Gurka','Ärtor','Sockerärtor','Purjolök'],
    sauce:['Vitlökssmör','Citron & smör','Vitvinssås','Salsa verde','Tomatsås','Currysås','Dillsås','Saffranssås','Aioli'],
    topping:['Kapris','Oliver','Dill','Parmesan','Pinjenötter','Citronzest','Ströbröd (rostat)','Syrad rödlök'],
    wild:['Chili','Ansjovis','Extra kapris','Karamelliserad citron','Pernod-skvätt','Rostade fänkålsfrön']
  },
  asiatiskt: { label:'Asiatiskt', icon:'🥢',
    protein:['Kyckling','Fläskkarré','Tofu','Räkor','Nötstrimlor','Ägg','Anka','Tempeh','Lax','Kikärtor'],
    carb:['Jasminris','Nudlar','Glasnudlar','Ris','Äggnudlar','Risnudlar','Bao-bröd','Udon'],
    veggie:['Pak choi','Broccoli','Morot','Sockerärtor','Paprika','Vitkål','Böngroddar','Champinjoner','Salladslök','Aubergine','Majskolvar'],
    sauce:['Soja & ingefära','Teriyaki','Oystersås','Sweet chili','Röd curry','Grön curry','Hoisin','Miso','Jordnötssås','Ponzu'],
    topping:['Sesamfrön','Salladslök','Krispig lök','Koriander','Rostade jordnötter','Chiliflakes','Nori','Inlagd ingefära'],
    wild:['Extra chili','Kokosmjölk','Limeblad','Wasabi','Sriracha','Krispig chilisås']
  },
  comfort: { label:'Husmanskost', icon:'🏠',
    protein:['Köttbullar','Fläskkotlett','Nötfärs','Korv','Kyckling','Falukorv','Pannbiff','Kalops','Lax','Ägg'],
    carb:['Potatis','Potatismos','Pasta','Ris','Klyftpotatis','Rotmos','Bröd till','Makaroner'],
    veggie:['Morot','Vitkål','Ärtor','Rödbeta','Purjolök','Broccoli','Blomkål','Lök','Rotselleri'],
    sauce:['Gräddsås','Brunsås','Skysås','Senapssås','Dillsås','Tomatsås','Vitlökssmör','Svampsås'],
    topping:['Rårörda lingon','Inlagd gurka','Persilja','Riven ost','Krispig lök','Smör','Ättiksrödbetor'],
    wild:['Extra smör','Dubbla lingon','Senap','Ett stekt ägg','Knäckebröd till']
  },
  snabbt: { label:'15 minuter', icon:'⚡',
    protein:['Räkor','Ägg','Halloumi','Kycklingstrimlor','Tonfisk (burk)','Kikärtor','Korv','Rökt lax','Färdig kyckling'],
    carb:['Nudlar','Couscous','Tortilla','Pasta','Bröd till','Glasnudlar','Färdigkokt ris'],
    veggie:['Spenat','Cherrytomater','Paprika','Sockerärtor','Gurka','Avokado','Majs','Ruccola','Salladslök'],
    sauce:['Pesto','Sweet chili','Tomatsås','Yoghurtsås','Aioli','Soja & ingefära','Vitlökssmör'],
    topping:['Fetaost','Riven ost','Krispig lök','Färska örter','Chiliflakes','Rostade nötter','Citronzest'],
    wild:['Extra chili','Honung','Flingsalt','Citron över allt']
  }
};

export const THEME_ORDER = ['classic','vegetarian','seafood','asiatiskt','comfort','snabbt'];

export const STATIONS = [
  {key:'cuisine', label:'Nation/kök', icon:'🌍', picks:1},
  {key:'protein', label:'Protein', icon:'🍗', picks:1},
  {key:'carb', label:'Kolhydrat', icon:'🍚', picks:1},
  {key:'veggie', label:'Grönsaker', icon:'🥦', picks:3},
  {key:'sauce', label:'Sås', icon:'🥣', picks:1},
  {key:'topping', label:'Topping', icon:'🧀', picks:1},
  {key:'wild', label:'Extra wild', icon:'✨', picks:1}
];
