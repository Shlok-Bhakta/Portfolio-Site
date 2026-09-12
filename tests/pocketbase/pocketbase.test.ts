import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import PocketBase, { ClientResponseError } from "pocketbase";
import { constructPayload } from "../../src/components/blogeditor/stores";
import type { currentData } from "../../src/components/blogeditor/stores";
import { createMockPocketBase, type MockPocketBase } from "./mock";

let mock: MockPocketBase;
let pb: PocketBase;

beforeAll(() => {
  mock = createMockPocketBase();
  pb = new PocketBase(mock.url);
});

afterAll(() => {
  mock.close();
});

async function expectClientError(
  promise: Promise<unknown>,
  status: number,
): Promise<ClientResponseError> {
  try {
    await promise;
  } catch (err) {
    expect(err).toBeInstanceOf(ClientResponseError);
    expect((err as ClientResponseError).status).toBe(status);
    return err as ClientResponseError;
  }
  throw new Error(`Expected a ${status} ClientResponseError, but it resolved`);
}

describe("PocketBase health", () => {
  test("health check succeeds against the test server", async () => {
    const health = await pb.health.check();
    expect(health.code).toBe(200);
    expect(health.message).toContain("connected");
  });
});

describe("PocketBase record listing (the way blog/projects pages read)", () => {
  test("getFullList returns every seeded tag", async () => {
    const tags = await pb.collection("Tags").getFullList({ sort: "-created" });
    expect(tags).toHaveLength(3);
    expect(tags[0]).toMatchObject({ collectionName: "Tags" });
  });

  test("getFullList paginates across multiple batches", async () => {
    const posts = await pb.collection("Posts").getFullList(2);
    expect(posts).toHaveLength(5);
    expect(posts.map((p) => p.id)).toEqual([
      "post1",
      "post2",
      "post3",
      "post4",
      "post5",
    ]);
  });

  test("getList honors page/perPage and reports totals", async () => {
    const page = await pb.collection("Posts").getList(2, 2, {
      sort: "-created",
    });
    expect(page.page).toBe(2);
    expect(page.perPage).toBe(2);
    expect(page.totalItems).toBe(5);
    expect(page.totalPages).toBe(3);
    expect(page.items).toHaveLength(2);
  });

  test("list query params (sort/expand/filter) reach the server", async () => {
    mock.requests.length = 0;
    await pb.collection("Posts").getList(1, 30, {
      expand: "tagName",
      sort: "-created",
    });
    const last = mock.requests[mock.requests.length - 1];
    expect(last.pathname).toBe("/api/collections/Posts/records");
    expect(last.query.expand).toBe("tagName");
    expect(last.query.sort).toBe("-created");
  });

  test("unknown collection raises a 404 ClientResponseError", async () => {
    await expectClientError(pb.collection("Nope").getFullList(), 404);
  });
});

describe("PocketBase single record reads (the way post/project pages read)", () => {
  test("getOne returns the record", async () => {
    const post = await pb.collection("Posts").getOne("post1");
    expect(post).toMatchObject({ id: "post1", Title: "Test Post 1" });
  });

  test("getOne for a missing id raises 404", async () => {
    await expectClientError(pb.collection("Posts").getOne("missing"), 404);
  });
});

describe("PocketBase file URLs (the way pages build image URLs)", () => {
  test("getURL builds the file URL without network access", () => {
    const post = {
      id: "post1",
      collectionId: "coll_Posts",
      collectionName: "Posts",
    };
    expect(pb.files.getURL(post, "thumb1.png")).toBe(
      `${mock.url}/api/files/coll_Posts/post1/thumb1.png`,
    );
  });

  test("getURL appends thumb options like the blog page does", () => {
    const tag = {
      id: "tag1",
      collectionId: "coll_Tags",
      collectionName: "Tags",
    };
    expect(pb.files.getURL(tag, "icon1.svg", { thumb: "32x32" })).toBe(
      `${mock.url}/api/files/coll_Tags/tag1/icon1.svg?thumb=32x32`,
    );
  });
});

describe("PocketBase writes (the way the blog editor saves)", () => {
  const postData = (): currentData => ({
    id: null,
    isPost: true,
    isEditing: false,
    title: "Created From Test",
    tags: [{ id: "tag1" }],
    projectTag: null,
    markdown: "# Test",
    html: "<h1>Test</h1>",
    thumbnail: new File(["bytes"], "thumb.png", { type: "image/png" }),
    color: "#F8C76A",
  });

  test("create accepts the editor FormData payload", async () => {
    const payload = constructPayload(postData()) as FormData;
    const created = await pb.collection("Posts").create(payload);
    expect(created.Title).toBe("Created From Test");
    expect(created.id).toMatch(/^test_/);
  });

  test("update merges fields on an existing record", async () => {
    const updated = await pb.collection("Posts").update("post2", {
      Title: "Renamed",
    });
    expect(updated).toMatchObject({ id: "post2", Title: "Renamed" });
    const refetched = await pb.collection("Posts").getOne("post2");
    expect(refetched.Title).toBe("Renamed");
  });

  test("update of a missing record raises 404", async () => {
    await expectClientError(
      pb.collection("Posts").update("missing", { Title: "x" }),
      404,
    );
  });

  test("delete removes the record", async () => {
    await pb.collection("Posts").delete("post5");
    await expectClientError(pb.collection("Posts").getOne("post5"), 404);
  });
});

describe("PocketBase admin auth (the way the blog editor logs in)", () => {
  test("authWithPassword succeeds with valid credentials", async () => {
    const auth = await pb.admins.authWithPassword(
      "admin@test.dev",
      "secret",
    );
    expect(auth.token).toBe("test-admin-token");
  });

  test("authWithPassword fails with wrong credentials", async () => {
    pb.authStore.clear();
    await expectClientError(
      pb.admins.authWithPassword("admin@test.dev", "wrong"),
      400,
    );
    expect(pb.authStore.isValid).toBe(false);
  });
});
