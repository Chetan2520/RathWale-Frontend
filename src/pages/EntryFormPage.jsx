import React from 'react';
import EntryForm from '../components/EntryForm';
import API from '../api';
import { useNavigate } from 'react-router-dom';

const EntryFormPage = () => {
  const navigate = useNavigate();

  const handleAdd = async (entry) => {
    await API.post('/entries', entry);
    navigate('/dashboard', { state: { updated: true } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white px-4 py-12">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-blue-700 mb-6">Add New Entry</h1>
        <EntryForm onSubmit={handleAdd} editingEntry={null} onCancel={() => navigate('/dashboard')} />
      </div>
    </div>
  );
};

export default EntryFormPage;