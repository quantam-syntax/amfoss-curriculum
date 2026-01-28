import React, { useEffect, useState, useRef } from "react";
import "../styles/home.css";
import Sidebar from "../components/sidebar.jsx";
import PlaylistCard from "../components/playlistcard.jsx";
import Playing from "../components/playing.jsx";
import BottomPlayer from "../components/bottomplayer.jsx";

function Liked() {
    const [liked, setLiked] = useState([]);
    const [currentSong, setCurrentSong] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(new Audio());
    const userId = parseInt(localStorage.getItem("userId"), 10);

    const loadLiked = async () => {
        if (!userId) {
            console.warn("No userId, user probably not logged in");
            setLiked([]);
            return;
        }

        try {
            const res = await fetch(
                `http://127.0.0.1:5000/api/liked?user_id=${userId}`
            );
            const data = await res.json();

            if (!res.ok || !Array.isArray(data)) {
                setLiked([]);
                return;
            }

            const mapped = data.map((s) => ({
                trackId: s.track_id,
                trackName: s.track_name,
                artistName: s.artist_name,
                artworkUrl100: s.artwork_url,
                previewUrl: s.preview_url,
            }));

            setLiked(mapped);
        } catch (err) {
            console.error("Failed to load liked songs", err);
        }
    };

    const playSong = async (song) => {
        if (!song?.previewUrl) return;
        try {
            audioRef.current.src = song.previewUrl;
            await audioRef.current.play();
            setCurrentSong(song);
            setIsPlaying(true);
        } catch (err) {
            console.error("Failed to play liked song", err);
        }
    };

    const togglePlay = () => {
        if (!currentSong) return;

        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current
                .play()
                .then(() => setIsPlaying(true))
                .catch((err) => console.error("Failed to resume playback", err));
        }
    };

    const skipNext = () => {};
    const skipPrev = () => {};

    useEffect(() => {
        loadLiked();

        const handleEnded = () => setIsPlaying(false);
        const audio = audioRef.current;
        audio.addEventListener("ended", handleEnded);

        return () => {
            audio.removeEventListener("ended", handleEnded);
            audio.pause();
            audio.src = "";
            setIsPlaying(false);
        };
    }, []);


    return (
        <div className="home-page-layout">
            <Sidebar />

            <main className="main-content-area">
                <div className="content-inner-container">
                    <section className="grid-section">
                        <h2 className="section-title1">Liked Songs</h2>

                        {liked.length === 0 ? (
                            <p className="no-recent">You haven't liked any songs yet.</p>
                        ) : (
                            <div className="recently-played-grid">
                                {liked.map((song) => (
                                    <PlaylistCard
                                        key={song.trackId}
                                        song={song}
                                        onClick={() => playSong(song)}
                                    />
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </main>

            <aside className="right-player-sidebar-wrapper">
                <Playing
                    currentSong={currentSong}
                    isPlaying={isPlaying}
                    onTogglePlay={togglePlay}
                    onSkipNext={skipNext}
                    onSkipPrev={skipPrev}
                    onAddToLiked={() => {}}
                />
            </aside>

            <BottomPlayer
                currentSong={currentSong}
                isPlaying={isPlaying}
                onTogglePlay={togglePlay}
                onSkipNext={skipNext}
                onSkipPrev={skipPrev}
                audioRef={audioRef}
            />
        </div>
    );
}

export default Liked;
