import { useEffect, useRef, useState } from 'react';
import api from '../api';

export default function StarBot() {
  const [url, setUrl] = useState('');
  const [apps, setApps] = useState([]);
  const [err, setErr] = useState('');
  const end = useRef();
  const load = () => api.get('/applications').then((r) => setApps(r.data));
  useEffect(() => { load(); const t = setInterval(load, 4000); return () => clearInterval(t); }, []);
  useEffect(() => { end.current?.scrollIntoView({ behavior: 'smooth' }); }, [apps.length]);

  const send = async (e) => {
    e.preventDefault(); setErr('');
    try { await api.post('/applications', { jobUrl: url }); setUrl(''); load(); }
    catch (e) { setErr(e.response?.data?.error || 'Failed'); }
  };

  const reply = (a) => ({
    pending: <span className="typing"><span /><span /><span /></span>,
    submitted: '✅ Applied! I sent you a notification.',
    needs_human: `⏳ Registration pending. Human action needed: ${a.note}`,
    failed: `❌ Couldn't apply: ${a.note}`,
  }[a.status]);

  return (
    <div className="card chat">
      <div className="botHead">
        <div className="avatar">🤖</div>
        <div>
          <h2 style={{ margin: 0 }}>StarBot</h2>
          <p className="muted" style={{ margin: 0 }}>Paste a job application link and I'll apply using your profile.</p>
        </div>
      </div>
      <div className="messages">
        {!apps.length && <p className="muted">👋 Hi! Drop a job link below to begin your first mission.</p>}
        {[...apps].reverse().map((a) => (
          <div key={a._id}>
            <div className="bubble user">{a.jobUrl}</div>
            <div className={`bubble bot ${a.status}`}>{reply(a)}</div>
          </div>
        ))}
        <div ref={end} />
      </div>
      <form onSubmit={send} className="row">
        <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://company.com/careers/job-123" required />
        <button>Apply 🚀</button>
      </form>
      {err && <p className="error">{err}</p>}
    </div>
  );
}