// UserList.js

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../css/UserList.css";
import { useUserContext } from "../js/useContext.js";
function UserList() {
  const [users, setUsers] = useState([]);
  const { user, setSelectedUser } = useUserContext();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/user/users");
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUsers();
  }, []);
  const handleUserClick = (user1) => {
    setSelectedUser(user1);
  };
  return (
    <div className="container">
      <h1>User List</h1>
      <ul>
        {users.map((user1) => (
          <li key={user1.UserID} className="user-card">
            {/* Pass the user object as state */}
            <Link
              to={`/user/${user1.UserID}`}
              className="user-link"
              onClick={() => handleUserClick(user1)} // Call the handleUserClick function
            >
              <img
                className="avatar"
                src={`https://avatars.dicebear.com/api/bottts/${user1.UserID}.svg`}
                alt="User Avatar"
              />
              <div className="user-info">
                <span className="user-name">{user1.userName}</span>
                <span className="user-email">{user1.Email}</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;
