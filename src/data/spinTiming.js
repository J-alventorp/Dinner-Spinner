// Enda sanningskällan för alla snurr-varaktigheter.
//
// CSS läser dessa via inline-variabeln --spin-ms som Wheel sätter per hjul,
// så det finns inget hårdkodat värde i index.css att hålla i synk längre.
// Ändrar du något här ändras animationen automatiskt.

export const CLASSIC_SPIN_MS = 3100;

// Extra marginal efter att transitionen är klar innan resultatet rapporteras.
export const SETTLE_PAD_MS = 100;

// Hur länge "Du fick X!"-bannern ligger kvar innan nästa station.
export const RESULT_HOLD_MS = 1000;
