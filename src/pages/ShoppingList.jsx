import React, { useEffect, useState } from 'react';
import {
  getShoppingList, addShoppingItem, deleteShoppingItem, toggleShoppingItem, generateShoppingList
} from '../api';
import { Trash2, Plus } from 'lucide-react';

export default function ShoppingList() {
  const [list, setList] = useState([]);
  const [item, setItem] = useState('');

  useEffect(() => {
    (async () => {
      const res = await getShoppingList();
      setList(res.shoppingList?.items || []);
    })();
  }, []);

  const addItem = async () => {
    if (!item.trim()) return;
    const res = await addShoppingItem({ name: item });
    setList(res.shoppingList.items);
    setItem('');
  };

  const toggle = async (id) => {
    const res = await toggleShoppingItem(id);
    setList(res.shoppingList.items);
  };

  const del = async (id) => {
    const res = await deleteShoppingItem(id);
    setList(res.shoppingList.items);
  };

  const generate = async () => {
    // let server default choose current week; pass nothing
    const res = await generateShoppingList();
    if (res.shoppingList?.items) setList(res.shoppingList.items);
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Shopping List</h1>
      <div className="flex gap-2 mb-4">
        <input
          className="border p-2 flex-1 rounded"
          placeholder="Add item..."
          value={item}
          onChange={(e) => setItem(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addItem()}
        />
        <button onClick={addItem} className="bg-orange-500 text-white px-3 rounded">
          <Plus className="w-5 h-5" />
        </button>
        <button onClick={generate} className="bg-green-500 text-white px-3 rounded">
          Generate from Meal Plan
        </button>
      </div>
      <div className="space-y-2">
        {list.map((i) => (
          <div key={i._id} className="flex justify-between items-center bg-white p-3 rounded shadow">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={i.checked} onChange={() => toggle(i._id)} />
              <span className={i.checked ? 'line-through text-gray-400' : ''}>{i.name}</span>
            </label>
            <button onClick={() => del(i._id)} className="text-red-500 hover:bg-red-50 p-1 rounded">
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
        {list.length === 0 && <p className="text-gray-500">No items yet.</p>}
      </div>
    </div>
  );
}
