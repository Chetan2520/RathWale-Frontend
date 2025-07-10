import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../api';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', { email, password });
      login(res.data.user, res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-200">
      <form onSubmit={handleSubmit} className="bg-white/90 p-10 rounded-2xl shadow-2xl w-full max-w-md flex flex-col items-center gap-4">
        <div className="text-5xl mb-2">📒</div>
        <h2 className="text-2xl font-bold mb-2 text-blue-700">Welcome Back!</h2>
        <p className="mb-4 text-gray-500">Login to your Khatabook account</p>
        {error && <div className="mb-2 text-red-500">{error}</div>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full mb-2 p-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full mb-4 p-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
          required
        />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg shadow hover:bg-blue-700 transition">Login</button>
        <p className="mt-4 text-center">Don't have an account? <Link to="/signup" className="text-blue-600 hover:underline">Sign up</Link></p>
      </form>
    </div>
  );
};

export default Login; 