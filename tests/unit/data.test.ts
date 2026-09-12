import { describe, expect, test } from "bun:test";
import skills from "../../src/data/skills.json";
import experience from "../../src/data/experience.json";

const HEX_COLOR = /^#[0-9a-fA-F]{3,8}$/;

function expectValidUrl(value: unknown) {
  expect(typeof value).toBe("string");
  expect(() => new URL(value as string)).not.toThrow();
}

describe("skills.json", () => {
  test("has at least one category with at least one skill", () => {
    const categories = Object.entries(skills);
    expect(categories.length).toBeGreaterThan(0);
    for (const [, items] of categories) {
      expect(Array.isArray(items)).toBe(true);
      expect(items.length).toBeGreaterThan(0);
    }
  });

  test("every skill has a name, url, icon and hex color", () => {
    for (const [category, items] of Object.entries(skills)) {
      for (const skill of items as Array<Record<string, unknown>>) {
        expect(typeof skill.name).toBe("string");
        expect((skill.name as string).length).toBeGreaterThan(0);
        expectValidUrl(skill.url);
        expectValidUrl(skill.icon);
        expect(typeof skill.color).toBe("string");
        expect(skill.color as string).toMatch(HEX_COLOR);
      }
    }
  });

  test("skill names are unique across categories", () => {
    const names: string[] = [];
    for (const items of Object.values(skills)) {
      for (const skill of items as Array<{ name: string }>) {
        names.push(skill.name);
      }
    }
    expect(new Set(names).size).toBe(names.length);
  });
});

describe("experience.json", () => {
  test("every section has entries with required fields", () => {
    const sections = Object.entries(experience);
    expect(sections.length).toBeGreaterThan(0);
    for (const [, entries] of sections) {
      expect(Array.isArray(entries)).toBe(true);
      for (const entry of entries as Array<Record<string, unknown>>) {
        expect(typeof entry.title).toBe("string");
        expect(typeof entry.organization).toBe("string");
        expect(typeof entry.date).toBe("string");
        expect(typeof entry.description).toBe("string");
        expectValidUrl(entry.url);
        expect(Array.isArray(entry.tags)).toBe(true);
      }
    }
  });

  test("every tag has a name, icon and hex color", () => {
    for (const entries of Object.values(experience)) {
      for (const entry of entries as Array<{
        tags: Array<Record<string, unknown>>;
      }>) {
        for (const tag of entry.tags) {
          expect(typeof tag.name).toBe("string");
          expectValidUrl(tag.icon);
          expect(tag.color as string).toMatch(HEX_COLOR);
        }
      }
    }
  });
});
