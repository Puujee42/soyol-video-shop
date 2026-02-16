
'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Loader2, Plus, Edit2, Trash2, CheckCircle2 } from 'lucide-react';

interface Attribute {
  _id: string;
  name: string;
  type: 'select' | 'text' | 'number';
  options: string[];
}

export default function AttributesPage() {
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    type: 'select',
    options: '',
  });

  useEffect(() => {
    fetchAttributes();
  }, []);

  const fetchAttributes = async () => {
    try {
      const res = await fetch('/api/attributes');
      if (res.ok) {
        const data = await res.json();
        setAttributes(data);
      }
    } catch (error) {
      console.error('Failed to fetch attributes:', error);
      toast.error('Failed to load attributes');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const optionsArray = formData.options.split(',').map(o => o.trim()).filter(Boolean);
      
      const payload = {
        name: formData.name,
        type: formData.type,
        options: optionsArray,
      };

      if (editing) {
        // Update existing
        const res = await fetch('/api/attributes', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editing, ...payload }),
        });
        if (res.ok) {
          toast.success('Attribute updated successfully');
          setEditing(null);
        } else {
            toast.error('Failed to update attribute');
        }
      } else {
        // Create new
        const res = await fetch('/api/attributes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          toast.success('Attribute created successfully');
        } else {
            const data = await res.json();
            toast.error(data.error || 'Failed to create attribute');
        }
      }

      setFormData({ name: '', type: 'select', options: '' });
      fetchAttributes();

    } catch (error) {
      console.error('Error saving attribute:', error);
      toast.error('An error occurred');
    }
  };

  const handleEdit = (attr: Attribute) => {
    setEditing(attr._id);
    setFormData({
      name: attr.name,
      type: attr.type,
      options: attr.options.join(', '),
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this attribute?')) return;
    try {
      const res = await fetch(`/api/attributes?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Attribute deleted');
        fetchAttributes();
      } else {
        toast.error('Failed to delete attribute');
      }
    } catch (error) {
      console.error('Error deleting:', error);
      toast.error('An error occurred');
    }
  };

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-orange-500" /></div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-slate-800">Manage Product Attributes</h1>
      
      {/* Create/Edit Form */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
        <h2 className="text-lg font-semibold mb-4 text-slate-700">{editing ? 'Edit Attribute' : 'Add New Attribute'}</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Attribute Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="e.g. Color, Size, Material"
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value as any})}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
            >
              <option value="select">Select (Dropdown)</option>
              <option value="text">Text Input</option>
              <option value="number">Number Input</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-600 mb-1">Options (Comma separated for Select type)</label>
            <input
              type="text"
              value={formData.options}
              onChange={(e) => setFormData({...formData, options: e.target.value})}
              placeholder="e.g. Red, Blue, Green (Only required for Select type)"
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
              disabled={formData.type !== 'select'}
            />
          </div>

          <div className="md:col-span-2 flex justify-end gap-2">
             {editing && (
                 <button
                    type="button"
                    onClick={() => { setEditing(null); setFormData({ name: '', type: 'select', options: '' }); }}
                    className="px-4 py-2 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 transition-colors"
                 >
                     Cancel
                 </button>
             )}
            <button
              type="submit"
              className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
            >
              {editing ? <CheckCircle2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {editing ? 'Update Attribute' : 'Add Attribute'}
            </button>
          </div>
        </form>
      </div>

      {/* Attributes List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Options</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {attributes.length === 0 ? (
                <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500">No attributes found. Create one above.</td>
                </tr>
            ) : (
                attributes.map((attr) => (
                <tr key={attr._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{attr.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 capitalize">{attr.type}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                    {attr.options?.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                        {attr.options.map((opt, i) => (
                            <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs border border-slate-200">{opt}</span>
                        ))}
                        </div>
                    ) : (
                        <span className="text-slate-400 italic">None</span>
                    )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                        onClick={() => handleEdit(attr)}
                        className="text-blue-600 hover:text-blue-900 mr-4 p-1 hover:bg-blue-50 rounded"
                        title="Edit"
                    >
                        <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handleDelete(attr._id)}
                        className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded"
                        title="Delete"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                    </td>
                </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
