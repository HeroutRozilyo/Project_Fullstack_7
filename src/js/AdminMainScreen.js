import React from "react";
import { Link } from "react-router-dom";
import "../css/Admin.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faMusic, faListUl, faCompactDisc } from "@fortawesome/free-solid-svg-icons";

function AdminMainScreen() {
  return (
    <div className="admin-main-screen">
      <h2>Welcome, Admin!</h2>
      <div className="admin-links">
        <Link to="/admin/users" className="link-card">
          <div className="link-icon">
            <FontAwesomeIcon icon={faUser} />
          </div>
          <div className="link-text">View All Users</div>
        </Link>
        <Link to="/admin/songs" className="link-card">
          <div className="link-icon">
            <FontAwesomeIcon icon={faMusic} />
          </div>
          <div className="link-text">View All Songs</div>
        </Link>
        <Link to="/admin/playlists" className="link-card">
          <div className="link-icon">
            <FontAwesomeIcon icon={faCompactDisc} />
          </div>
          <div className="link-text">View All Playlists</div>
        </Link>
        
      </div>
    </div>
  );
}

export default AdminMainScreen;

