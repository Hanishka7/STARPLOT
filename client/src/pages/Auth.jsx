import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const Hero = () => (
  <svg viewBox="0 0 400 400" fill="none">
    <defs>
      <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ff2bd6" /><stop offset="1" stopColor="#8b5cff" /></linearGradient>
      <linearGradient id="g2" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#00f0ff" /><stop offset="1" stopColor="#8b5cff" /></linearGradient>
    </defs>
    <circle cx="200" cy="210" r="110" fill="url(#g1)" opacity=".9" />
    <ellipse cx="200" cy="215" rx="190" ry="42" stroke="url(#g2)" strokeWidth="6" transform="rotate(-18 200 215)" />
    <circle cx="150" cy="180" r="22" fill="#fff" opacity=".12" /><circle cx="235" cy="250" r="30" fill="#fff" opacity=".1" />
    <path d="M320 70l8 22 22 8-22 8-8 22-8-22-22-8 22-8z" fill="#00f0ff" />
    <path d="M70 110l5 14 14 5-14 5-5 14-5-14-14-5 14-5z" fill="#fff" />
    <path d="M330 300l5 14 14 5-14 5-5 14-5-14-14-5 14-5z" fill="#ff2bd6" />
    <g transform="translate(262 62) rotate(35)">
      <rect x="0" y="0" width="30" height="64" rx="15" fill="#fff" /><circle cx="15" cy="26" r="8" fill="#00f0ff" />
      <path d="M0 48l-14 22 14-6zM30 48l14 22-14-6z" fill="#ff2bd6" /><path d="M8 66q7 28 14 0z" fill="#ffb800" />
    </g>
  </svg>
);

export default function Auth() {
  const [mode, setMode] = useState('login');
  const [f, setF] = useState({ name: '', email: '', password: '' });
  const [err, setErr] = useState('');
  const nav = useNavigate();
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post(`/auth/${mode}`, f);
      localStorage.setItem('token', data.token);
      localStorage.setItem('name', data.name);
      nav('/');
    } catch (e) { setErr(e.response?.data?.error || 'Something went wrong'); }
  };

  return (
    <div className="auth">
      <section className="hero">
        <h1 className="neon">⭐ STARPLOT</h1>
        <p>Meet StarBot, your AI sidekick that fills and sends job applications while you focus on shining.</p>
        <div className="tags"><span>🚀 Auto Apply</span><span>🔔 Live Alerts</span><span>🔐 Encrypted IDs</span></div>
        <Hero />
      </section>
      <form className="card" onSubmit={submit}>
        <h2>{mode === 'login' ? 'Welcome back' : 'Join the galaxy'}</h2>
        <p className="muted">{mode === 'login' ? 'Log in to your mission control' : 'Create your account in seconds'}</p>
        {mode === 'register' && <input placeholder="Full name" value={f.name} onChange={set('name')} required />}
        <input type="email" placeholder="Email" value={f.email} onChange={set('email')} required />
        <input type="password" placeholder="Password" value={f.password} onChange={set('password')} required />
        {err && <p className="error">{err}</p>}
        <button>{mode === 'login' ? 'Launch 🚀' : 'Register ✨'}</button>
        <p className="link" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
          {mode === 'login' ? 'New here? Register' : 'Have an account? Login'}
        </p>
      </form>
    </div>
  );
}