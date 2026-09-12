import { describe, expect, test } from "bun:test";
import {
  constructPayload,
  getRandomPastelColor,
  type currentData,
} from "../../src/components/blogeditor/stores";

function baseData(overrides: Partial<currentData> = {}): currentData {
  return {
    id: null,
    isPost: true,
    isEditing: false,
    title: "Test Post",
    tags: [{ id: "tag1" }, { id: "tag2" }],
    projectTag: { id: "projtag1" },
    markdown: "# Hello",
    html: "<h1>Hello</h1>",
    thumbnail: new File(["bytes"], "thumb.png", { type: "image/png" }),
    color: "#F8C76A",
    ...overrides,
  };
}

describe("constructPayload", () => {
  test("builds a FormData create-post payload", () => {
    const payload = constructPayload(baseData()) as FormData;
    expect(payload).toBeInstanceOf(FormData);
    expect(payload.get("Title")).toBe("Test Post");
    expect(payload.getAll("tagName")).toEqual(["tag1", "tag2"]);
    expect(payload.get("Markdown")).toBe("# Hello");
    expect(payload.get("Html")).toBe("<h1>Hello</h1>");
    expect(payload.get("Color")).toBe("#F8C76A");
    expect(payload.get("Thumbnail")).toBeInstanceOf(File);
  });

  test("create-post payload throws without a thumbnail", () => {
    expect(() => constructPayload(baseData({ thumbnail: null }))).toThrow(
      "Thumbnail is Required",
    );
  });

  test("builds an update-post payload with a new File thumbnail", () => {
    const payload = constructPayload(
      baseData({ isEditing: true, id: "abc" }),
    ) as Record<string, unknown>;
    expect(payload.Title).toBe("Test Post");
    expect(payload.tagName).toEqual(["tag1", "tag2"]);
    expect(payload.Thumbnail).toBeInstanceOf(File);
  });

  test("update-post payload omits Thumbnail when unchanged (non-File)", () => {
    const payload = constructPayload(
      baseData({ isEditing: true, thumbnail: "existing.png" as unknown as File }),
    ) as Record<string, unknown>;
    expect("Thumbnail" in payload).toBe(false);
    expect(payload.Color).toBe("#F8C76A");
  });

  test("update-post payload dedupes repeated tags", () => {
    const payload = constructPayload(
      baseData({
        isEditing: true,
        tags: [{ id: "tag1" }, { id: "tag1" }, { id: "tag2" }],
      }),
    ) as Record<string, unknown>;
    expect(payload.tagName).toEqual(["tag1", "tag2"]);
  });

  test("builds a FormData create-project payload including the project tag", () => {
    const payload = constructPayload(
      baseData({ isPost: false }),
    ) as FormData;
    expect(payload).toBeInstanceOf(FormData);
    expect(payload.get("Title")).toBe("Test Post");
    expect(payload.getAll("Tags")).toEqual(["tag1", "tag2"]);
    expect(payload.get("ProjectTag")).toBe("projtag1");
    expect(payload.get("Thumbnail")).toBeInstanceOf(File);
  });

  test("create-project payload throws without a project tag", () => {
    expect(() =>
      constructPayload(baseData({ isPost: false, projectTag: null })),
    ).toThrow("ProjectTag is null");
  });

  test("update-project payload keeps ProjectTag id and new thumbnail", () => {
    const payload = constructPayload(
      baseData({ isPost: false, isEditing: true, id: "proj1" }),
    ) as Record<string, unknown>;
    expect(payload.ProjectTag).toBe("projtag1");
    expect(payload.Tags).toEqual(["tag1", "tag2"]);
    expect(payload.Thumbnail).toBeInstanceOf(File);
  });

  test("update-project payload omits Thumbnail when unchanged", () => {
    const payload = constructPayload(
      baseData({
        isPost: false,
        isEditing: true,
        thumbnail: "existing.png" as unknown as File,
      }),
    ) as Record<string, unknown>;
    expect("Thumbnail" in payload).toBe(false);
    expect(payload.ProjectTag).toBe("projtag1");
  });
});

describe("getRandomPastelColor", () => {
  test("returns a valid 6-digit hex color", () => {
    for (let i = 0; i < 25; i++) {
      expect(getRandomPastelColor()).toMatch(/^#[0-9a-f]{6}$/);
    }
  });
});
