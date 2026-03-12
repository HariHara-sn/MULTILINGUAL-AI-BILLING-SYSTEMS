import { useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'
import Loader from '../components/Loader'
import { getAllItems, addItem, updateItem } from '../services/api'

const EMPTY_FORM = { product_name: '', unit: 'kg', price: '' }

export default function AdminDashboard() {
  const [items, setItems]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [form, setForm]         = useState(EMPTY_FORM)
  const [saving, setSaving]     = useState(false)
  const [search, setSearch]     = useState('')

  const fetchItems = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getAllItems()
      // Normalize: items might be an array or {items: []}
      const products = Array.isArray(data) ? data : (data.items || [])
      setItems(products)
    } catch (err) {
      toast.error(`Failed to load products: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchItems() }, [fetchItems])

  const openAdd = () => {
    setForm(EMPTY_FORM)
    setEditMode(false)
    setShowModal(true)
  }

  const openEdit = (item) => {
    setForm({
      product_name: item.product_name || item.item_name || item.name || '',
      unit:         item.unit || 'kg',
      price:        item.price || '',
      _id:          item._id || item.id || undefined,
    })
    setEditMode(true)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setForm(EMPTY_FORM)
  }

  const handleChange = (e) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.product_name.trim() || !form.price) {
      toast.error('Please fill in all fields')
      return
    }
    setSaving(true)
    try {
      const payload = {
        product_name: form.product_name.trim(),
        unit:         form.unit,
        price:        Number(form.price),
      }
      if (editMode) {
        await updateItem(payload)
        toast.success('Product updated successfully')
      } else {
        await addItem(payload)
        toast.success('Product added successfully')
      }
      closeModal()
      fetchItems()
    } catch (err) {
      toast.error(`Error: ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  const filteredItems = items.filter(item => {
    const name = (item.product_name || item.name || '').toLowerCase()
    return name.includes(search.toLowerCase())
  })

  return (
    <div className="min-h-screen pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Product Management</h1>
            <p className="text-slate-400 text-sm mt-1.5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
              Inventory catalog with {items.length} product{items.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button id="add-item-btn" className="btn btn-primary px-6 py-2.5 shadow-xl shadow-indigo-500/20" onClick={openAdd}>
            <span className="text-lg">+</span> Add New Product
          </button>
        </div>

        {/* Stats cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
          <StatCard
            icon="📦"
            label="Total Products"
            value={items.length}
            color="indigo"
          />
          <StatCard
            icon="₹"
            label="Avg Price"
            value={items.length
              ? `₹${(items.reduce((s, i) => s + (Number(i.price) || 0), 0) / items.length).toFixed(0)}`
              : '—'}
            color="cyan"
          />
          <StatCard
            icon="🏷️"
            label="Active Units"
            value={[...new Set(items.map(i => i.unit).filter(Boolean))].length || '0'}
            color="emerald"
          />
        </div>

        {/* Filters and Search Container */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 bg-slate-800/40 p-3 rounded-xl border border-slate-700/50">
          <div className="relative w-full sm:max-w-xs">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">🔍</span>
            <input
              className="input pl-10 h-10 text-sm"
              placeholder="Filter by name..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="text-xs text-slate-500 font-medium">
            Showing {filteredItems.length} of {items.length} items
          </div>
        </div>

        {/* Products Table */}
        <div className="glass rounded-2xl overflow-hidden shadow-2xl border border-slate-700/50">
          {loading ? (
            <div className="py-20"><Loader message="Syncing with database..." /></div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-24 text-slate-500">
              <div className="text-6xl mb-4 grayscale opacity-50">🍱</div>
              <p className="font-semibold text-lg text-slate-400">
                {search ? 'No products match your search' : 'Inventory is empty'}
              </p>
              {!search && (
                <button className="btn btn-primary mt-6 px-8" onClick={openAdd}>
                  Seed your catalog
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full bill-table">
                <thead>
                  <tr>
                    <th className="w-16 text-center">#</th>
                    <th className="text-left">Product / Item Name</th>
                    <th className="w-32 text-center">Unit</th>
                    <th className="w-40 text-right">Price</th>
                    <th className="w-32 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item, idx) => (
                    <tr key={item._id || idx} className="group transition-all duration-200">
                      <td className="text-slate-500 text-xs text-center font-mono">
                        {String(idx + 1).padStart(2, '0')}
                      </td>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-lg border border-slate-700 group-hover:border-indigo-500/50 transition-colors">
                            🥗
                          </div>
                          <div>
                            <div className="font-bold text-slate-100 leading-tight">
                              {item.product_name || item.item_name || item.name}
                            </div>
                            <div className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">
                              ID: {(item._id || 'temp').slice(-6)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="text-center">
                        <span className="badge bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1">
                          {item.unit || '—'}
                        </span>
                      </td>
                      <td className="text-right font-mono font-bold text-emerald-400 text-base">
                        ₹{item.price}
                      </td>
                      <td className="text-center">
                        <button
                          className="btn btn-ghost text-xs px-4 py-1.5 opacity-60 group-hover:opacity-100 hover:text-indigo-400"
                          onClick={() => openEdit(item)}
                        >
                          ✏️ Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modern Modal Overlay */}
      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="glass w-full max-w-md mx-4 p-8 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border-t border-white/10 animate-slide-up">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">
                  {editMode ? 'Edit Product' : 'Add Item'}
                </h2>
                <div className="h-1 w-12 bg-indigo-500 rounded-full mt-1" />
              </div>
              <button className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors" onClick={closeModal}>
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2.5 ml-1">
                  Product Name (Tamil Preferred)
                </label>
                <input
                  name="product_name"
                  className="input h-12 bg-slate-900/50"
                  placeholder="e.g. தக்காளி"
                  value={form.product_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2.5 ml-1">
                    Unit Type
                  </label>
                  <select
                    name="unit"
                    className="input h-12 bg-slate-900/50 appearance-none"
                    value={form.unit}
                    onChange={handleChange}
                  >
                    {['kg', 'g', 'litre', 'ml', 'piece', 'dozen', 'pack'].map(u => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2.5 ml-1">
                    Price (₹)
                  </label>
                  <input
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    className="input h-12 bg-slate-900/50"
                    placeholder="25.00"
                    value={form.price}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" className="btn btn-ghost flex-1 h-12 rounded-2xl" onClick={closeModal}>
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary flex-1 h-12 rounded-2xl justify-center font-bold text-base shadow-lg shadow-indigo-500/20"
                  disabled={saving}
                >
                  {saving ? (
                    <span className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  ) : editMode ? 'Save Changes' : 'Add to Inventory'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}


function StatCard({ icon, label, value, color, small }) {
  const colorMap = {
    indigo: 'from-indigo-500/20 to-indigo-600/10 border-indigo-500/20',
    cyan:   'from-cyan-500/20  to-cyan-600/10  border-cyan-500/20',
    emerald:'from-emerald-500/20 to-emerald-600/10 border-emerald-500/20',
  }
  return (
    <div className={`glass bg-gradient-to-br ${colorMap[color]} rounded-xl p-4 border`}>
      <div className="text-2xl mb-1">{icon}</div>
      <div className={`font-bold text-white ${small ? 'text-sm' : 'text-2xl'}`}>{value}</div>
      <div className="text-slate-400 text-xs mt-0.5">{label}</div>
    </div>
  )
}
