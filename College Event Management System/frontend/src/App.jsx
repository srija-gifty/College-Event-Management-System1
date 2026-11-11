import { useState } from "react";
import Events from "./Events.jsx";
import Admin from "./Admin.jsx";

export default function App() {
  const [page, setPage] = useState("events");

  return (
    <div className="container">
      <header>
        <h1>College Event Management System</h1>
        <nav>
          <button className={page === "events" ? "active" : ""} onClick={() => setPage("events")}>
            Events
          </button>
          <button className={page === "admin" ? "active" : ""} onClick={() => setPage("admin")}>
            Admin
          </button>
        </nav>
      </header>
      {page === "events" ? <Events /> : <Admin />}
    </div>
  );
}
