import { useEffect, useState } from "react";
import { api } from "./api.js";

const emptyEvent = { title: "", category: "Technical", description: "", date: "", venue: "" };

// Admin page: login, manage events, view participants, mark attendance
export default function Admin() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [login, setLogin] = useState({ username: "", password: "" });
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState(emptyEvent);
  const [editId, setEditId] = useState(null);
  const [viewing, setViewing] = useState(null); // event whose participants are shown
  const [participants, setParticipants] = useState([]);
  const [error, setError] = useState("");

  const loadEvents = () => api("/api/events").then(setEvents);
  useEffect(() => { if (token) loadEvents(); }, [token]);

  const doLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await api("/api/admin/login", "POST", login);
      localStorage.setItem("token", data.token);
      setToken(data.token);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  const logout = () => { localStorage.removeItem("token"); setToken(""); };

  const saveEvent = async (e) => {
    e.preventDefault();
    try {
      if (editId) await api(`/api/events/${editId}`, "PUT", form, token);
      else await api("/api/events", "POST", form, token);
      setForm(emptyEvent);
      setEditId(null);
      setError("");
      loadEvents();
    } catch (err) {
      setError(err.message);
      if (err.message.includes("login")) logout();
    }
  };

  const startEdit = (ev) => {
    setEditId(ev._id);
    setForm({ ...ev, date: ev.date.slice(0, 10) });
  };

  const deleteEvent = async (id) => {
    if (!confirm("Delete this event?")) return;
    await api(`/api/events/${id}`, "DELETE", null, token);
    loadEvents();
  };

  const showParticipants = async (ev) => {
    setViewing(ev);
    setParticipants(await api(`/api/registrations/event/${ev._id}`, "GET", null, token));
  };

  const toggleAttendance = async (p) => {
    await api(`/api/registrations/${p._id}/attendance`, "PUT", { attended: !p.attended }, token);
    showParticipants(viewing);
  };

  if (!token) {
    return (
      <form className="box" onSubmit={doLogin}>
        <h2>Admin Login</h2>
        {error && <p className="error">{error}</p>}
        <input placeholder="Username" value={login.username}
          onChange={(e) => setLogin({ ...login, username: e.target.value })} />
        <input type="password" placeholder="Password" value={login.password}
          onChange={(e) => setLogin({ ...login, password: e.target.value })} />
        <button type="submit">Login</button>
      </form>
    );
  }

  return (
    <div>
      <button className="grey" onClick={logout}>Logout</button>

      <form className="box" onSubmit={saveEvent}>
        <h2>{editId ? "Edit Event" : "Create Event"}</h2>
        {error && <p className="error">{error}</p>}
        <input placeholder="Title" required value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
          {["Technical", "Cultural", "Workshop", "Seminar", "Sports"].map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <textarea placeholder="Description" value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <input type="date" required value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })} />
        <input placeholder="Venue" required value={form.venue}
          onChange={(e) => setForm({ ...form, venue: e.target.value })} />
        <button type="submit">{editId ? "Update" : "Add Event"}</button>
        {editId && (
          <button type="button" className="grey" onClick={() => { setEditId(null); setForm(emptyEvent); }}>
            Cancel
          </button>
        )}
      </form>

      <h2>All Events</h2>
      <table>
        <thead>
          <tr><th>Title</th><th>Category</th><th>Date</th><th>Venue</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {events.map((ev) => (
            <tr key={ev._id}>
              <td>{ev.title}</td>
              <td>{ev.category}</td>
              <td>{new Date(ev.date).toLocaleDateString()}</td>
              <td>{ev.venue}</td>
              <td>
                <button onClick={() => showParticipants(ev)}>Participants</button>
                <button className="grey" onClick={() => startEdit(ev)}>Edit</button>
                <button className="red" onClick={() => deleteEvent(ev._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {viewing && (
        <div>
          <h2>Participants of {viewing.title} ({participants.length})</h2>
          <table>
            <thead>
              <tr><th>Name</th><th>Roll No</th><th>Email</th><th>Attendance</th></tr>
            </thead>
            <tbody>
              {participants.map((p) => (
                <tr key={p._id}>
                  <td>{p.name}</td>
                  <td>{p.rollNo}</td>
                  <td>{p.email}</td>
                  <td>
                    <button className={p.attended ? "" : "grey"} onClick={() => toggleAttendance(p)}>
                      {p.attended ? "Present" : "Absent"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
