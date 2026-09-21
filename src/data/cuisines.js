// Varje kök har sina egna, riktiga ingredienspooler istället för att bara
// dekorera ett gemensamt tema med smakord. Kökshjulet styr alltså vilka
// proteiner, kolhydrater, grönsaker, såser, toppings och kryddiga avslutare
// (`wild`) som faktiskt kan dyka upp, och vilka recepttyper (`templateIds`)
// som passar köket.
//
// `vegProtein`/`seafoodProtein` används i stället för `protein` när temat
// (ThemeRow) är satt till vegetariskt respektive fisk & skaldjur, så att en
// vegetarisk Thai-runda faktiskt ger tofu och kikärtor istället för kyckling.

export const CUISINES = [
  { key:'nordiskt', label:'Nordiskt', icon:'🌲',
    protein:['Lax','Kyckling','Fläskfilé','Nötfärs','Kycklinglår','Korv','Torsk','Högrev','Kalops','Pannbiff','Köttbullar','Falukorv'],
    vegProtein:['Kikärtor','Halloumi','Tofu','Linser','Ägg'],
    seafoodProtein:['Lax','Torsk','Räkor','Rökt lax','Kräftstjärtar','Musslor','Kammusslor'],
    carb:['Potatis','Potatismos','Rotmos','Klyftpotatis','Ris','Bröd till'],
    veggie:['Morot','Purjolök','Vitkål','Ärtor','Rödbeta','Broccoli','Blomkål','Rotselleri','Sockerärtor','Lök'],
    sauce:['Gräddsås','Dillsås','Skysås','Senapssås','Vitlökssmör','Citron & smör','Svampsås'],
    topping:['Dill','Persilja','Krispig lök','Riven ost','Ättiksrödbetor','Citronzest'],
    wild:['Rårörda lingon','Brynt smör','Pepparrot','Inlagd gurka'],
    templateIds:['ugn','gryta','panna','soppa','burgare','omelett','spett','gratang'],
    flavorTags:['dill','smör','rotfrukter'],
    sauceNudge:['Vitlökssmör','Gräddsås','Citron & smör'],
    wildNudge:['Rårörda lingon','Brynt smör'],
    seasoningLine:'Smaka av med dill, smör och en skvätt citron.' },

  { key:'thai', label:'Thailändskt', icon:'🌶️',
    protein:['Kyckling','Kycklinglår','Kycklingstrimlor','Räkor','Fläskkarré','Nötstrimlor','Bläckfisk'],
    vegProtein:['Tofu','Kikärtor'],
    seafoodProtein:['Räkor','Bläckfisk','Kammusslor','Musslor'],
    carb:['Jasminris','Risnudlar','Glasnudlar','Nudlar','Äggnudlar'],
    veggie:['Paprika','Pak choi','Aubergine','Sockerärtor','Böngroddar','Morot','Broccoli'],
    sauce:['Röd curry','Grön curry','Sweet chili','Soja & ingefära','Jordnötssås','Oystersås'],
    topping:['Färsk koriander','Rostade jordnötter','Chiliflakes','Salladslök'],
    wild:['Lime','Kokosmjölk','Färsk chili','Thaibasilika'],
    templateIds:['wok','curry','soppa','bowl','sallad','spett'],
    flavorTags:['soja','ingefära','chili','lime','koriander'],
    sauceNudge:['Soja & ingefära','Sweet chili','Röd curry'],
    wildNudge:['Kokosmjölk','Jordnötter'],
    seasoningLine:'Avsluta med lime, koriander och en skvätt fisksås om du har.' },

  { key:'indiskt', label:'Indiskt', icon:'🍛',
    protein:['Kyckling','Kycklinglår','Kycklingfilé','Räkor','Nötfärs'],
    vegProtein:['Kikärtor','Linser','Vita bönor','Halloumi'],
    seafoodProtein:['Räkor'],
    carb:['Ris','Jasminris','Bröd till'],
    veggie:['Spenat','Blomkål','Morot','Paprika','Lök','Aubergine'],
    sauce:['Curry','Tomatsås','Yoghurtsås'],
    topping:['Färsk koriander','Rostade cashewnötter','Mangochutney','Citronzest'],
    wild:['Garam masala','Färsk chili','Citron','Ingefära'],
    templateIds:['curry','gryta','wok','soppa','krispig'],
    flavorTags:['garam masala','spiskummin','koriander','curry'],
    sauceNudge:['Curry','Tomatsås'],
    wildNudge:['Mangochutney','Rostad spiskummin'],
    seasoningLine:'Krydda med garam masala, spiskummin och färsk koriander.' },

  { key:'franskt', label:'Franskt', icon:'🥖',
    protein:['Kyckling','Anka','Fläskfilé','Högrev','Lax','Musslor','Torsk'],
    vegProtein:['Ägg','Linser','Vita bönor'],
    seafoodProtein:['Lax','Torsk','Musslor','Kammusslor'],
    carb:['Potatis','Potatismos','Bröd till','Ris'],
    veggie:['Purjolök','Morot','Champinjoner','Sparris','Lök','Fänkål'],
    sauce:['Vitlökssmör','Gräddsås','Vitvinssås','Senapssås','Svampsås'],
    topping:['Persilja','Riven ost','Krutonger','Citronzest'],
    wild:['Timjan','Estragon','Vitt vin','Smör'],
    templateIds:['gryta','ugn','panna','gratang','omelett','soppa'],
    flavorTags:['smör','timjan','vitt vin'],
    sauceNudge:['Vitlökssmör','Gräddsås'],
    wildNudge:['Dijonsenap','Estragon'],
    seasoningLine:'Vispa in smör, timjan och gärna en skvätt vitt vin på slutet.' },

  { key:'italienskt', label:'Italienskt', icon:'🍝',
    protein:['Kyckling','Fläskfilé','Nötfärs','Räkor','Bacon','Kammusslor'],
    vegProtein:['Kikärtor','Vita bönor','Ägg'],
    seafoodProtein:['Räkor','Kammusslor','Musslor','Bläckfisk'],
    carb:['Pasta','Risottoris','Gnocchi','Polenta','Focaccia'],
    veggie:['Cherrytomater','Zucchini','Aubergine','Spenat','Champinjoner','Lök'],
    sauce:['Tomatsås','Pesto','Vitlökssmör','Gräddsås'],
    topping:['Parmesan','Färsk basilika','Pinjenötter','Chiliflakes'],
    wild:['Basilika','Torkad chili','Citronzest','Vitlök'],
    templateIds:['risotto','ugn','gratang','panna','sallad','soppa'],
    flavorTags:['vitlök','basilika','parmesan'],
    sauceNudge:['Tomatsås','Pesto'],
    wildNudge:['Parmesan','Torkad chili'],
    seasoningLine:'Toppa med färsk basilika och riven parmesan.' },

  { key:'amerikanskt', label:'Amerikanskt', icon:'🍔',
    protein:['Nötfärs','Pannbiff','Kyckling','Fläskkotlett','Bacon','Korv'],
    vegProtein:['Quorn','Svarta bönor','Halloumi'],
    seafoodProtein:['Räkor'],
    carb:['Potatis','Klyftpotatis','Bröd till','Ris'],
    veggie:['Majs','Paprika','Lök','Vitkål','Cherrytomater'],
    sauce:['Tomatsås','BBQ-sås','Senapssås'],
    topping:['Riven ost','Krispig lök','Inlagd gurka'],
    wild:['Rökt paprika','BBQ-sås','Lönnsirap','Chiliflakes'],
    templateIds:['burgare','krispig','chili','spett','panna'],
    flavorTags:['bbq','rökt paprika','lönnsirap'],
    sauceNudge:['Tomatsås'],
    wildNudge:['BBQ-sås','Rökt paprikapulver'],
    seasoningLine:'Rör ner rökt paprika och en klick bbq-sås för rökig sötma.' },

  { key:'mexikanskt', label:'Mexikanskt', icon:'🌮',
    protein:['Nötfärs','Kyckling','Kycklingstrimlor','Räkor','Fläskkarré'],
    vegProtein:['Svarta bönor','Kikärtor'],
    seafoodProtein:['Räkor'],
    carb:['Ris','Tortilla'],
    veggie:['Paprika','Majs','Lök','Avokado','Cherrytomater'],
    sauce:['Salsa verde','Chimichurri','Tomatsås'],
    topping:['Färsk koriander','Riven ost','Syrad rödlök','Jalapeño'],
    wild:['Lime','Chiliflakes','Spiskummin','Färsk chili'],
    templateIds:['taco','chili','bowl','sallad','wrap'],
    flavorTags:['lime','koriander','chili','spiskummin'],
    sauceNudge:['Salsa verde','Chimichurri'],
    wildNudge:['Jalapeño','Avokado'],
    seasoningLine:'Pressa över lime och strö på färsk koriander och chiliflakes.' },

  { key:'grekiskt', label:'Grekiskt', icon:'🫒',
    protein:['Kyckling','Fläskfilé','Räkor','Halloumi'],
    vegProtein:['Halloumi','Kikärtor','Vita bönor'],
    seafoodProtein:['Räkor','Bläckfisk'],
    carb:['Ris','Bröd till','Couscous','Bulgur'],
    veggie:['Cherrytomater','Gurka','Paprika','Rödlök','Aubergine'],
    sauce:['Yoghurtsås','Tomatsås','Aioli'],
    topping:['Fetaost','Oliver','Oregano'],
    wild:['Citron','Olivolja','Mynta'],
    templateIds:['sallad','spett','pita','ugn','gratang'],
    flavorTags:['oregano','olivolja','citron','vitlök'],
    sauceNudge:['Yoghurtsås','Tomatsås','Aioli'],
    wildNudge:['Fetaost','Kalamataoliver'],
    seasoningLine:'Ringla över olivolja och strö på torkad oregano och flingsalt.' },

  { key:'japanskt', label:'Japanskt', icon:'🍱',
    protein:['Lax','Räkor','Kyckling','Tofu','Bläckfisk','Kammusslor','Tonfisk'],
    vegProtein:['Tofu','Kikärtor'],
    seafoodProtein:['Lax','Räkor','Tonfisk','Bläckfisk','Kammusslor'],
    carb:['Jasminris','Udon','Äggnudlar','Ris'],
    veggie:['Pak choi','Broccoli','Morot','Sockerärtor','Salladslök'],
    sauce:['Teriyaki','Miso','Ponzu','Soja & ingefära'],
    topping:['Sesamfrön','Nori','Inlagd ingefära','Salladslök'],
    wild:['Wasabi','Sesamolja','Furikake'],
    templateIds:['ramen','poke','wok','bowl','krispig','omelett'],
    flavorTags:['soja','mirin','sesam','ingefära'],
    sauceNudge:['Teriyaki','Miso','Ponzu'],
    wildNudge:['Inlagd ingefära','Furikake'],
    seasoningLine:'Avsluta med rostad sesam, en skvätt soja och lite riven ingefära.' },

  { key:'koreanskt', label:'Koreanskt', icon:'🌶',
    protein:['Nötstrimlor','Kyckling','Fläskkarré','Tofu','Räkor'],
    vegProtein:['Tofu','Kikärtor'],
    seafoodProtein:['Räkor','Bläckfisk'],
    carb:['Ris','Nudlar','Glasnudlar'],
    veggie:['Pak choi','Morot','Böngroddar','Vitkål','Salladslök'],
    sauce:['Soja & ingefära','Sweet chili','Gochujang'],
    topping:['Sesamfrön','Salladslök','Kimchi','Chiliflakes'],
    wild:['Gochujang','Sesamolja','Vitlök'],
    templateIds:['wok','bowl','krispig','soppa','spett'],
    flavorTags:['gochujang','sesam','vitlök','soja'],
    sauceNudge:['Soja & ingefära','Sweet chili'],
    wildNudge:['Kimchi','Gochujang'],
    seasoningLine:'Rör ner en sked gochujang och toppa med sesam och salladslök.' },

  { key:'spanskt', label:'Spanskt', icon:'🥘',
    protein:['Kyckling','Räkor','Fläskfilé','Korv','Musslor','Bläckfisk'],
    vegProtein:['Kikärtor','Vita bönor'],
    seafoodProtein:['Räkor','Musslor','Bläckfisk','Kammusslor'],
    carb:['Risottoris','Ris','Bröd till','Potatis'],
    veggie:['Paprika','Lök','Cherrytomater','Ärtor'],
    sauce:['Aioli','Tomatsås','Vitlökssmör'],
    topping:['Citronzest','Persilja','Rostade mandlar'],
    wild:['Rökt paprika','Saffran','Olivolja'],
    templateIds:['gryta','risotto','spett','ugn','panna'],
    flavorTags:['rökt paprika','vitlök','olivolja','saffran'],
    sauceNudge:['Aioli','Tomatsås','Saffranssås'],
    wildNudge:['Manchego','Rökt paprika'],
    seasoningLine:'Krydda med rökt paprikapulver och avsluta med god olivolja.' },

  { key:'mellanostern', label:'Mellanöstern', icon:'🧆',
    protein:['Kyckling','Nötfärs','Kikärtor','Halloumi','Falafel'],
    vegProtein:['Kikärtor','Falafel','Linser','Halloumi'],
    seafoodProtein:['Räkor'],
    carb:['Bulgur','Couscous','Ris','Bröd till','Matvete'],
    veggie:['Aubergine','Cherrytomater','Gurka','Lök','Spenat'],
    sauce:['Tahinisås','Yoghurtsås'],
    topping:['Granatäpple','Sumak','Färsk mynta','Pinjenötter'],
    wild:['Sumak','Tahini','Citron'],
    templateIds:['pita','sallad','spett','gryta','wrap'],
    flavorTags:['spiskummin','kanel','mynta','tahini'],
    sauceNudge:['Tahinisås','Yoghurtsås'],
    wildNudge:['Granatäpple','Sumak'],
    seasoningLine:'Strö över sumak och färsk mynta, och ringla på tahini.' },

  { key:'vietnamesiskt', label:'Vietnamesiskt', icon:'🍜',
    protein:['Kyckling','Nötstrimlor','Räkor','Fläskkarré','Tofu'],
    vegProtein:['Tofu','Kikärtor'],
    seafoodProtein:['Räkor','Bläckfisk'],
    carb:['Risnudlar','Ris','Glasnudlar','Bao-bröd'],
    veggie:['Böngroddar','Morot','Gurka','Salladslök','Pak choi'],
    sauce:['Soja & ingefära','Sweet chili','Ponzu'],
    topping:['Färsk mynta','Färsk koriander','Rostade jordnötter','Chiliflakes'],
    wild:['Lime','Färska örter','Chili'],
    templateIds:['soppa','wrap','bowl','sallad','ramen'],
    flavorTags:['lime','mynta','koriander','fisksås'],
    sauceNudge:['Soja & ingefära','Sweet chili','Ponzu'],
    wildNudge:['Rostade jordnötter','Färsk mynta'],
    seasoningLine:'Toppa med massor av färska örter, lime och rostade jordnötter.' }
];

