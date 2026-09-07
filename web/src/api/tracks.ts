import { type Track, type TrackInput } from "../types";

export async function getTracks(): Promise<Track[]> {
    const res = await fetch("/api/tracks");
    if (!res.ok) throw new Error("Failed to load tracks");
    const data = await res.json();
    return data.tracks;
}

export async function createTrack(input: TrackInput): Promise<Track> {
    const res = await fetch("/api/tracks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
    });
    if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to add track");
    }
    return res.json();
}
