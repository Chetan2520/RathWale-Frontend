import React, { useState, useEffect } from 'react';

const emptyItem = { name: '', price: 0, quantity: 1 };

const EntryForm = ({ onSubmit, editingEntry, onCancel }) => {
  const [customerName, setCustomerName] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [items, setItems] = useState([{ ...emptyItem }]);

  useEffect(() => {
    if (editingEntry) {
      setCustomerName(editingEntry.customerName);
      setBookingDate(editingEntry.bookingDate?.slice(0, 10));
      setItems(editingEntry.items.length ? editingEntry.items : [{ ...emptyItem }]);
    } else {
      setCustomerName('');
      setBookingDate('');
      setItems([{ ...emptyItem }]);
    }
  }, [editingEntry]);

  const handleItemChange = (idx, field, value) => {
    setItems(items => items.map((item, i) => i === idx ? { ...item, [field]: value } : item));
  };

  const handleAddItem = () => setItems([...items, { ...emptyItem }]);
  const handleRemoveItem = (idx) => setItems(items => items.length > 1 ? items.filter((_, i) => i !== idx) : items);

  // Calculate total as sum of item price * quantity
  const total = items.reduce((sum, item) => sum + (Number(item.price || 0) * Number(item.quantity || 0)), 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ customerName, bookingDate, items, total, _id: editingEntry?._id }, !!editingEntry);
    if (!editingEntry) {
      setCustomerName('');
      setBookingDate('');
      setItems([{ ...emptyItem }]);
    }
  };

  return (
    <div className="w-full  mx-auto">
      <div className="space-y-8">
        {/* Customer Information Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">1</span>
            </div>
            Customer Information
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="group">
              <label className="block mb-3 font-semibold text-gray-700 text-lg">
                Customer Name
              </label>
              <div className="relative">
                <input 
                  type="text" 
                  className="w-full border-2 border-gray-200 rounded-2xl p-4 text-lg focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 focus:outline-none transition-all duration-300 bg-white/70 backdrop-blur-sm hover:bg-white/90 group-hover:border-indigo-300" 
                  value={customerName} 
                  onChange={e => setCustomerName(e.target.value)} 
                  required 
                  placeholder="Enter customer name"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
            </div>

            <div className="group">
              <label className="block mb-3 font-semibold text-gray-700 text-lg">
                Booking Date
              </label>
              <div className="relative">
                <input 
                  type="date" 
                  className="w-full border-2 border-gray-200 rounded-2xl p-4 text-lg focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 focus:outline-none transition-all duration-300 bg-white/70 backdrop-blur-sm hover:bg-white/90 group-hover:border-indigo-300" 
                  value={bookingDate} 
                  onChange={e => setBookingDate(e.target.value)} 
                  required 
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Items Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">2</span>
            </div>
            Items & Pricing
          </h2>

          <div className="space-y-4">
            {items.map((item, idx) => (
              <div key={idx} className="group bg-gradient-to-r from-white/50 to-gray-50/50 rounded-2xl p-6 border border-gray-200/50 hover:border-indigo-300/50 transition-all duration-300 hover:shadow-lg">
                <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
                  <div className="flex-1">
                    <input 
                      type="text" 
                      placeholder="Item Name" 
                      className="w-full border-2 border-gray-200 rounded-xl p-3 text-lg focus:ring-3 focus:ring-indigo-200 focus:border-indigo-400 focus:outline-none transition-all duration-300 bg-white/80 hover:bg-white/90" 
                      value={item.name} 
                      onChange={e => handleItemChange(idx, 'name', e.target.value)} 
                      required 
                    />
                  </div>
                  
                  <div className="flex gap-4 items-center">
                    <div className="relative">
                      <input 
                        type="number" 
                        placeholder="Qty" 
                        className="border-2 border-gray-200 rounded-xl p-3 text-lg w-24 focus:ring-3 focus:ring-indigo-200 focus:border-indigo-400 focus:outline-none transition-all duration-300 bg-white/80 hover:bg-white/90 text-center" 
                        value={item.quantity} 
                        onChange={e => handleItemChange(idx, 'quantity', e.target.value)} 
                        required 
                        min="1" 
                      />
                      <label className="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-500 font-medium">Qty</label>
                    </div>
                    
                    <div className="relative">
                      <input 
                        type="number" 
                        placeholder="Price" 
                        className="border-2 border-gray-200 rounded-xl p-3 text-lg w-32 focus:ring-3 focus:ring-indigo-200 focus:border-indigo-400 focus:outline-none transition-all duration-300 bg-white/80 hover:bg-white/90 text-center" 
                        value={item.price} 
                        onChange={e => handleItemChange(idx, 'price', e.target.value)} 
                        required 
                        min="0" 
                      />
                      <label className="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-500 font-medium">₹</label>
                    </div>
                    
                    <div className="flex gap-2">
                      <button 
                        type="button" 
                        className="w-10 h-10 bg-gradient-to-r from-red-400 to-red-500 text-white rounded-full hover:from-red-500 hover:to-red-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95" 
                        onClick={() => handleRemoveItem(idx)} 
                        disabled={items.length === 1}
                      >
                        <span className="text-lg font-bold">−</span>
                      </button>
                      
                      {idx === items.length - 1 && (
                        <button 
                          type="button" 
                          className="w-10 h-10 bg-gradient-to-r from-emerald-400 to-emerald-500 text-white rounded-full hover:from-emerald-500 hover:to-emerald-600 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95" 
                          onClick={handleAddItem}
                        >
                          <span className="text-lg font-bold">+</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Item subtotal */}
                <div className="mt-3 text-right">
                  <span className="text-sm text-gray-600">Subtotal: </span>
                  <span className="font-semibold text-indigo-600">₹{(Number(item.price || 0) * Number(item.quantity || 0)).toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Total Section */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border-2 border-indigo-200/50">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold text-gray-800">Total Amount</h3>
            <div className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              ₹{total.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <button 
            type="button"
            onClick={handleSubmit}
            className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-300 text-xl font-bold flex items-center justify-center gap-3"
          >
            <span>{editingEntry ? 'Update' : 'Create'} Entry</span>
            <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-sm">✓</span>
            </div>
          </button>
          
          {editingEntry && (
            <button 
              type="button" 
              className="bg-gray-200 text-gray-700 px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl hover:bg-gray-300 transform hover:scale-105 active:scale-95 transition-all duration-300 text-xl font-bold flex items-center justify-center gap-3" 
              onClick={onCancel}
            >
              <span>Cancel</span>
              <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">×</span>
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EntryForm;