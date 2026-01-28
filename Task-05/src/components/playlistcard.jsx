import { Link } from "react-router-dom";
import '../styles/playlistcard.css';

function PlaylistCard({ song, onClick }) {
    return (
        <div className="playlist-card" onClick={onClick}>
            <img src={song?.artworkUrl100 || "/src/assets/music.png"} />
            <p>{song?.trackName || "Title"}</p>
            <p>{song?.artistName || "Artist"}</p>
        </div>
    );
}
export default PlaylistCard;