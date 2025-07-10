import React, { useEffect, useState } from 'react';
import EntryTable from '../components/EntryTable';
import API from '../api';
import { useNavigate, useLocation } from 'react-router-dom';

const EntriesPage = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const res = await API.get('/entries');
      setEntries(res.data);
    } catch (err) {
      // handle error
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  // Re-fetch entries if navigated with updated flag
  useEffect(() => {
    if (location.state && location.state.updated) {
      fetchEntries();
      // Clean up state so it doesn't persist
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const handleEdit = (entry) => {
    navigate('/dashboard', { state: { editingEntry: entry } });
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/entries/${id}`);
      fetchEntries();
    } catch (err) {
      // handle error (optional: show a toast or alert)
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center py-6 px-2 sm:px-4 md:px-8 lg:px-16">
      <div className="w-full max-w-full bg-white rounded-2xl shadow-lg p-4 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-700">All Entries</h1>
          <button onClick={() => navigate('/dashboard')} className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg shadow hover:bg-blue-200 transition w-full sm:w-auto">Back to Dashboard</button>
        </div>
        <div className="w-full overflow-x-auto">
          <EntryTable entries={entries} onEdit={handleEdit} onDelete={handleDelete} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default EntriesPage;
