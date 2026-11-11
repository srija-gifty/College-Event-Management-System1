import { useEffect, useState } from "react";
import { api } from "./api.js";

// Student page: view events and register
export default function Events() {
  const [events, setEvents] = useState([]);
  const [selected, setSelected] = useState(null); // event being registered for
  const [form, setForm] = useState({ name: "", rollNo: "", email: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    api("/api/events").then(setEvents);
  }, []);

  const register = async (e) => {
    e.preventDefault();
    try {
      await api("/api/registrations", "POST", { ...form, event: selected._id });
      setMessage("Registered successfully for " + selected.title + "!");
      setSelected(null);
      setForm({ name: "", rollNo: "", email: "" });
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div>
      <h2>Upcoming Events</h2>
      {message && <p className="message">{message}</p>}
      {events.length === 0 && <p>No events yet.</p>}

      <div className="grid">
        {events.map((ev) => (
          <div className="card" key={ev._id}>
            <span className="tag">{ev.category}</span>
            <h3>{ev.title}</h3>
            <p>{ev.description}</p>
            <p>📅 {new Date(ev.date).toLocaleDateString()}</p>
            <p>📍 {ev.venue}</p>
            <button onClick={() => { setSelected(ev); setMessage(""); }}>Register</button>
          </div>
        ))}
      </div>

      {selected && (
        <form className="box" onSubmit={register}>
          <h3>Register for {selected.title}</h3>
          <input placeholder="Full name" required value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input placeholder="Roll number" required value={form.rollNo}
            onChange={(e) => setForm({ ...form, rollNo: e.target.value })} />
          <input type="email" placeholder="Email" required value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <button type="submit">Submit</button>
          <button type="button" className="grey" onClick={() => setSelected(null)}>Cancel</button>
        </form>
      )}
    </div>
  );
}
