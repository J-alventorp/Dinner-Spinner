import { useMemo, useState } from 'react';
import { craftRecipe } from '../utils/recipes.js';

function RecipeCard({ recipe, onSave }){
  const [saved, setSaved] = useState(false);
  return (
    <div className="recipe-card">
      <h3>{recipe.title}</h3>
      <p className="recipe-meta">{recipe.meta}</p>
      <ol>
        {recipe.steps.map((s, i) => <li key={i}>{s}</li>)}
      </ol>
      <button
        className={'save-fav-btn' + (saved ? ' saved' : '')}
        disabled={saved}
        onClick={() => { onSave(recipe); setSaved(true); }}
      >
        {saved ? '✓ Sparad' : '❤ Spara som favorit'}
      </button>
    </div>
  );
}

export default function FinalCard({ itemsList, stations, onSaveFavorite, onRestart }){
  const [variant, setVariant] = useState(0);
  const extras = itemsList.extras || [];

  const recipe = useMemo(() => craftRecipe(itemsList), [itemsList, variant]);

  // Bygg taggarna ur stationslistan så att den extra mysteriestationen i
  // gyllene läget kommer med utan särfall här.
  const tags = stations.reduce((acc, st) => {
    if(st.key === 'veggie') return acc.concat(itemsList.veggie || []);
    return itemsList[st.key] ? acc.concat([itemsList[st.key]]) : acc;
  }, []);

  return (
    <div className="final-card">
      <h2>Kvällens tallrik är klar! 🎉</h2>
      <p>Här är vad hjulen bestämde åt dig:</p>

      <div className="plate-summary">
        {tags.map((item, i) => <span className="tag" key={item + i}>{item}</span>)}
        {extras.map((item, i) => <span className="tag gold" key={'x' + item + i}>🎁 {item}</span>)}
      </div>

      <RecipeCard recipe={recipe} onSave={onSaveFavorite} />

      <div className="stage-actions">
        <button className="spin-btn" onClick={() => setVariant(v => v + 1)}>Kombinera om</button>
        <button className="ghost-btn" onClick={onRestart}>Snurra om allt</button>
      </div>
    </div>
  );
}
