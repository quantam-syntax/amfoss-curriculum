import "../styles/playing.css";

function Playing({
  currentSong,
  isPlaying,
  onTogglePlay,
  onSkipNext,
  onSkipPrev,
  onAddToLiked,
}) {
  return (
    <aside className="right-player-container">
      <div className="album-art-wrapper">
        <img
          src={currentSong?.artworkUrl100 || "/src/assets/music.png"}
          alt="Album Cover"
          className="large-cover"
        />
      </div>

      <div className="track-info">
        <div className="text-meta">
          <h3>{currentSong?.trackName || "Music Name"}</h3>
          <p>{currentSong?.artistName || "Artist Name"}</p>
        </div>
        <button
          className="add-button"
          onClick={onAddToLiked}
          disabled={!currentSong}
        >
          +
        </button>
      </div>

      <div className="main-controls">
        <button className="ctrl-btn" onClick={onSkipPrev}>
          ⏮
        </button>
        <button className="play-btn-circle" onClick={onTogglePlay}>
          {isPlaying ? "⏸" : "▶"}
        </button>
        <button className="ctrl-btn" onClick={onSkipNext}>
          ⏭
        </button>
      </div>
    </aside>
  );
}

export default Playing;
