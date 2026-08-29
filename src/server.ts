import Fastify from "fastify";
import { tracks, type Track, nextId } from './tracks.js';
import { pool } from "./db.js";

const createTrackSchema = {
  body: {
    type: "object",
    required: ["title", "artist", "genre", "tags"],
    additionalProperties: false,
    properties: {
      title:  { type: "string", minLength: 1 },
      artist: { type: "string", minLength: 1 },
      album:  { type: "string" },
      bpm:    { type: "number", minimum: 20, maximum: 300 },
      genre:  { type: "string", minLength: 1 },
      tags:   { type: "array", items: { type: "string", minLength: 1 } },
    },
  },
} as const;

const idParamSchema = {
  params: {
    type: "object",
    required: ["id"],
    properties: { id: { type: "number" } },
  },
} as const;

const updateTrackSchema = {
  params: idParamSchema.params,
  body: createTrackSchema.body,
} as const;

const app = Fastify({ 
    logger: true,
    ajv: { customOptions: { coerceTypes: true, removeAdditional: false } },
 });

app.get("/health", async () => {
    return  { status: "ok", uptime: process.uptime() };
});

app.get("/tracks", async () => {
    const result = await pool.query("SELECT * FROM tracks ORDER BY id");
    return { tracks: result.rows };
});

app.get("/tracks/:id", { schema: idParamSchema }, async (request, reply) => {
    const { id } = request.params as { id: number };
    const result = await pool.query("SELECT * FROM tracks WHERE id = $1", [id]);
    if (result.rows.length === 0) {
        return reply.code(404).send({ error: "Track not found" });
    }
    return result.rows[0]
});

app.delete("/tracks/:id", { schema: idParamSchema }, async (request, reply) => {
    const { id } = request.params as { id: number };
    const index = tracks.findIndex((t) => t.id === id);
    if (index === -1) {
        return reply.code(404).send({ error: "Track not found" });
    }
    tracks.splice(index, 1)
    return reply.code(204).send();
});

app.put("/tracks/:id", { schema: updateTrackSchema }, async (request, reply) => {
    const { id } = request.params as { id: number };
    const index = tracks.findIndex((t) => t.id === id);
    if (index === -1) {
        return reply.code(404).send({ error: "Track not found" });
    }
    const body = request.body as Omit<Track, "id">;
    const newTrack: Track = { id, ...body };
    tracks[index] = newTrack
    return reply.code(200).send(newTrack);
});

app.post("/tracks", { schema: createTrackSchema }, async (request, reply) => {
  const body = request.body as Omit<Track, "id">;
  const newTrack: Track = { id: nextId(), ...body };
  tracks.push(newTrack);
  return reply.code(201).send(newTrack);
});

const start = async () => {
    try {
        await app.listen({ port: 3000 });
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

start();