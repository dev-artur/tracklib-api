CREATE TABLE IF NOT EXISTS tracks (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    album TEXT,
    artist TEXT NOT NULL,
    bpm INTEGER,
    genre TEXT NOT NULL,
    tags TEXT[] NOT NULL DEFAULT '{}'
);