// Vilken proteinpool som gäller för ett kök givet valt tema. Vegetariskt och
// fisk & skaldjur styr om proteinet; övriga teman (klassiskt, husmanskost,
// 15 minuter, asiatiskt) ändrar inte på köket, bara vilka pooler som visas
// innan ett kök är valt (se THEMES i themes.js).
export function cuisineProteinPool(cuisine, theme){
  if(theme === 'vegetarian') return (cuisine.vegProtein && cuisine.vegProtein.length) ? cuisine.vegProtein : null;
  if(theme === 'seafood') return (cuisine.seafoodProtein && cuisine.seafoodProtein.length) ? cuisine.seafoodProtein : null;
  return cuisine.protein;
}

// Hämtar poolen för en station givet valt kök och tema, med fallback till
// kökets ordinarie pool (eller null om inget kök är valt än).
export function cuisinePool(cuisine, theme, key){
  if(!cuisine) return null;
  if(key === 'protein') return cuisineProteinPool(cuisine, theme) || cuisine.protein;
  return cuisine[key] || null;
}

// De receptmallar (id:n ur RECIPE_TEMPLATES) som passar köket. Faller
// tillbaka till samtliga mallar om köket saknar en egen lista.
export function templatesForCuisine(cuisine){
  return cuisine && cuisine.templateIds && cuisine.templateIds.length ? cuisine.templateIds : null;
}
