import { useMemo, useState } from 'react';
import { craftRecipes } from '../utils/recipes.js';

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

export default function FinalCard({ itemsList, pantry, refreshKey, onSaveFavorite, onAgain, onRestart }){
  const recipes = useMemo(() => craftRecipes(
    {
      protein: itemsList.protein,
      carb: itemsList.carb,
      veggie: itemsList.veggie,
      sauce: itemsList.sauce,
      wild: itemsList.wild
    },
    pantry
  ), [itemsList, pantry, refreshKey]);

  const tags = [itemsList.protein, itemsList.carb, ...itemsList.veggie, itemsList.sauce, itemsList.wild];

  return (
    <div className="final-card">
      <h2>Kvällens tallrik är klar! 🎉</h2>
      <p>Här är vad hjulen bestämde åt dig:</p>

      <div className="plate-summary">
        {tags.map((item, i) => <span className="tag" key={item + i}>{item}</span>)}
      </div>

      {recipes.map((r, i) => (
        <RecipeCard key={r.title + i} recipe={r} onSave={onSaveFavorite} />
      ))}

      <div className="stage-actions">
        <button className="spin-btn" onClick={onAgain}>Nya receptidéer</button>
        <button className="ghost-btn" onClick={onRestart}>Snurra om allt</button>
      </div>
    </div>
  );
}
