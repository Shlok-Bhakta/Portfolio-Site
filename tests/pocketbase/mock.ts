/**
 * Minimal in-memory mock of the PocketBase HTTP API surface this site uses.
 *
 * It implements just enough of the real REST contract to exercise the
 * PocketBase JS SDK the same way the pages and blog editor do:
 *  - GET  /api/health
 *  - GET  /api/collections/:collection/records (paginated list)
 *  - GET  /api/collections/:collection/records/:id
 *  - POST /api/collections/:collection/records (JSON or multipart)
 *  - PATCH /api/collections/:collection/records/:id
 *  - DELETE /api/collections/:collection/records/:id
 *  - POST /api/collections/:collection/auth-with-password
 *  - POST /api/admins/auth-with-password
 *
 * File URLs (`pb.files.getURL`) are pure client-side string building, so no
 * HTTP route is needed for them.
 */

export interface MockRecord {
  id: string;
  collectionId: string;
  collectionName: string;
  created: string;
  updated: string;
  [key: string]: unknown;
}

export interface LoggedRequest {
  method: string;
  pathname: string;
  query: Record<string, string>;
}

function record(
  collectionName: string,
  id: string,
  fields: Record<string, unknown>,
  index: number,
): MockRecord {
  return {
    id,
    collectionId: `coll_${collectionName}`,
    collectionName,
    created: `2024-01-${String(index + 1).padStart(2, "0")} 10:00:00.000Z`,
    updated: `2024-01-${String(index + 1).padStart(2, "0")} 10:00:00.000Z`,
    ...fields,
  };
}

function seedPosts(): MockRecord[] {
  return [1, 2, 3, 4, 5].map((n, i) =>
    record("Posts", `post${n}`, {
      Title: `Test Post ${n}`,
      Thumbnail: `thumb${n}.png`,
      Markdown: `# Post ${n}`,
      Html: `<h1>Post ${n}</h1>`,
      Color: "#F8C76A",
      tagName: ["tag1"],
    }, i),
  );
}

function seedTags(): MockRecord[] {
  return [1, 2, 3].map((n, i) =>
    record("Tags", `tag${n}`, {
      tagName: `Tag ${n}`,
      Icon: `icon${n}.svg`,
      color: "#cba6f7",
    }, i),
  );
}

function seedProjects(): MockRecord[] {
  return [1, 2].map((n, i) =>
    record("Projects", `proj${n}`, {
      Title: `Test Project ${n}`,
      Thumbnail: `proj${n}.png`,
      Markdown: `# Project ${n}`,
      Html: `<h1>Project ${n}</h1>`,
      Color: "#89dceb",
      Tags: ["tag1"],
      ProjectTag: "tag1",
    }, i),
  );
}

export interface MockPocketBase {
  url: string;
  requests: LoggedRequest[];
  close: () => void;
}

export function createMockPocketBase(): MockPocketBase {
  const store: Record<string, MockRecord[]> = {
    Posts: seedPosts(),
    Tags: seedTags(),
    Projects: seedProjects(),
  };
  const requests: LoggedRequest[] = [];
  let created = 0;

  const json = (data: unknown, status = 200) =>
    Response.json(data, { status });
  const notFound = (message = "The requested resource wasn't found.") =>
    json({ code: 404, message, data: {} }, 404);

  const server = Bun.serve({
    port: 0,
    async fetch(req) {
      const parsed = new URL(req.url);
      const query: Record<string, string> = {};
      parsed.searchParams.forEach((v, k) => {
        query[k] = v;
      });
      requests.push({ method: req.method, pathname: parsed.pathname, query });

      // POST /api/collections/:collection/auth-with-password
      // (the SDK logs admins in via the "_superusers" collection)
      const authMatch = parsed.pathname.match(
        /^\/api\/collections\/([^/]+)\/auth-with-password$/,
      );
      if (req.method === "POST" && authMatch) {
        if (authMatch[1] !== "_superusers") return notFound();
        const body = (await req.json()) as {
          identity?: string;
          password?: string;
        };
        if (body.identity === "admin@test.dev" && body.password === "secret") {
          return json({
            token: "test-admin-token",
            record: {
              id: "admin1",
              collectionName: "_superusers",
              email: "admin@test.dev",
            },
          });
        }
        return json(
          { code: 400, message: "Failed to authenticate.", data: {} },
          400,
        );
      }

      // Collection record routes
      const match = parsed.pathname.match(
        /^\/api\/collections\/([^/]+)\/records(?:\/([^/]+))?$/,
      );
      if (!match) {
        if (req.method === "GET" && parsed.pathname === "/api/health") {
          return json({
            message: "API connected successfully.",
            code: 200,
            data: {},
          });
        }
        return notFound();
      }
      const [, collection, id] = match;
      const rows = store[collection];
      if (!rows) return notFound();

      if (req.method === "GET" && !id) {
        const page = Math.max(1, parseInt(query.page ?? "1", 10) || 1);
        const perPage = Math.max(
          1,
          parseInt(query.perPage ?? "30", 10) || 30,
        );
        const start = (page - 1) * perPage;
        return json({
          page,
          perPage,
          totalItems: rows.length,
          totalPages: Math.max(1, Math.ceil(rows.length / perPage)),
          items: rows.slice(start, start + perPage),
        });
      }

      if (req.method === "GET" && id) {
        const found = rows.find((r) => r.id === id);
        return found ? json(found) : notFound();
      }

      if (req.method === "POST" && !id) {
        created += 1;
        const contentType = req.headers.get("content-type") ?? "";
        let fields: Record<string, unknown> = {};
        if (contentType.includes("multipart/form-data")) {
          const form = await req.formData();
          for (const [key, value] of form.entries()) {
            if (typeof value !== "string") {
              const file = value as File;
              fields[key] = { name: file.name, size: file.size };
            } else if (key in fields) {
              const prev = fields[key];
              fields[key] = Array.isArray(prev)
                ? [...prev, value]
                : [prev, value];
            } else {
              fields[key] = value;
            }
          }
        } else {
          fields = (await req.json()) as Record<string, unknown>;
        }
        const createdRecord = record(
          collection,
          `test_${created}`,
          fields,
          rows.length,
        );
        rows.push(createdRecord);
        return json(createdRecord);
      }

      if ((req.method === "PATCH" || req.method === "PUT") && id) {
        const found = rows.find((r) => r.id === id);
        if (!found) return notFound();
        const patch = (await req.json()) as Record<string, unknown>;
        Object.assign(found, patch, { id: found.id });
        return json(found);
      }

      if (req.method === "DELETE" && id) {
        const index = rows.findIndex((r) => r.id === id);
        if (index === -1) return notFound();
        rows.splice(index, 1);
        return new Response(null, { status: 204 });
      }

      return notFound();
    },
  });

  return {
    url: `http://127.0.0.1:${server.port}`,
    requests,
    close: () => server.stop(),
  };
}
