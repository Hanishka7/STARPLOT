import { useEffect, useState } from 'react';
import api from '../api';

function CountUp({ to }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let cur = 0;
    const step = Math.max(1, Math.ceil(to / 20));
    const t = setInterval(() => { cur += step; if (cur >= to) { cur = to; clearInterval(t); } setN(cur); }, 40);
    return () => clearInterval(t);
  }, [to]);
  return n;
}

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, done: 0, pending: 0, needsHuman: 0 });
  const [apps, setApps] = useState([]);
  const load = () => {
    api.get('/applications/stats').then((r) => setStats(r.data));
    api.get('/applications').then((r) => setApps(r.data));
  };
  useEffect(() => { load(); const t = setInterval(load, 8000); return () => clearInterval(t); }, []);

  const cards = [
    ['📨', 'Total Applications', stats.total, 'cyan'],
    ['✅', 'Applications Done', stats.done, 'green'],
    ['⏳', 'Pending', stats.pending, 'amber'],
    ['🚨', 'Needs Your Action', stats.needsHuman, 'red'],
  ];
  const rate = stats.total ? Math.round((stats.done / stats.total) * 100) : 0;

  return (
    <>
      <h2>Hi, {localStorage.getItem('name')} 👋</h2>
      <p className="muted" style={{ marginTop: -8 }}>Your mission control for job applications</p>
      <div className="grid">
        {cards.map(([icon, label, n, c]) => (
          <div key={label} className={`card stat ${c}`}>
            <div className="icon">{icon}</div>
            <h3><CountUp to={n} /></h3>
            <p>{label}</p>
          </div>
        ))}
      </div>

      <div className="card">
        <h3>🎯 Success rate: {rate}%</h3>
        <div className="bar"><div style={{ width: `${rate}%` }} /></div>
      </div>

      <div className="card">
        <h3>🛰️ Recent applications</h3>
        <table>
          <thead><tr><th>JOB LINK</th><th>STATUS</th><th>NOTE</th><th>DATE</th></tr></thead>
          <tbody>
            {apps.map((a) => (
              <tr key={a._id}>
                <td><a href={a.jobUrl} target="_blank" rel="noreferrer">{a.jobUrl.slice(0, 45)}</a></td>
                <td><span className={`pill ${a.status}`}>{a.status.replace('_', ' ')}</span></td>
                <td>{a.note}</td>
                <td>{new Date(a.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {!apps.length && <tr><td colSpan="4" className="muted">No applications yet. Open StarBot and paste a job link 🚀</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}