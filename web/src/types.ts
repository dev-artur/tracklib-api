export type Track = {
    id: number;
    title: string;
    artist: string;
    album?: string;
    bpm?: number;
    genre: string;
    tags: string[];
};

export type TrackInput = Omit<Track, "id">;