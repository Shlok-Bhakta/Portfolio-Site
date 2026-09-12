import { describe, expect, test } from "bun:test";
import { SITE_DESCRIPTION, SITE_TITLE } from "../../src/consts";

describe("site consts", () => {
  test("SITE_TITLE is a non-empty string", () => {
    expect(typeof SITE_TITLE).toBe("string");
    expect(SITE_TITLE.length).toBeGreaterThan(0);
  });

  test("SITE_DESCRIPTION is a non-empty string", () => {
    expect(typeof SITE_DESCRIPTION).toBe("string");
    expect(SITE_DESCRIPTION.length).toBeGreaterThan(0);
  });
});
