import React, { useContext } from 'react';
import { Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import EntriesPage from './pages/EntriesPage';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthContext } from './context/AuthContext';
import EntryFormPage from './pages/EntryFormPage';
import { useState } from 'react';

function Layout({ children }) {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const showNav = !['/login', '/signup'].includes(location.pathname);
  const [navOpen, setNavOpen] = useState(false);
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 font-sans">
      {showNav && (
        <nav className="sticky top-0 z-20 bg-white/80 backdrop-blur shadow flex flex-col sm:flex-row items-center justify-between px-4 sm:px-8 py-3 sm:py-5 ">
          <div className="flex w-full items-center justify-between">
            <Link to="/dashboard" className="text-2xl font-extrabold text-blue-700 tracking-tight flex items-center gap-2 mb-2 sm:mb-0">
              <span></span> Khatabook
            </Link>
            <button className="sm:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" onClick={() => setNavOpen(!navOpen)} aria-label="Toggle navigation">
              <svg className="w-7 h-7 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
          </div>
          <div className={`flex-col sm:flex-row items-center justify-evenly w-full sm:w-1/3 gap-2 sm:gap-0 flex ${navOpen ? 'flex' : 'hidden'} sm:flex mt-2 sm:mt-0`}>
            <Link to="/entries" className="text-blue-700 text-lg sm:text-xl hover:underline font-medium py-2 sm:py-0 w-full sm:w-auto text-center" onClick={() => setNavOpen(false)}>All Entries</Link>
            <span className="text-gray-700 text-lg sm:text-xl font-medium py-2 sm:py-0 w-full sm:w-auto text-center">{user?.username}</span>
            <button onClick={() => { setNavOpen(false); logout(); }} className="bg-red-500 text-white px-5 sm:px-7 py-2 sm:py-3 rounded-lg font-bold hover:bg-red-600 transition w-full sm:w-auto">Logout</button>
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
