import { dc, cap } from './text.js';
import { RECIPE_TEMPLATES } from '../data/recipeTemplates.js';
import { CUISINES } from '../data/cuisines.js';

export function formatDate(ts){
  var d = new Date(ts);
  return d.toLocaleDateString('sv-SE', {day:'numeric', month:'short'}) + ' ' + d.toLocaleTimeString('sv-SE',{hour:'2-digit',minute:'2-digit'});
}

let lastTemplateId = null;

function pickTemplate(){
  if(RECIPE_TEMPLATES.length === 1) return RECIPE_TEMPLATES[0];
  const candidates = RECIPE_TEMPLATES.filter(t => t.id !== lastTemplateId);
  const pool = candidates.length ? candidates : RECIPE_TEMPLATES;
  const template = pool[Math.floor(Math.random() * pool.length)];
  lastTemplateId = template.id;
  return template;
}

export function craftRecipe(results){
  const protein = results.protein, carb = results.carb,
        veggies = results.veggie, sauce = results.sauce,
        topping = results.topping, wild = results.wild;
  const veggieLower = veggies.map(dc).join(', ');
  const cuisine = CUISINES.find(c => c.label === results.cuisine);

  const template = pickTemplate();
  const ctx = { protein, carb, veggieLower, sauce, topping, wild, cuisine };

  return {
    title: cap((cuisine ? cuisine.label + '-inspirerad ' : '') + dc(template.titleFragment(protein, carb))),
    meta: template.meta,
    steps: template.buildSteps(ctx)
  };
}
