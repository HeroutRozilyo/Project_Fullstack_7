// UserContext.js
import { createContext, useContext, useState } from "react";

const UserContext = createContext();

export function useUserContext() {
  return useContext(UserContext);
}

export function UserProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // Make sure setSelectedUser is defined here

  return (
    <UserContext.Provider
      value={{ users, setUsers, selectedUser, setSelectedUser }}
    >
      {children}
    </UserContext.Provider>
  );
}
