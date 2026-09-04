import { describe, it, expect } from "vitest";
import { buildApp } from "./app.js";

const app = buildApp({ logger: false });

describe("GET /health", () => {
  it("returns ok", async () => {
    const res = await app.inject({ method: "GET", url: "/health" });
    expect(res.statusCode).toBe(200);
    expect(res.json().status).toBe("ok");
  });
});

describe("GET /tracks/abс", () => {
  it("returns 400 when id is not a number", async () => {
    const res = await app.inject({ method: "GET", url: "/tracks/abс" });
    expect(res.statusCode).toBe(400);
  });
});

describe("POST /tracks", () => {
  it("returns 400 when title is missing", async () => {
    const res = await app.inject({ 
      method: "POST", 
      url: "/tracks", 
      payload: { artist: "test", genre: "test", tags: ["test"] }
    });
    expect(res.statusCode).toBe(400);
    expect(res.json().message).toContain("title");
  });
  it("returns 400 when BPM exceeds the maximum", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/tracks",
      payload: { title: "test", artist: "test", genre: "test", tags: ["test"], bpm: 500 }
    });
    expect(res.statusCode).toBe(400);
    expect(res.json().message).toContain("bpm");
  });
  it("returns 400 when extra fields are included", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/tracks",
      payload: { title: "test", artist: "test", genre: "test", tags: ["test"], hacker: true }
    });
    expect(res.statusCode).toBe(400);
    expect(res.json().message).toContain("additional");
  });
});