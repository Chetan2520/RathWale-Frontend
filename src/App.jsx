import React, { useContext } from 'react';
import { Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import EntriesPage from './pages/EntriesPage';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthContext } from './context/AuthContext';
import EntryFormPage from './pages/EntryFormPage';

function Layout({ children }) {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const showNav = !['/login', '/signup'].includes(location.pathname);
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 font-sans">
      {showNav && (
        <nav className="sticky top-0 z-20 bg-white/80 backdrop-blur shadow flex items-center justify-evenly px-8 py-5 ">
          <Link to="/dashboard" className="text-2xl font-extrabold text-blue-700 tracking-tight flex items-center gap-2">
            <span></span> Khatabook
          </Link>
          <div className="flex items-center justify-evenly w-1/3">
            <Link to="/entries" className="text-blue-700 text-xl hover:underline font-medium">All Entries</Link>
            <span className="text-gray-700 text-xl  font-medium">{user?.username}</span>
            <button onClick={logout} className="bg-red-500 text-white px-7 py-3 rounded-lg font-bold hover:bg-red-600 transition">Logout</button>
          </div>
        </nav>
      )}
      <main>{children}</main>
    </div>
  );
}

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/entryformpage" element={<EntryFormPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/entries" element={
          <ProtectedRoute>
            <EntriesPage />
          </ProtectedRoute>
        } />
      </Routes>
    </Layout>
  );
}

export default App;
