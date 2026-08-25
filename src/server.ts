import Fastify from "fastify";
import { tracks } from './tracks.js';

const app = Fastify({ logger: true });

app.get("/health", async () => {
    return  { status: "ok", uptime: process.uptime() };
});

app.get("/tracks", async () => {
    return  { tracks: tracks };
});

app.get("/tracks/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const numId = Number(id)
    if (Number.isNaN(numId)) {
        return reply.code(400).send({ error: "Invalid track ID" });
    }
    const track = tracks.find((t) => t.id === numId);
    if (!track) {
        return reply.code(404).send({ error: "Track not found" });
    }
    return track;
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