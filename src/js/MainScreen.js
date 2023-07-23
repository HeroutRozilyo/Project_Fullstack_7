import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function MainScreen() {
  const { username } = useParams(); // Access the user name from the URL parameters
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch user data from local storage
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUserData = JSON.parse(userData);
      setUser(parsedUserData);
    }
  }, []);

  return (
    <div>
      {user ? (
        <div>
          <h1>Welcome, {username}!</h1>
          {/* Add your main screen content here */}
        </div>
      ) : (
        <h1>User not logged in</h1>
      )}
    </div>
  );
}

export default MainScreen;
