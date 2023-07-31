import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import "../css/info.css";
import profilePicture from "../playListImage/profileImage.png";
import { Link, useNavigate } from "react-router-dom";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

function Info() {
  const user = JSON.parse(localStorage.getItem("user"));
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
    } else {
      setUpdatedFields((prevUpdatedFields) => ({
        ...prevUpdatedFields,
        [field]: value,
      }));
    }
  };
  // Assuming this code is inside the component where you want to handle the save operation
  const handleSave = async (field) => {
    try {
      const res = await fetch(`http://localhost:3001/api/user/${user.UserID}`, {
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
        `http://localhost:3001/api/user/${user.UserID}`,
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
        `http://localhost:3001/api/user/password/${user.UserID}`,
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
        <FontAwesomeIcon icon={faTrash} className="delete-icon" />
        Delete User
      </button>
    </div>
  );
}

export default Info;
