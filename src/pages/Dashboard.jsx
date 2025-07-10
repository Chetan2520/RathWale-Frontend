import React, { useState, useEffect, useRef } from 'react';
import EntryTable from '../components/EntryTable';
import EntryForm from '../components/EntryForm';
import API from '../api';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaClipboardList, FaRupeeSign, FaChartLine, FaUser, FaPlus, FaEye } from 'react-icons/fa';

const statCards = [
  {
    icon: <FaClipboardList className="text-3xl text-blue-600" />,
    label: 'Total Entries',
    key: 'totalEntries',
    color: 'blue',
    growth: '+12%'
  },
  {
    icon: <FaRupeeSign className="text-3xl text-green-600" />,
    label: 'Total Revenue',
    key: 'totalRevenue',
    color: 'green',
    growth: '+8%'
  },
  {
    icon: <FaChartLine className="text-3xl text-purple-600" />,
    label: 'Average Order',
    key: 'averageOrder',
    color: 'purple',
    growth: '+15%'
  },
  {
    icon: <FaUser className="text-3xl text-orange-600" />,
    label: 'Active Customers',
    key: 'activeCustomers',
    color: 'orange',
    growth: '+5%'
  },
];

const Dashboard = () => {
  const [editingEntry, setEditingEntry] = useState(null);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const formRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Calculate stats (MUST be inside the component)
  const totalEntries = entries.length;
  const totalRevenue = entries.reduce((sum, e) => sum + (e.total || 0), 0);
  const averageOrder = totalEntries ? Math.round(totalRevenue / totalEntries) : 0;
  const activeCustomers = new Set(entries.map(e => e.customerName)).size;

  const stats = {
    totalEntries,
    totalRevenue,
    averageOrder,
    activeCustomers,
  };

  const fetchEntries = async () => {
    setLoading(true);
    const res = await API.get('/entries');
    setEntries(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  // If navigated with editingEntry, set it for editing
  useEffect(() => {
    if (location.state && location.state.editingEntry) {
      setEditingEntry(location.state.editingEntry);
      navigate(location.pathname, { replace: true, state: {} });
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [location, navigate]);

  const handleAddOrUpdate = async (entry, isEdit) => {
    if (isEdit) {
      await API.put(`/entries/${entry._id}`, entry);
      setEditingEntry(null);
      await fetchEntries();
    }
  };

  const handleEdit = (entry) => {
    setEditingEntry(entry);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleDelete = async (id) => {
    await API.delete(`/entries/${id}`);
    await fetchEntries();
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-blue-50 to-white py-0 md:py-6 lg:py-12 px-10 md:px-8 lg:px-16">
      <h1 className="text-4xl font-extrabold text-blue-700 mb-2 mt-4 px-4"> Dashboard</h1>
      <p className="text-lg text-gray-500 mb-8 px-4">Manage your business entries efficiently</p>
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10 px-4">
        {statCards.map(card => (
          <div key={card.label} className="bg-white rounded-2xl shadow-lg flex items-center justify-between p-6 w-full">
            <div className="flex items-center gap-4">
              {card.icon}
              <div>
                <div className="text-md text-gray-500">{card.label}</div>
                <div className="text-2xl font-bold text-gray-800 mt-1">
                  {card.key === 'totalRevenue' || card.key === 'averageOrder' ? '₹' : ''}{stats[card.key]}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-green-500 font-semibold flex items-center gap-1">
                <FaChartLine className="inline-block" /> {card.growth}
              </span>
            </div>
          </div>
        ))}
      </div>
      {/* Add Entry & View Entries Buttons */}
      <div className="flex flex-col md:flex-row gap-4 mb-10 px-4 w-1/2">
        <button
          onClick={() => navigate('/entryformpage')}
          className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xl font-bold py-4 rounded-2xl shadow-lg hover:from-blue-600 hover:to-purple-600 transition"
        >
          <FaPlus /> Add Entry
        </button>
        <button
          onClick={() => navigate('/entries', { state: { updated: true } })}
          className="flex-1 flex items-center justify-center gap-2 bg-white text-blue-700 text-xl font-bold py-4 rounded-2xl shadow-lg border border-blue-100 hover:bg-blue-50 transition"
        >
          <FaEye /> View Entries
        </button>
      </div>
      <div className=" bg-white rounded-2xl shadow-lg p-8 w-full px-4">
        <EntryTable entries={entries} onEdit={handleEdit} onDelete={handleDelete} loading={loading} />
      </div>
      {/* Inline Edit Form (shows only when editingEntry is set) */}
      {editingEntry && (
        <div ref={formRef} className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-8 w-full px-4 mb-10">
          <EntryForm onSubmit={handleAddOrUpdate} editingEntry={editingEntry} onCancel={() => setEditingEntry(null)} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;