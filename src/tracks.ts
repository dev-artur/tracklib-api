export type Track = {
    id: number;
    title: string;
    album?: string;
    artist: string;
    bpm?: number;
    genre: string;
    tags: string[];
}

export const tracks: Track[] = [
    {id: 1, title: "From the Inside", album: "Meteora", artist: "Linkin Park", genre: "rock", tags: ["rock", "grange"]},
    {id: 2, title: "Круги на воде", album: "Septima", artist: "СЛОТ", genre: "rock", tags: ["rock", "ru"]},
    {id: 3, title: "SoulFood", album: "InLovingMemory", artist: "Bones", genre: "rap", tags: ["rap", "cloud"]},
    {id: 4, title: "Ginseng Strip 2002", artist: "Yung Lean", genre: "rap", tags: ["rap", "cloud"], bpm: 115},
];

export function nextId(): number {
    if (!tracks.length) return 1
    return Math.max(...tracks.map((t) => t.id)) + 1
}