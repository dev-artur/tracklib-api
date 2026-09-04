import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { buildApp } from "./app.js";
import { pool } from "./db.js";

const app = buildApp({ logger: false });

beforeEach(async () => {
    await pool.query("TRUNCATE tracks RESTART IDENTITY");
});

afterAll(async () => {
    await app.close();
    await pool.end();
});

const defaults = { title: "Test track", artist: "Test artist", genre: "rock", tags: [] }

async function createTrack(overrides = {}) {
  const res = await app.inject({ method: "POST", url: "/tracks", payload: { ...defaults, ...overrides } });
  expect(res.statusCode).toBe(201);
  return res.json();
}

describe("POST /tracks", () => {
    it("creates a track and returns it with an id", async () => {
        const res = await app.inject({
            method: "POST",
            url: "/tracks",
            payload: { title: "From the Inside", artist: "Linkin Park", genre: "rock", tags: ["rock"] } 
        })
        expect(res.statusCode).toBe(201);
        const created = res.json();
        expect(created.id).toBe(1);
        expect(created.title).toBe("From the Inside");

        const getRes = await app.inject({ method: "GET", url: `/tracks/${created.id}` });
        expect(getRes.statusCode).toBe(200);
        expect(getRes.json()).toEqual(created);
    });
    it("sets album and bpm to null when they are omitted", async () => {
        const track = await createTrack()
        expect(track.bpm).toBeNull();
        expect(track.album).toBeNull();
    })
});

describe("GET /tracks", () => {
    it("returns an empty list when there are no tracks", async () => {
        const res = await app.inject({ method: "GET", url: "/tracks" });
        expect(res.statusCode).toBe(200);
        expect(res.json()).toEqual({ tracks: [] });
    })
    it("returns all tracks ordered by id", async () => {
        const track1 = await createTrack({ title: "From the Inside" });
        const track2 = await createTrack({ title: "Numb" });
        expect(track1.id).toBe(1);
        expect(track1.title).toBe("From the Inside");
        expect(track2.id).toBe(2);
        expect(track2.title).toBe("Numb");

        const getTracks = await app.inject({ method: "GET", url: "/tracks" });
        expect(getTracks.statusCode).toBe(200);
        expect(getTracks.json()).toEqual({ tracks: [track1, track2] });
    });
});

describe("PUT /tracks/:id", () => {
    it("updates a track and returns the updated version", async () => {
        const track = await createTrack({ title: "From the Inside" })
        const res = await app.inject({
            method: "PUT",
            url: `/tracks/${track.id}`,
            payload: { title: "Numb", artist: "Linkin Park", genre: "rock", tags: ["rock"] }
        });
        expect(res.statusCode).toBe(200);
        expect(res.json().title).toBe("Numb");

        const getRes = await app.inject({ method: "GET", url: `/tracks/${track.id}` });
        expect(getRes.statusCode).toBe(200);
        expect(getRes.json()).toEqual(res.json());
    })
    it("returns 404 when the track does not exist", async () => {
        const res = await app.inject({
            method: "PUT",
            url: `/tracks/999`,
            payload: { title: "Numb", artist: "Linkin Park", genre: "rock", tags: ["rock"] }
        });
        expect(res.statusCode).toBe(404);
    })
});

describe("DELETE /tracks/:id", () => {
    it("returns 204 and the track is gone", async () => {
        const track = await createTrack()
        const res = await app.inject({ method: "DELETE", url: `/tracks/${track.id}` });
        expect(res.statusCode).toBe(204);

        const getRes = await app.inject({ method: "GET", url: `/tracks/${track.id}` });
        expect(getRes.statusCode).toBe(404);
    })
    it("returns 404 when the track does not exist", async () => {
        const res = await app.inject({ method: "DELETE", url: `/tracks/999` });
        expect(res.statusCode).toBe(404);
    })
})