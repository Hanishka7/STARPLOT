import { useEffect, useState } from 'react';
import api from '../api';

const FIELDS = [
  ['fullName', 'Full name'], ['phone', 'Phone'], ['address', 'Address'],
  ['education', 'Education'], ['skills', 'Skills (comma separated)'],
  ['aadhaar', 'Aadhaar number'], ['pan', 'PAN number'], ['passport', 'Passport number'], ['voterId', 'Voter ID'],
  ['github', 'GitHub URL'], ['linkedin', 'LinkedIn URL'], ['leetcode', 'LeetCode URL'],
  ['hackerrank', 'HackerRank URL'], ['portfolio', 'Portfolio URL'],
];

export default function Profile() {
  const [f, setF] = useState({});
  const [files, setFiles] = useState({});
  const [msg, setMsg] = useState('');

  useEffect(() => {
    api.get('/profile').then(({ data }) => setF({ ...data, ...data.links }));
  }, []);

  const save = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    FIELDS.forEach(([k]) => fd.append(k, f[k] || ''));
    Object.entries(files).forEach(([k, v]) => v && fd.append(k, v));
    await api.put('/profile', fd);
    setMsg('Profile saved ✅');
    setTimeout(() => setMsg(''), 3000);
  };

  return (
    <form className="card" onSubmit={save}>
      <h2>My Profile</h2>
      <p className="muted">ID numbers are encrypted. Leave a masked value as is to keep it unchanged.</p>
      <div className="two">
        {FIELDS.map(([k, label]) => (
          <label key={k}>{label}
            <input value={f[k] || ''} onChange={(e) => setF({ ...f, [k]: e.target.value })} />
          </label>
        ))}
        {[['resume', 'Resume (PDF)'], ['photo', 'Passport photo'], ['idImage', 'ID card image']].map(([k, l]) => (
          <label key={k}>{l}
            <input type="file" onChange={(e) => setFiles({ ...files, [k]: e.target.files[0] })} />
          </label>
        ))}
      </div>
      <button>Save profile</button>
      {msg && <p className="success">{msg}</p>}
    </form>
  );
}