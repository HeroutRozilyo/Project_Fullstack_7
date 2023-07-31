import React from "react";
import { Link } from "react-router-dom";
import "../css/AdminMainScreem";
function AdminMainScreen() {
    return (
        <div className="admin-main-screen">
          <h2>Welcome, Admin!</h2>
          <div className="admin-links">
            <Link to="/admin/users" className="link-card">
              <div className="link-icon">👤</div>
              View All Users
            </Link>
            <Link to="/admin/songs" className="link-card">
              <div className="link-icon">🎵</div>
              View All Songs
            </Link>
            <Link to="/admin/playlists" className="link-card">
              <img
                src={require("../path/to/playlist/photo.jpg")}
                alt="Playlist"
                className="link-photo"
              />
              View All Playlists
            </Link>
          </div>
        </div>
      );
    }

export default AdminMainScreen;
