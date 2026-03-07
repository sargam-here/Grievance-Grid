import React, { useState } from "react";
import { createGrievance } from "../services/api";

function CreateGrievance() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = await createGrievance(title, description, location);

    if (data.grievance) {
      alert("Grievance Submitted Successfully!");
      setTitle("");
      setDescription("");
      setLocation("");
    } else {
      alert(data.message || "Error submitting grievance");
    }
  };

  const detectLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {

      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      const mapLink = `https://www.google.com/maps?q=${lat},${lng}`;

      setLocation(mapLink);

    });
  } else {
    alert("Geolocation not supported");
  }
};

  return (
    <div>
      <h2>Create Grievance</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <br /><br />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <br /><br />

        <button type="submit">Submit</button>

         <br /><br />

        <button type="button" onClick={detectLocation}>
  Detect Location
</button>


<br /><br />

<input
  placeholder="Location"
  value={location}
  readOnly
/>
      </form>
    </div>
  );
}

export default CreateGrievance;