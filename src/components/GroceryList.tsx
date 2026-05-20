'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'

interface GroceryItem { id: string; name: string; brand?: string; quantity?: string; category: string; is_checked: boolean }

const categories: Record<string, string> = {
  fruits_vegetables: '🥦 Fruits & légumes',
  dairy: '🥛 Produits laitiers',
  meat: '🥩 Viande & poisson',
  bakery: '🥖 Boulangerie',
  drinks: '🧃 Boissons',
  hygiene: '🧴 Hygiène',
  other: '🛒 Autres'
}

export default function GroceryList({ familyId, onClose }: { familyId: string; onClose: () => void }) {
  const supabase = createClient()
  const [items, setItems] = useState<GroceryItem[]>([])
  const [newItem, setNewItem] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadItems() }, [])

  const loadItems = async () => {
    const { data } = await supabase
      .from('grocery_items')
      .select('*')
      .eq('family_id', familyId)
      .order('category')
    setItems(data || [])
    setLoading(false)
  }

  const toggleItem = async (id: string, checked: boolean) => {
    await supabase.from('grocery_items').update({ is_checked: !checked }).eq('id', id)
    setItems(prev => prev.map(i => i.id === id ? { ...i, is_checked: !checked } : i))
  }

  const addItem = async () => {
    if (!newItem.trim()) return
    const { data } = await supabase.from('grocery_items').insert({
      family_id: familyId,
      name: newItem.trim(),
      category: 'other',
      is_recurring: false
    }).select().single()
    if (data) setItems(prev => [...prev, data])
    setNewItem('')
  }

  const resetAll = async () => {
    await supabase.from('grocery_items').update({ is_checked: false }).eq('family_id', familyId)
    setItems(prev => prev.map(i => ({ ...i, is_checked: false })))
  }

  const grouped = items.reduce((acc, item) => {
    const cat = item.category || 'other'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(item)
    return acc
  }, {} as Record<string, GroceryItem[]>)

  const doneCount = items.filter(i => i.is_checked).length

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end">
      <div className="bg-white w-full rounded-t-3xl max-h-[85vh] flex flex-col">

        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
          <div>
            <p className="text-sm font-semibold text-gray-900">🛒 Liste de courses</p>
            <p className="text-xs text-gray-500">{doneCount}/{items.length} articles</p>
          </div>
          <div className="flex items-center gap-2">
            {doneCount > 0 && (
              <button onClick={resetAll} className="text-xs text-gray-400 hover:text-gray-600 border border-gray-200 rounded-lg px-2.5 py-1">
                Tout remettre
              </button>
            )}
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center text-gray-400">✕</button>
          </div>
        </div>

        {/* Barre de progression */}
        <div className="px-4 pt-3">
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-400 rounded-full transition-all"
              style={{ width: items.length ? `${(doneCount / items.length) * 100}%` : '0%' }}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
          {loading ? (
            <p className="text-center text-gray-400 text-sm py-8">Chargement...</p>
          ) : (
            Object.entries(grouped).map(([cat, catItems]) => (
              <div key={cat}>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                  {categories[cat] || '🛒 Autres'}
                </p>
                <div className="bg-gray-50 rounded-2xl overflow-hidden divide-y divide-gray-100">
                  {catItems.map(item => (
                    <div
                      key={item.id}
                      onClick={() => toggleItem(item.id, item.is_checked)}
                      className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-100 transition-colors ${item.is_checked ? 'opacity-50' : ''}`}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${item.is_checked ? 'bg-green-400 border-green-400' : 'border-gray-300'}`}>
                        {item.is_checked && <span className="text-white text-xs">✓</span>}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm ${item.is_checked ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                          {item.name}
                        </p>
                        {item.brand && <p className="text-xs text-gray-400">{item.brand}</p>}
                      </div>
                      {item.quantity && (
                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{item.quantity}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Ajouter un article */}
        <div className="px-4 pb-6 pt-2 flex gap-2 border-t border-gray-100">
          <input
            type="text"
            value={newItem}
            onChange={e => setNewItem(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addItem()}
            placeholder="Ajouter un article..."
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
          />
          <button
            onClick={addItem}
            disabled={!newItem.trim()}
            className="w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center text-white disabled:opacity-40 hover:bg-rose-600"
          >
            +
          </button>
        </div>
      </div>
    </div>
  )
}
