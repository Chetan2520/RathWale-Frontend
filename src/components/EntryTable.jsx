import React, { useState } from 'react';
import API from '../api';

const EntryTable = ({ entries, onEdit, onDelete, loading }) => {
  const [downloadingId, setDownloadingId] = useState(null);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const handleDownload = async (id) => {
    setDownloadingId(id);
    setError('');
    try {
      const res = await API.get(`/entries/${id}/pdf`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `bill_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => window.URL.revokeObjectURL(url), 1000);
    } catch (err) {
      setError('Failed to download PDF.');
    }
    setDownloadingId(null);
  };

  // Filter entries by customer name or item name
  const filteredEntries = entries.filter(entry => {
    const customerMatch = entry.customerName.toLowerCase().includes(search.toLowerCase());
    const itemMatch = entry.items.some(item => item.name.toLowerCase().includes(search.toLowerCase()));
    return customerMatch || itemMatch;
  });

  if (loading) return <div className="text-lg sm:text-2xl text-blue-700 font-bold py-10 w-full text-center">Loading...</div>;
  if (!entries.length) return <div className="text-lg sm:text-2xl text-blue-700 font-bold py-10 w-full text-center">No entries found.</div>;

  return (
    <div className="w-full overflow-x-auto my-8">
      <div className="bg-white rounded-2xl shadow-2xl border border-blue-100 p-4 sm:p-8">
        {/* Search Bar */}
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
          <input
            type="text"
            className="border border-blue-200 rounded-lg px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 w-full sm:w-72"
            placeholder="Search by customer or item..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <span className="text-gray-400 text-sm ml-1">{filteredEntries.length} result{filteredEntries.length !== 1 ? 's' : ''}</span>
        </div>
        {error && <div className="text-red-500 mb-4 text-base sm:text-xl font-bold">{error}</div>}
        <table className="w-full text-sm sm:text-lg min-w-[600px] border border-blue-100 border-separate border-spacing-0">
          <thead>
            <tr className="bg-gradient-to-r from-blue-100 to-purple-100 border-b-2 border-blue-200">
              <th className="py-3 sm:py-5 px-2 sm:px-6 text-left text-blue-700 font-extrabold text-base sm:text-xl tracking-wide border border-blue-100">Customer Name</th>
              <th className="py-3 sm:py-5 px-2 sm:px-6 text-left text-blue-700 font-extrabold text-base sm:text-xl tracking-wide border border-blue-100">Booking Date</th>
              <th className="py-3 sm:py-5 px-2 sm:px-6 text-left text-blue-700 font-extrabold text-base sm:text-xl tracking-wide border border-blue-100">Items</th>
              <th className="py-3 sm:py-5 px-2 sm:px-6 text-left text-blue-700 font-extrabold text-base sm:text-xl tracking-wide border border-blue-100">Total</th>
              <th className="py-3 sm:py-5 px-2 sm:px-6 text-left text-blue-700 font-extrabold text-base sm:text-xl tracking-wide border border-blue-100">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEntries.map((entry, idx) => (
              <tr
                key={entry._id}
                className={`transition ${idx % 2 === 0 ? 'bg-blue-50/50' : 'bg-white'} hover:bg-purple-50/70`}
              >
                <td className="py-3 sm:py-5 px-2 sm:px-6 align-top font-bold text-gray-800 text-sm sm:text-lg border border-blue-100">{entry.customerName}</td>
                <td className="py-3 sm:py-5 px-2 sm:px-6 align-top text-gray-600 text-sm sm:text-lg border border-blue-100">{new Date(entry.bookingDate).toLocaleDateString()}</td>
                <td className="py-3 sm:py-5 px-2 sm:px-6 align-top border border-blue-100">
                  <div className="overflow-x-auto">
                    <table className="min-w-[400px] w-full border border-blue-100 border-separate border-spacing-0 text-xs sm:text-sm">
                      <thead>
                        <tr className="bg-blue-50 text-base">
                          <th className="px-3 py-2 min-w-[120px] text-left font-semibold text-blue-700 border border-blue-100">Item</th>
                          <th className="px-3 py-2 min-w-[60px] text-left font-semibold text-blue-700 border border-blue-100">Qty</th>
                          <th className="px-3 py-2 min-w-[80px] text-left font-semibold text-blue-700 border border-blue-100">Price</th>
                          <th className="px-3 py-2 min-w-[90px] text-left font-semibold text-blue-700 border border-blue-100">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {entry.items.map((item, idx) => (
                          <tr key={idx} className="border-t border-blue-50">
                            <td className="px-3 py-2 font-semibold text-gray-800 whitespace-nowrap border border-blue-100">{item.name}</td>
                            <td className="px-3 py-2 font-mono text-gray-700 whitespace-nowrap border border-blue-100">{item.quantity}</td>
                            <td className="px-3 py-2 font-mono text-gray-700 whitespace-nowrap border border-blue-100">₹{item.price}</td>
                            <td className="px-3 py-2 font-bold text-blue-700 whitespace-nowrap border border-blue-100">₹{item.price * item.quantity}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </td>
                <td className="py-2 sm:py-4 px-2 sm:px-6 border-b align-top font-bold text-green-600 text-base sm:text-xl border border-blue-100">₹{entry.total}</td>
                <td className="py-3 sm:py-5 px-2 sm:px-6 align-top border border-blue-100">
                  <div className="flex flex-row flex-wrap gap-2 sm:gap-4 min-w-[100px]">
                    <button className="bg-yellow-200/80 text-yellow-900 px-2 sm:px-4 py-1 sm:py-2 rounded-lg shadow hover:bg-yellow-300/90 focus:ring-2 focus:ring-yellow-400 transition font-bold text-sm sm:text-lg outline-none" onClick={() => onEdit(entry)}>Edit</button>
                    <button className="bg-red-200/80 text-red-800 px-2 sm:px-4 py-1 sm:py-2 rounded-lg shadow hover:bg-red-300/90 focus:ring-2 focus:ring-red-400 transition font-bold text-sm sm:text-lg outline-none" onClick={() => onDelete(entry._id)}>Delete</button>
                    <button className="bg-green-200/80 text-green-800 px-2 sm:px-4 py-1 sm:py-2 rounded-lg shadow hover:bg-green-300/90 focus:ring-2 focus:ring-green-400 transition font-bold text-sm sm:text-lg outline-none disabled:opacity-50" onClick={() => handleDownload(entry._id)} disabled={downloadingId === entry._id}>
                      {downloadingId === entry._id ? 'Downloading...' : 'PDF'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EntryTable;
