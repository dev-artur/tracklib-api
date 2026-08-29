export type Track = {
    id: number;
    title: string;
    album?: string;
    artist: string;
    bpm?: number;
    genre: string;
    tags: string[];
}

export type TrackInput = Omit<Track, "id">;