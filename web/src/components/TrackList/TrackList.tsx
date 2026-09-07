import { useEffect, useState } from "react";
import styles from './TrackList.module.css';
import { getTracks } from "../../api/tracks";
import { type Track } from "../../types";

export const TrackList = () => {
    const [tracks, setTracks] = useState<Track[] | null>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        getTracks()
            .then(setTracks)
            .catch((err) => setError(err.message));
    }, []);

    if (error) return <div className={styles.TrackList}>{error}</div>
    if (tracks === null) return <div className={styles.TrackList}>Loading...</div>
    if (!tracks.length) return <div className={styles.TrackList}>No tracks yet</div>

    return (
        <ul className={styles.TrackList}>
            {tracks.map((track) => (
                <li key={track.id}>
                    {track.title} - {track.artist}
                </li>
            ))}
        </ul>
    );
};
