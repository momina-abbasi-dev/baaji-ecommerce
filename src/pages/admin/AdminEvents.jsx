import { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import { getEvents, createEvent, deleteEvent } from "../../api"; // ✅ import from api.js

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    imageFile: null,
    date: "",
    description: "",
  });

  const token = localStorage.getItem("userToken");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const data = await getEvents();
      setEvents(data);
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.imageFile) {
      alert("Title and image are required!");
      return;
    }

    const form = new FormData();
    form.append("title", formData.title);
    form.append("image", formData.imageFile);
    form.append("date", formData.date);
    form.append("description", formData.description);

    try {
      await createEvent(form, token);
      alert("Event added successfully!");
      setFormData({ title: "", imageFile: null, date: "", description: "" });
      fetchEvents();
    } catch (err) {
      console.error("Error creating event:", err);
      alert("Failed to create event");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await deleteEvent(id, token);
      alert("Event deleted successfully!");
      fetchEvents();
    } catch (err) {
      console.error("Error deleting event:", err);
    }
  };

  return (
    <AdminLayout>
      <div className="admin-events">
        <h2>Manage Events</h2>

        <form onSubmit={handleSubmit} className="add-event-form">
          <input
            type="text"
            name="title"
            placeholder="Event Title"
            value={formData.title}
            onChange={handleChange}
            required
          />
          <input type="file" name="imageFile" accept="image/*" onChange={handleChange} required />
          <input
            type="text"
            name="date"
            placeholder="Date (optional)"
            value={formData.date}
            onChange={handleChange}
          />
          <textarea
            name="description"
            placeholder="Description (optional)"
            value={formData.description}
            onChange={handleChange}
          ></textarea>
          <button type="submit">Add Event</button>
        </form>

        <div className="events-list">
          {events.map((event) => (
            <div key={event._id} className="event-card">
              <img src={event.image} alt={event.title} />
              <div>
                <h3>{event.title}</h3>
                {event.date && <p><b>Date:</b> {event.date}</p>}
                {event.description && <p>{event.description}</p>}
                <button onClick={() => handleDelete(event._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminEvents;