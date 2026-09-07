import React, { useState } from "react";
import styles from './TrackForm.module.css';
import { createTrack } from "../../api/tracks";

type TrackFormProps = {
    onCreated: () => void;
};

export const TrackForm = ({ onCreated }: TrackFormProps) => {
    const [title, setTitle] = useState("");
    const [artist, setArtist] = useState("");
    const [album, setAlbum] = useState("");
    const [bpm, setBpm] = useState("");
    const [genre, setGenre] = useState("");
    const [tags, setTags] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            await createTrack({
                title,
                artist,
                genre,
                tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
                ...(album && { album }),
                ...(bpm && { bpm: Number(bpm) }),
            });

            setTitle("");
            setArtist("");
            setAlbum("");
            setBpm("");
            setGenre("");
            setTags("");
            onCreated();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Network error");
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.fields}>
                <div className={styles.field}>
                    <label className={styles.label} htmlFor="title">Title</label>
                    <input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div className={styles.field}>
                    <label className={styles.label} htmlFor="artist">Artist</label>
                    <input id="artist" value={artist} onChange={(e) => setArtist(e.target.value)} required />
                </div>
                <div className={styles.field}>
                    <label className={styles.label} htmlFor="album">Album</label>
                    <input id="album" value={album} onChange={(e) => setAlbum(e.target.value)} />
                </div>
                <div className={styles.field}>
                    <label className={styles.label} htmlFor="bpm">BPM</label>
                    <input id="bpm" value={bpm} onChange={(e) => setBpm(e.target.value)} type="number" />
                </div>
                <div className={styles.field}>
                    <label className={styles.label} htmlFor="genre">Genre</label>
                    <input id="genre" value={genre} onChange={(e) => setGenre(e.target.value)} required />
                </div>
                <div className={styles.field}>
                    <label className={styles.label} htmlFor="tags">Tags</label>
                    <input id="tags" value={tags} onChange={(e) => setTags(e.target.value)} />
                </div>
            </div>
            <button type="submit">Add Track</button>
            {error && <p className={styles.error}>{error}</p>}
        </form>
    );
};
