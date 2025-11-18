import React, { useEffect, useState } from 'react';
import { getPantry, addPantryItem, deletePantryItem } from '../api';
import { Trash2 } from 'lucide-react';

export default function Pantry() {
  const [pantry, setPantry] = useState([]);
  const [item, setItem] = useState({ name: '', quantity: '', category: '' });

  useEffect(() => {
    (async () => {
      const res = await getPantry();
      setPantry(res.pantry?.items || []);
    })();
  }, []);

  const addItem = async () => {
    if (!item.name.trim()) return;
    const res = await addPantryItem(item);
    setPantry(res.pantry.items);
    setItem({ name: '', quantity: '', category: '' });
  };

  const delItem = async (id) => {
    const res = await deletePantryItem(id);
    setPantry(res.pantry.items);
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">My Pantry</h1>
      <div className="flex gap-2 mb-4">
        <input
          className="border p-2 flex-1 rounded"
          placeholder="Item name"
          value={item.name}
          onChange={(e) => setItem({ ...item, name: e.target.value })}
        />
        <input
          className="border p-2 w-28 rounded"
          placeholder="Qty"
          value={item.quantity}
          onChange={(e) => setItem({ ...item, quantity: e.target.value })}
        />
        <input
          className="border p-2 w-40 rounded"
          placeholder="Category"
          value={item.category}
          onChange={(e) => setItem({ ...item, category: e.target.value })}
        />
        <button onClick={addItem} className="bg-orange-500 text-white px-3 rounded">
          Add
        </button>
      </div>
      <div className="space-y-2">
        {pantry.map((p) => (
          <div key={p._id} className="bg-white flex justify-between p-3 rounded shadow">
            <div>
              <div className="font-semibold capitalize">{p.name}</div>
              <div className="text-sm text-gray-600">{p.quantity} {p.category ? `• ${p.category}` : ''}</div>
            </div>
            <button onClick={() => delItem(p._id)} className="text-red-500 hover:bg-red-50 p-1 rounded">
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
        {pantry.length === 0 && <p className="text-gray-500">No items yet.</p>}
      </div>
    </div>
  );
}
