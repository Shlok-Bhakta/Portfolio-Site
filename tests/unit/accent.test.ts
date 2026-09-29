import { describe, expect, test } from "bun:test";
import { ACCENTS, isAccentName, nextAccent, pickAccent, type AccentName } from "../../src/lib/accent";

describe("accent", () => {
  test("keeps a valid saved accent", () => {
    expect(pickAccent("peach", () => 0)).toBe("peach");
  });

  test("falls back to a random accent for missing or unknown values", () => {
    expect(pickAccent(undefined, () => 0)).toBe("mauve");
    expect(pickAccent("chartreuse", () => 0.999)).toBe("maroon");
  });

  test("never returns an out-of-range accent", () => {
    expect(isAccentName(pickAccent(undefined, () => 1))).toBe(true);
  });

  test("cycles through every accent and wraps around", () => {
    const names = Object.keys(ACCENTS) as AccentName[];
    let current: AccentName = names[0];
    const seen: AccentName[] = [current];
    for (let i = 1; i < names.length; i++) {
      current = nextAccent(current);
      seen.push(current);
    }
    expect(seen).toEqual(names);
    expect(nextAccent(current)).toBe(names[0]);
    expect(nextAccent("nope")).toBe(names[0]);
  });

  test("every accent is a hex color", () => {
    for (const hex of Object.values(ACCENTS)) {
      expect(hex).toMatch(/^#[0-9a-f]{6}$/);
    }
  });
});
