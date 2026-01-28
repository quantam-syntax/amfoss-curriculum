import React, { useState, useRef, useEffect } from "react";
import "../styles/home.css";
import Sidebar from "../components/sidebar.jsx";
import Searchbar from "../components/searchbar.jsx";
import PlaylistCard from "../components/playlistcard.jsx";
import Playing from "../components/playing.jsx";
import BottomPlayer from "../components/bottomplayer.jsx";

function Home() {
    const [currentSong, setCurrentSong] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [recent, setRecent] = useState([]);
    const audioRef = useRef(new Audio());

    const userId = parseInt(localStorage.getItem("userId"), 10);

    const loadRecent = async () => {
        if (!userId) {
            console.warn("No userId in localStorage, cannot load recent");
            setRecent([]);
            return;
        }

        try {
            const res = await fetch(
                `http://127.0.0.1:5000/api/recently-played?user_id=${userId}&limit=7`
            );
            const data = await res.json();

            if (!res.ok || !Array.isArray(data)) {
                console.error("Failed to load recently played:", data);
                setRecent([]);
                return;
            }

            const mapped = data.map((s) => ({
                trackId: s.track_id,
                trackName: s.track_name,
                artistName: s.artist_name,
                artworkUrl100: s.artwork_url,
                previewUrl: s.preview_url,
            }));

            setRecent(mapped);
        } catch (err) {
            console.error("Failed to load recently played", err);
        }
    };

    const playSong = async (song) => {
        if (!song?.previewUrl) return;

        try {
            audioRef.current.src = song.previewUrl;
            await audioRef.current.play();
            setCurrentSong(song);
            setIsPlaying(true);

            setRecent((prev) => {
                const filtered = prev.filter((s) => s.trackId !== song.trackId);
                return [song, ...filtered].slice(0, 7);
            });

            if (userId) {
                fetch("http://127.0.0.1:5000/api/recently-played", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        user_id: userId,
                        track_id: song.trackId,
                        track_name: song.trackName,
                        artist_name: song.artistName,
                        artwork_url: song.artworkUrl100,
                        preview_url: song.previewUrl,
                    }),
                }).catch((err) => console.error("Failed to save recent", err));
            }
        } catch (err) {
            console.error("Failed to play song", err);
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

    const addToLiked = async () => {
        if (!currentSong || !userId) return;

        try {
            await fetch("http://127.0.0.1:5000/api/liked", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: userId,
                    track_id: currentSong.trackId,
                    track_name: currentSong.trackName,
                    artist_name: currentSong.artistName,
                    artwork_url: currentSong.artworkUrl100,
                    preview_url: currentSong.previewUrl,
                }),
            });
        } catch (err) {
            console.error("Failed to add to liked", err);
        }
    };

    const skipNext = () => {};
    const skipPrev = () => {};

    useEffect(() => {
        loadRecent();

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
    const playlistData = [1, 2, 3, 4, 5, 6, 7];

    return (
        <div className="home-page-layout">
            <Sidebar />

            <main className="main-content-area">
                <Searchbar onSongSelect={playSong} />

                <div className="content-inner-container">
                    <section className="grid-section">
                        <h2 className="section-title1">Recently Played</h2>

                        {recent.length === 0 ? (
                            <p className="no-recent">No songs played yet</p>
                        ) : (
                            <div className="recently-played-grid">
                                {recent.map((song) => (
                                    <PlaylistCard
                                        key={song.trackId}
                                        song={song}
                                        onClick={() => playSong(song)}
                                    />
                                ))}
                            </div>
                        )}

                        <h2 className="section-title2">Playlist</h2>
                        <div className="playlist-grid">
                            {playlistData.map((i) => (
                                <PlaylistCard key={`play1-${i}`} />
                            ))}
                            {playlistData.map((i) => (
                                <PlaylistCard key={`play2-${i}`} />
                            ))}
                        </div>
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
                    onAddToLiked={addToLiked}
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

export default Home;
