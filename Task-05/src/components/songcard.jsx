import React from 'react';
import '../styles/songcard.css';

function SongCard({ song }) {
    return (
        <div className="song-card">
            <div className="card-image-wrapper">
                <img 
                    src={song?.image || "/src/assets/music.png"} 
                    alt={song?.title || "Song Title"} 
                />
            </div>
            <div className="card-info">
                <h4 className="song-title">{song?.title || "Untitled Song"}</h4>
                <p className="song-artist">{song?.artist || "Unknown Artist"}</p>
            </div>
        </div>
    );
}

export default SongCard;