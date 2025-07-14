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
        <nav className="sticky top-0 z-20 bg-white/80 backdrop-blur shadow flex flex-col sm:flex-row items-center justify-between px-4 sm:px-8 py-3 sm:py-5 ">
          <Link to="/dashboard" className="text-2xl font-extrabold text-blue-700 tracking-tight flex items-center gap-2 mb-2 sm:mb-0">
            <span></span> Khatabook
          </Link>
          <div className="flex flex-col sm:flex-row items-center justify-evenly w-full sm:w-1/3 gap-2 sm:gap-0">
            <Link to="/entries" className="text-blue-700 text-lg sm:text-xl hover:underline font-medium py-2 sm:py-0">All Entries</Link>
            <span className="text-gray-700 text-lg sm:text-xl font-medium py-2 sm:py-0">{user?.username}</span>
            <button onClick={logout} className="bg-red-500 text-white px-5 sm:px-7 py-2 sm:py-3 rounded-lg font-bold hover:bg-red-600 transition w-full sm:w-auto">Logout</button>
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
