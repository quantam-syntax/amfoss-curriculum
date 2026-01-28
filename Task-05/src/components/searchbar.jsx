import React, { useState, useEffect, useRef } from "react";
import "../styles/searchbar.css";

function Searchbar({ onSongSelect }) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setShowResults(false);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    const handleSearch = async (value) => {
        setQuery(value);

        const trimmed = value.trim();
        if (!trimmed) {
            setResults([]);
            setShowResults(false);
            return;
        }

        setLoading(true);
        setShowResults(true);

        try {
            const res = await fetch(
                `http://127.0.0.1:5000/api/search?q=${encodeURIComponent(trimmed)}`
            );
            const data = await res.json();

            if (Array.isArray(data)) {
                setResults(data);
            } else {
                setResults([]);
            }
        } catch (err) {
            console.error("Search failed", err);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    const handleClickSong = (song, e) => {
        e.preventDefault();
        if (onSongSelect) {
            onSongSelect(song);
        }
        setShowResults(false);
    };

    return (
        <div className="search-container" ref={containerRef}>
            <div className="search-pill">
                <span className="search-icon">🔍</span>
                <input
                    type="text"
                    placeholder="What do you want to listen to?"
                    className="search-input"
                    value={query}
                    onChange={(e) => handleSearch(e.target.value)}
                    onFocus={() => {
                        if (results.length > 0) setShowResults(true);
                    }}
                />
            </div>

            {showResults && (
                <div className="search-results">
                    {loading && <div>Loading...</div>}
                    {!loading && results.length === 0 && <div>No songs found</div>}
                    {!loading &&
                        results.map((song) => (
                            <div
                                key={song.trackId}
                                className="track-card"
                                onClick={(e) => handleClickSong(song, e)}
                                style={{ cursor: "pointer" }}
                            >
                                <img src={song.artworkUrl100} alt={song.trackName} />
                                <div className="track-info">
                                    <p>{song.trackName}</p>
                                    <p>{song.artistName}</p>
                                </div>
                            </div>
                        ))}
                </div>
            )}
        </div>
    );
}

export default Searchbar;
 