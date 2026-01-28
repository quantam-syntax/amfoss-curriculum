import { Link } from "react-router-dom";
import "../styles/sidebar.css";

import logoImg from "../assets/logo.png";
import homeImg from "../assets/home-button.png";
import likedImg from "../assets/heart.png";
import plusImg from "../assets/plus-sign.png";

function Sidebar() {
    return (
        <div className="sidebar-container">
            <div className="sidebar-logo">
                <img src={logoImg} className="logo" alt="Logo" />
            </div>

            <button className="home-logo">
                <Link to="/home">
                    <img src={homeImg} className="home-image" alt="Home" />
                </Link>
            </button>

            <button className="liked-songs">
                <Link to="/liked">
                    <img src={likedImg} className="likedsongimage" alt="Likedsongs" />
                </Link>
            </button>

            <button className="playlist">
                <Link to="/createplaylist">
                    <img
                        src={plusImg}
                        className="playlistimage"
                        alt="Createplaylist"
                    />
                </Link>
            </button>
        </div>
    );
}

export default Sidebar;
