// Catppuccin accents the site picks from. One is chosen at random per visit
// and remembered in a session cookie so it stays put while navigating.
export const ACCENTS = {
  mauve: "#cba6f7",
  red: "#f38ba8",
  peach: "#fab387",
  yellow: "#f9e2af",
  sky: "#89dceb",
  maroon: "#eba0ac",
} as const;

export type AccentName = keyof typeof ACCENTS;

export const ACCENT_COOKIE = "accent";

const names = Object.keys(ACCENTS) as AccentName[];

export function isAccentName(value: unknown): value is AccentName {
  return typeof value === "string" && value in ACCENTS;
}

/** Keep a saved accent if it is valid, otherwise pick one at random. */
export function pickAccent(saved?: string, random: () => number = Math.random): AccentName {
  if (isAccentName(saved)) return saved;
  return names[Math.floor(random() * names.length) % names.length];
}

export function nextAccent(current: string): AccentName {
  const index = isAccentName(current) ? names.indexOf(current) : -1;
  return names[(index + 1) % names.length];
}
