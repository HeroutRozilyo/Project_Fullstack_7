// InfoAdmin.js

import React from "react";
import { useLocation } from "react-router-dom";

function InfoAdmin() {
  // Get the location object
  const location = useLocation();
  console.log(location.state);
  // Check if the user object is available in the state
  if (!location.state || !location.state.user) {
    // Handle the case when the user object is not available
    return <div>User not found.</div>;
  }

  // Destructure the user object from the state
  const { user } = location.state;

  return (
    <div>
      <h1>User Details</h1>
      <p>Name: {user.UserName}</p>
      <p>Email: {user.Email}</p>
      {/* Render other user details here */}
    </div>
  );
}

export default InfoAdmin;
