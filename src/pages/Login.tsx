import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../components/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const auth = useAuth();
  const nav = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await auth.login(email, password);
    if (ok) {
      nav('/');
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-8 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-6 text-center">Login</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <form onSubmit={submit} className="flex flex-col gap-3">
        <input
          type="email"
          className="border rounded px-3 py-2"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="border rounded px-3 py-2"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button className="bg-blue-600 text-white rounded py-2 mt-3" type="submit">
          Login
        </button>
      </form>
      <div className="mt-3 text-sm text-center">
        Don&apos;t have an account? <Link className="text-blue-600 underline" to="/signup">Sign Up</Link>
      </div>
    </div>
  );
}
