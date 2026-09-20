// Enda sanningskällan för alla snurr-varaktigheter.
//
// CSS läser dessa via inline-variabeln --spin-ms som Wheel sätter per hjul,
// så det finns inget hårdkodat värde i index.css att hålla i synk längre.
// Ändrar du något här ändras animationen automatiskt.

export const CLASSIC_SPIN_MS = 3100;

// Turbo: varje hjul får sin egen varaktighet i intervallet, så de landar
// i tur och ordning istället för alla på en gång.
export const TURBO_MIN_MS = 2300;
export const TURBO_MAX_MS = 4300;
export const TURBO_STAGGER_MS = 150;

// Jackpot: tre hjul, vart och ett SLOT_STEP_MS längre än det förra.
export const SLOT_BASE_MS = 2200;
export const SLOT_STEP_MS = 700;

// Skicklighetsläge: hastighet på friersnurret och hur länge inbromsningen tar.
export const FREE_SPIN_DEG_PER_MS = 0.72;
export const SKILL_DECEL_MS = 900;
export const SKILL_DECEL_DEG = 540; // 1,5 varv

// Extra marginal efter att transitionen är klar innan resultatet rapporteras.
export const SETTLE_PAD_MS = 100;

// Hur länge "Du fick X!"-bannern ligger kvar innan nästa station.
export const RESULT_HOLD_MS = 1000;
