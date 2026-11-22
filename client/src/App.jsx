import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, NavLink, useNavigate } from 'react-router-dom';
import api from './api';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import StarBot from './pages/StarBot';

function Background() {
  return (
    <div className="bg">
      <div className="stars" /><div className="stars2" />
      <div className="blob b1" /><div className="blob b2" /><div className="blob b3" />
    </div>
  );
}

function Layout({ children }) {
  const nav = useNavigate();
  const [notes, setNotes] = useState([]);
  const [open, setOpen] = useState(false);
  const load = () => api.get('/notifications').then((r) => setNotes(r.data)).catch(() => {});
  useEffect(() => { load(); const t = setInterval(load, 8000); return () => clearInterval(t); }, []);
  const unread = notes.filter((n) => !n.read).length;

  return (
    <>
      <header className="nav">
        <h1 className="logo">⭐ STARPLOT</h1>
        <nav>
          <NavLink to="/" end>Dashboard</NavLink>
          <NavLink to="/starbot">StarBot</NavLink>
          <NavLink to="/profile">Profile</NavLink>
        </nav>
        <div className="right">
          <button className="bell" onClick={() => { setOpen(!open); if (!open) api.post('/notifications/read').then(load); }}>
            🔔{unread > 0 && <span className="badge">{unread}</span>}
          </button>
          <button className="ghost" onClick={() => { localStorage.clear(); nav('/login'); }}>Logout</button>
        </div>
        {open && (
          <div className="dropdown">
            {notes.length === 0 && <p className="muted">No notifications yet</p>}
            {notes.map((n) => <p key={n._id} className={`note ${n.type}`}>{n.message}</p>)}
          </div>
        )}
      </header>
      <main>{children}</main>
    </>
  );
}

const Private = ({ children }) =>
  localStorage.getItem('token') ? <Layout>{children}</Layout> : <Navigate to="/login" />;

export default function App() {
  return (
    <>
      <Background />
      <Routes>
        <Route path="/login" element={<Auth />} />
        <Route path="/" element={<Private><Dashboard /></Private>} />
        <Route path="/starbot" element={<Private><StarBot /></Private>} />
        <Route path="/profile" element={<Private><Profile /></Private>} />
      </Routes>
    </>
  );
}