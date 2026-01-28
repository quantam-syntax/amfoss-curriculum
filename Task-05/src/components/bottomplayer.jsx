import React from 'react';
import '../styles/bottomplayer.css';

function BottomPlayer({ currentSong, isPlaying, onTogglePlay, onSkipNext, onSkipPrev, audioRef }) {
    const handleVolumeChange = (e) => {
        if (audioRef.current) audioRef.current.volume = e.target.value;
    };

    return (
        <footer className="bottom-player-bar">
            <div className="mini-track-info">
                <img src={currentSong?.artworkUrl100 || "/src/assets/music.png"} alt="thumbnail" className="mini-img" />
                <div className="mini-text">
                    <p className="mini-title">{currentSong?.trackName || "Music Name"}</p>
                    <p className="mini-artist">{currentSong?.artistName || "Music Artist"}</p>
                </div>
            </div>

            <div className="main-controls">
                <button className="ctrl-btn" onClick={onSkipPrev}>⏮</button>
                <button className="play-btn-circle" onClick={onTogglePlay}>
                    {isPlaying ? "⏸" : "▶"}
                </button>
                <button className="ctrl-btn" onClick={onSkipNext}>⏭</button>
            </div>

            <div className="volume-section">
                <span>🔊</span>
                <input type="range" className="volume-slider" min={0} max={1} step={0.01} onChange={handleVolumeChange} />
            </div>
        </footer>
    );
}

export default BottomPlayer;
