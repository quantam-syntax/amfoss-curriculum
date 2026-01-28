import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";      
import "../styles/createplaylist.css";
import Sidebar from "../components/sidebar.jsx";
import BottomPlayer from "../components/bottomplayer.jsx";

function CreatePlaylist() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [playlists, setPlaylists] = useState([]);

    const userId = parseInt(localStorage.getItem("userId"), 10);
    const navigate = useNavigate();                   

    const loadPlaylists = async () => {
        if (!userId) return;

        try {
            const res = await fetch(
                `http://127.0.0.1:5000/api/playlists?user_id=${userId}`
            );
            const data = await res.json();

            if (!res.ok || !Array.isArray(data)) {
                console.error("Failed to load playlists:", data);
                setPlaylists([]);
                return;
            }

            setPlaylists(data);
        } catch (err) {
            console.error("Failed to load playlists", err);
        }
    };

    useEffect(() => {
        loadPlaylists();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!userId) {
            setError("Not logged in.");
            return;
        }

        if (!name.trim()) {
            setError("Playlist name is required");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("http://127.0.0.1:5000/api/playlists", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: userId,
                    name,
                    description,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Failed to create playlist");
            } else {
                navigate(`/playlists/${data.id}`);
                setName("");
                setDescription("");
            }
        } catch (err) {
            console.error(err);
            setError("Could not reach server");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="home-page-layout">
            <Sidebar />

            <main className="main-content-area">
                <div className="content-inner-container">
                    <section className="grid-section playlist-section">
                        <h2 className="section-title1">Create Playlist</h2>

                        <form onSubmit={handleSubmit} className="playlist-form">
                            <div className="playlist-field">
                                <label className="playlist-label">Playlist Name</label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="playlist-input"
                                />
                            </div>

                            <div className="playlist-field">
                                <label className="playlist-label">
                                    Description (optional)
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={3}
                                    className="playlist-textarea"
                                />
                            </div>

                            {error && <p className="playlist-error">{error}</p>}

                            <div className="playlist-actions">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="playlist-submit"
                                >
                                    {loading ? "Creating..." : "Create Playlist"}
                                </button>
                            </div>
                        </form>

                        <h2 className="section-title2">Your Playlists</h2>
                        {playlists.length === 0 ? (
                            <p className="playlist-empty">No playlists yet.</p>
                        ) : (
                            <ul className="playlist-list">
                                {playlists.map((pl) => (
                                    <li
                                        key={pl.id}
                                        className="playlist-item"
                                        onClick={() =>
                                            navigate(`/playlists/${pl.id}`)  // 🔹 CLICK → DETAIL PAGE
                                        }
                                    >
                                        <div className="playlist-name">{pl.name}</div>
                                        {pl.description && (
                                            <div className="playlist-desc">
                                                {pl.description}
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>
                </div>
            </main>

            <BottomPlayer
                currentSong={null}
                isPlaying={false}
                onTogglePlay={() => {}}
                onSkipNext={() => {}}
                onSkipPrev={() => {}}
                audioRef={{ current: null }}
            />
        </div>
    );
}

export default CreatePlaylist;
