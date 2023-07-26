import React, { useState } from "react";
import axios from "axios";

function ImageUploader() {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    const formData = new FormData();
    formData.append("image", file);

    axios
      .post("http://localhost:3001/upload", formData)
      .then((response) => {
        console.log(response.data);
        // Handle successful response, e.g., display success message
      })
      .catch((error) => {
        console.error(error);
        // Handle error, e.g., display error message
      });
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}

export default ImageUploader;
