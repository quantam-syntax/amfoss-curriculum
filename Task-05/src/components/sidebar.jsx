import { Link } from "react-router-dom";
import '../styles/sidebar.css'
function Sidebar(){
    return(
        <div className="sidebar-container">
            <div className="sidebar-logo">
                <img src="src/assets/logo.png"className="logo" alt="Logo"/>
            </div>
            <button className="home-logo">
                <Link to='/home'>
                    <img src="src/assets/home-button.png"className="home-image" alt="Home"/>
                </Link>
            </button>
            <button className="liked-songs">
                <Link to='/liked'>
                    <img src="src/assets/heart.png"className="likedsongimage" alt="Likedsongs"/>
                </Link>
            </button>
            <button className="playlist">
                <Link to='/playlists'>
                    <img src="src/assets/lib.png"className="playlistimage" alt="Createplaylist"/>
                </Link>
            </button>
        </div>

    )
}
export default Sidebar;