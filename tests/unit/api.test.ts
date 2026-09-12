import { describe, expect, test } from "bun:test";
import { GET } from "../../src/pages/api/mdtohtml";

describe("GET /api/mdtohtml", () => {
  test("responds 200 with a JSON body", async () => {
    const res = await GET({
      request: new Request("http://localhost/api/mdtohtml?phonenum=123"),
    } as never);
    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toContain("application/json");
    expect(await res.json()).toBe("yabadoo");
  });
});
