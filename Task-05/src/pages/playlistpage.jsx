import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/home.css";
import "../styles/createplaylist.css";
import Sidebar from "../components/sidebar.jsx";
import Searchbar from "../components/searchbar.jsx";
import PlaylistCard from "../components/playlistcard.jsx";
import Playing from "../components/playing.jsx";
import BottomPlayer from "../components/bottomplayer.jsx";

function PlaylistPage() {
    const { playlistId } = useParams();
    const navigate = useNavigate();
    const userId = parseInt(localStorage.getItem("userId"), 10);

    const [playlistInfo, setPlaylistInfo] = useState(null);
    const [tracks, setTracks] = useState([]);
    const [currentSong, setCurrentSong] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(new Audio());

    const loadPlaylist = async () => {
        if (!userId) {
            navigate("/");
            return;
        }
        try {
            const res = await fetch(
                `http://127.0.0.1:5000/api/playlists/${playlistId}?user_id=${userId}`
            );
            const data = await res.json();

            if (!res.ok) {
                console.error("Failed to load playlist", data);
                return;
            }

            setPlaylistInfo(data.playlist);

            const mapped = (data.tracks || []).map((t) => ({
                trackId: t.track_id,
                trackName: t.track_name,
                artistName: t.artist_name,
                artworkUrl100: t.artwork_url,
                previewUrl: t.preview_url,
            }));
            setTracks(mapped);
        } catch (err) {
            console.error("Failed to load playlist", err);
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

    const addCurrentToPlaylist = async () => {
        if (!currentSong || !userId) return;
        try {
            const res = await fetch(
                `http://127.0.0.1:5000/api/playlists/${playlistId}/tracks`,
                {
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
                }
            );
            if (!res.ok) {
                const data = await res.json();
                console.error("Failed to add track", data);
                return;
            }

            setTracks((prev) => {
                const exists = prev.some(
                    (t) => t.trackId === currentSong.trackId
                );
                if (exists) return prev;
                return [currentSong, ...prev];
            });
        } catch (err) {
            console.error("Failed to add track to playlist", err);
        }
    };

    const skipNext = () => {};
    const skipPrev = () => {};

    useEffect(() => {
        loadPlaylist();

        const handleEnded = () => setIsPlaying(false);
        const audio = audioRef.current;
        audio.addEventListener("ended", handleEnded);

        return () => {
            audio.removeEventListener("ended", handleEnded);
            audio.pause();
            audio.src = "";
        };
    }, [playlistId]);

    return (
        <div className="home-page-layout">
            <Sidebar />

            <main className="main-content-area">
                <Searchbar onSongSelect={playSong} />

                <div className="content-inner-container">
                    <section className="grid-section">
                        <h2 className="section-title1">
                            {playlistInfo ? playlistInfo.name : "Playlist"}
                        </h2>
                        {playlistInfo?.description && (
                            <p className="playlist-desc">
                                {playlistInfo.description}
                            </p>
                        )}

                        {tracks.length === 0 ? (
                            <p className="playlist-empty">
                                No tracks in this playlist yet. Search above,
                                play a song, then use the button to add it.
                            </p>
                        ) : (
                            <div className="recently-played-grid">
                                {tracks.map((song) => (
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
                    onAddToLiked={addCurrentToPlaylist} 
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

export default PlaylistPage;
