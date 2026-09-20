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
  const steps = template.buildSteps(ctx);

  const tip = buildVariationTip(cuisine, sauce, wild);
  if(tip) steps.push(tip);

  return {
    title: cap((cuisine ? cuisine.label + '-inspirerad ' : '') + dc(template.titleFragment(protein, carb))),
    meta: template.meta,
    steps
  };
}

function buildVariationTip(cuisine, sauce, wild){
  if(!cuisine) return null;
  const altSauce = cuisine.sauceNudge && cuisine.sauceNudge.find(s => s.toLowerCase() !== (sauce || '').toLowerCase());
  const altWild = cuisine.wildNudge && cuisine.wildNudge.find(w => w.toLowerCase() !== (wild || '').toLowerCase());
  const ideas = [];
  if(altSauce) ideas.push('byta såsen mot ' + dc(altSauce));
  if(altWild) ideas.push('testa ' + dc(altWild) + ' som extra tillägg');
  if(!ideas.length) return null;
  return 'Tips för nästa gång: ' + ideas.join(' eller ') + ' för en annan känsla på samma ' + dc(cuisine.label) + '-tema.';
}
