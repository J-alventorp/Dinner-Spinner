import { dc, cap } from './text.js';
import { RECIPE_TEMPLATES } from '../data/recipeTemplates.js';
import { CUISINES, templatesForCuisine } from '../data/cuisines.js';

export function formatDate(ts){
  var d = new Date(ts);
  return d.toLocaleDateString('sv-SE', {day:'numeric', month:'short'}) + ' ' + d.toLocaleTimeString('sv-SE',{hour:'2-digit',minute:'2-digit'});
}

// Kom ihåg de tre senast använda mallarna, inte bara den senaste. Med 20
// mallar i listan kändes ett minne på ett steg fortfarande repetitivt när
// man tryckte "Kombinera om" några gånger i rad.
const RECENT_MEMORY = 3;
let recentTemplateIds = [];

// Bara mallar som faktiskt passar köket får vara med i lotten — annars kan
// t.ex. "ramen" dyka upp för ett nordiskt kök. Saknar köket en egen lista
// (eller är det inget valt kök) används alla mallar som fallback.
function pickTemplate(cuisine){
  const allowedIds = templatesForCuisine(cuisine);
  const eligible = allowedIds
    ? RECIPE_TEMPLATES.filter(t => allowedIds.indexOf(t.id) !== -1)
    : RECIPE_TEMPLATES;
  const base = eligible.length ? eligible : RECIPE_TEMPLATES;

  if(base.length === 1) return base[0];
  const candidates = base.filter(t => recentTemplateIds.indexOf(t.id) === -1);
  const pool = candidates.length ? candidates : base;
  const template = pool[Math.floor(Math.random() * pool.length)];
  recentTemplateIds = [template.id].concat(recentTemplateIds).slice(0, RECENT_MEMORY);
  return template;
}

export function craftRecipe(results){
  const protein = results.protein, carb = results.carb,
        veggies = results.veggie || [], sauce = results.sauce,
        topping = results.topping, wild = results.wild;
  const extras = results.extras || [];
  const veggieLower = veggies.map(dc).join(', ');
  const cuisine = CUISINES.find(c => c.label === results.cuisine);

  const template = pickTemplate(cuisine);
  const ctx = { protein, carb, veggieLower, sauce, topping, wild, cuisine };
  const steps = template.buildSteps(ctx);

  const bonusStep = buildBonusStep(extras);
  if(bonusStep) steps.push(bonusStep);

  const tip = buildVariationTip(cuisine, sauce, wild);
  if(tip) steps.push(tip);

  return {
    title: cap((cuisine ? cuisine.label + '-inspirerad ' : '') + dc(template.titleFragment(protein, carb))),
    meta: template.meta,
    steps,
    extras
  };
}

function buildBonusStep(extras){
  if(!extras.length) return null;
  const list = extras.map(dc);
  const joined = list.length > 1
    ? list.slice(0, -1).join(', ') + ' och ' + list[list.length - 1]
    : list[0];
  return '🎁 Bonus: du vann ' + joined + '. Lägg till det på slutet och skryt lite om det.';
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
