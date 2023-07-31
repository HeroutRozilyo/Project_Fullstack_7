import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import "../css/info.css";
import profilePicture from "../playListImage/profileImage.png";
import { Link, useNavigate, useParams } from "react-router-dom";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

import { useLocation } from "react-router-dom";
import { useUserContext } from "./useContext.js"; // Replace the path with the correct location of UserContext.js

function InfoAdmin() {
  const {selectedUser }= useUserContext();
  const id=useParams().userID;
   let user=selectedUser;
   if(!user){
    const storedUser = localStorage.getItem("userAdmin");
  if (storedUser) {
    user=JSON.parse(storedUser);
   }
  }
  else{
    localStorage.removeItem("userAdmin");
    localStorage.setItem("userAdmin", JSON.stringify(user));
  }
   
  user.Dob = new Date(user.Dob).toISOString().split("T")[0];
  console.log(user);
  const history = useNavigate();
  const [editableFields, setEditableFields] = useState({
    UserName: false,
    Email: false,
    Dob: false,
    Gender: false,
    CardNo: false,
    UserPassword: false,
  });
  const [updatedFields, setUpdatedFields] = useState({
    UserName: user.UserName,
    Email: user.Email,
    Dob: user.Dob,
    Gender: user.Gender,
    CardNo: user.CardNo,
    UserPassword: user.UserPassword,
  });
  useEffect(() => {
    // Create a copy of the 'user' object with the updated fields
    const updatedUser = {
      ...user,
      UserName: updatedFields.UserName,
      Email: updatedFields.Email,
      Dob: updatedFields.Dob,
      Gender: updatedFields.Gender,
      CardNo: updatedFields.CardNo,
      UserPassword: updatedFields.UserPassword,
    };

    // Update the 'user' variable
    user=updatedUser;
  }, [updatedFields]);

  const handleEdit = (field) => {
    setEditableFields((prevEditableFields) => ({
      ...prevEditableFields,
      [field]: true,
    }));
  };

  const handleInputChange = (e, field) => {
    const { value } = e.target;

    // Check if the field is 'Dob' (Date of Birth)
    if (field === "Dob") {
      // Convert the date value to the format 'YYYY-MM-DD'
      const formattedDate = new Date(value).toISOString().split("T")[0];
      setUpdatedFields((prevUpdatedFields) => ({
        ...prevUpdatedFields,
        [field]: formattedDate,
      }));
      setEditableFields((prevEditableField) => ({
        ...prevEditableField,
        [field]: formattedDate,
      }));
    } else {
      setUpdatedFields((prevUpdatedFields) => ({
        ...prevUpdatedFields,
        [field]: value,
      }));
      setEditableFields((prevEditableField) => ({
        ...prevEditableField,
        [field]: value,
      }));
    }
    localStorage.removeItem("userAdmin");
    localStorage.setItem("userAdmin", JSON.stringify(updatedFields));
  };
  // Assuming this code is inside the component where you want to handle the save operation
  const handleSave = async (field) => {
    try {
      const res = await fetch(`http://localhost:3001/api/user/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...updatedFields,
          UserId: user.UserId, // Make sure to include the UserId in the request body
        }),
      });
      const data = await res.json();

      if (res.ok) {
        // Update local storage with the updated field
        const updatedUser = { ...user, [field]: updatedFields[field] };
        localStorage.setItem("user", JSON.stringify(updatedUser));

        setEditableFields((prevEditableFields) => ({
          ...prevEditableFields,
          [field]: false,
        }));
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleDeleteUser = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/user/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        // Step 3: Clear the user data from local storage
        localStorage.removeItem("user");

        // Step 4: Redirect the user to the login page or any other desired page
        // (You can use react-router's useNavigate hook or history object to navigate)
        // Replace '/login' with the desired page URL
        history("/login");
      } else {
        throw new Error("Failed to delete user and data");
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleGenderChange = (e) => {
    const { value } = e.target;
    setUpdatedFields((prevUpdatedFields) => ({
      ...prevUpdatedFields,
      Gender: value,
    }));
  };

  const handlePasswordSave = async () => {
    const { password, confirmPassword } = updatedFields;

    if (password !== confirmPassword) {
      alert("New password and password confirmation do not match");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:3001/api/user/password/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password }),
        }
      );
      const data = await res.json();

      if (res.ok) {
        // Password updated successfully
        alert("The password has been changed successfully!");
        setEditableFields((prevEditableFields) => ({
          ...prevEditableFields,
          password: false,
        }));

        setUpdatedFields((prevUpdatedFields) => ({
          ...prevUpdatedFields,
          password: "",
          confirmPassword: "",
        }));
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };
// Function to be executed before the page is refreshed
// const handleBeforeUnload = () => {
//   localStorage.setItem("userAdmin", JSON.stringify(updatedFields));
// };

// useEffect(() => {
//   // Add the event listener for beforeunload
//   window.addEventListener("beforeunload", handleBeforeUnload);

//   // Clean up the event listener when the component unmounts
//   return () => {
//     window.removeEventListener("beforeunload", handleBeforeUnload);
//   };
// }, [updatedFields]); // Empty dependency array to ensure it runs only once
  return (
    <div className="profile">
      <div className="profile-picture">
        <img src={profilePicture} alt="Profile Picture" />
      </div>
      <div className="profile-info">
        <p>
          <span className="edit-icon-container">
            Name:{" "}
            {editableFields.UserName ? (
              <>
                <input
                  type="text"
                  value={updatedFields.UserName}
                  onChange={(e) => handleInputChange(e, "UserName")}
                />
                <button
                  className="save-button"
                  onClick={() => handleSave("UserName")}
                >
                  Save
                </button>
              </>
            ) : (
              <>
                {user.UserName}
                <FontAwesomeIcon
                  icon={faPencilAlt}
                  className="edit-icon"
                  onClick={() => handleEdit("UserName")}
                />
              </>
            )}
          </span>
        </p>
        <p>
          <span className="edit-icon-container">Email:{user.Email}</span>
        </p>
        <p>
          <span className="edit-icon-container">
            Date of Birth:{" "}
            {editableFields.Dob ? (
              <>
                <input
                  type="date"
                  value={updatedFields.Dob}
                  onChange={(e) => handleInputChange(e, "Dob")}
                />
                <button
                  className="save-button"
                  onClick={() => handleSave("Dob")}
                >
                  Save
                </button>
              </>
            ) : (
              <>
                {user.Dob}
                <FontAwesomeIcon
                  icon={faPencilAlt}
                  className="edit-icon"
                  onClick={() => handleEdit("Dob")}
                />
              </>
            )}
          </span>
        </p>
        <p>
          <span className="edit-icon-container">
            Gender:{" "}
            {editableFields.Gender ? (
              <>
                <select
                  id="Gender"
                  value={updatedFields.Gender}
                  onChange={handleGenderChange}
                >
                  <option value="">Select Gender</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                </select>
                <button
                  className="save-button"
                  onClick={() => handleSave("Gender")}
                >
                  Save
                </button>
              </>
            ) : (
              <>
                {user.Gender === "M" ? "Male" : "Female"}
                <FontAwesomeIcon
                  icon={faPencilAlt}
                  className="edit-icon"
                  onClick={() => handleEdit("Gender")}
                />
              </>
            )}
          </span>
        </p>

        <p>
          <span className="edit-icon-container">
            Card Number:{" "}
            {editableFields.CardNo ? (
              <>
                <input
                  type="text"
                  value={updatedFields.CardNo}
                  onChange={(e) => handleInputChange(e, "CardNo")}
                />
                <button
                  className="save-button"
                  onClick={() => handleSave("CardNo")}
                >
                  Save
                </button>
              </>
            ) : (
              <>
                {user.CardNo}
                <FontAwesomeIcon
                  icon={faPencilAlt}
                  className="edit-icon"
                  onClick={() => handleEdit("CardNo")}
                />
              </>
            )}
          </span>
        </p>
        <p>
          <span className="edit-icon-container">
            Password:{" "}
            {editableFields.password ? (
              <>
                <input
                  type="password"
                  placeholder="New Password"
                  value={updatedFields.password}
                  onChange={(e) => handleInputChange(e, "password")}
                />
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  value={updatedFields.confirmPassword}
                  onChange={(e) => handleInputChange(e, "confirmPassword")}
                />
                <button className="save-button" onClick={handlePasswordSave}>
                  Save
                </button>
              </>
            ) : (
              <FontAwesomeIcon
                icon={faPencilAlt}
                className="edit-icon"
                onClick={() => handleEdit("password")}
              />
            )}
          </span>
        </p>
      </div>
      <button className="delete-user-button" onClick={handleDeleteUser}>
        Delete User and Data
      </button>
    </div>
  );
}

export default InfoAdmin;
