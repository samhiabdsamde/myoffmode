'use client'
import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase'

interface GroceryItem { id: string; name: string; brand?: string; quantity?: string; category: string; is_checked: boolean }

const C = '#C4737A'
const CSoft = 'rgba(196,115,122,0.12)'
const CBorder = 'rgba(196,115,122,0.25)'
const Border = 'rgba(245,238,232,0.07)'
const TextPri = '#F5EEE8'
const TextSec = 'rgba(245,238,232,0.55)'
const TextTer = 'rgba(245,238,232,0.25)'

const CATEGORIES: Record<string, string> = {
  fruits_vegetables: '🥦 Fruits & légumes',
  dairy: '🥛 Produits laitiers',
  meat: '🥩 Viande & poisson',
  bakery: '🥖 Boulangerie',
  drinks: '🧃 Boissons',
  hygiene: '🧴 Hygiène',
  other: '🛒 Autres',
}

export default function GroceryList({ familyId, onClose }: { familyId: string; onClose: () => void }) {
  const supabase = createClient()
  const [items, setItems] = useState<GroceryItem[]>([])
  const [newItem, setNewItem] = useState('')
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)

  const loadItems = useCallback(async () => {
    const { data } = await supabase
      .from('grocery_items')
      .select('*')
      .eq('family_id', familyId)
      .order('category')
    setItems(data || [])
    setLoading(false)
  }, [familyId])

  useEffect(() => { loadItems() }, [loadItems])

  const toggleItem = async (id: string, checked: boolean) => {
    await supabase.from('grocery_items').update({ is_checked: !checked }).eq('id', id)
    setItems(prev => prev.map(i => i.id === id ? { ...i, is_checked: !checked } : i))
  }

  const addItem = async () => {
    if (!newItem.trim() || adding) return
    setAdding(true)
    const { data } = await supabase.from('grocery_items').insert({
      family_id: familyId,
      name: newItem.trim(),
      category: 'other',
      is_recurring: false,
    }).select().single()
    if (data) setItems(prev => [...prev, data])
    setNewItem('')
    setAdding(false)
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
  const progress = items.length ? (doneCount / items.length) * 100 : 0

  return (
    <div className="fixed inset-0 z-50 flex items-end" style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }}>
      <div className="w-full rounded-t-3xl max-h-[85vh] flex flex-col overflow-hidden"
        style={{ background: '#1A0C14', border: `1px solid ${CBorder}`, borderBottom: 'none' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b flex-shrink-0" style={{ borderColor: Border }}>
          <div>
            <p className="text-sm font-semibold" style={{ color: TextPri }}>🛒 Liste de courses</p>
            <p className="text-xs mt-0.5" style={{ color: TextTer }}>{doneCount}/{items.length} articles</p>
          </div>
          <div className="flex items-center gap-2">
            {doneCount > 0 && (
              <button
                onClick={resetAll}
                className="text-xs px-3 py-1.5 rounded-lg border transition-colors hover:opacity-70"
                style={{ borderColor: Border, color: TextTer }}>
                Tout remettre
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full transition-opacity hover:opacity-70"
              style={{ color: TextTer }}>
              ✕
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="px-5 pt-3 flex-shrink-0">
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(245,238,232,0.06)' }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%`, background: '#6B9E7D' }}
            />
          </div>
        </div>

        {/* Liste */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
          {loading ? (
            <div className="text-center py-10">
              <div className="w-6 h-6 border-2 rounded-full animate-spin mx-auto" style={{ borderColor: `${C}33`, borderTopColor: C }} />
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-2xl mb-2">🛒</p>
              <p className="text-sm" style={{ color: TextTer }}>La liste est vide</p>
            </div>
          ) : (
            Object.entries(grouped).map(([cat, catItems]) => (
              <div key={cat}>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] mb-2" style={{ color: TextTer }}>
                  {CATEGORIES[cat] || '🛒 Autres'}
                </p>
                <div className="rounded-xl overflow-hidden divide-y" style={{ background: 'rgba(245,238,232,0.03)', borderColor: Border, border: `1px solid ${Border}` }}>
                  {catItems.map(item => (
                    <div
                      key={item.id}
                      onClick={() => toggleItem(item.id, item.is_checked)}
                      className="flex items-center gap-3 px-4 py-3 cursor-pointer transition-opacity hover:opacity-80"
                      style={{ opacity: item.is_checked ? 0.4 : 1, borderColor: Border }}>
                      <div className="w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all"
                        style={item.is_checked
                          ? { background: '#6B9E7D', borderColor: '#6B9E7D' }
                          : { borderColor: 'rgba(245,238,232,0.20)' }
                        }>
                        {item.is_checked && <span className="text-white text-xs">✓</span>}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm" style={{ color: item.is_checked ? TextTer : TextPri, textDecoration: item.is_checked ? 'line-through' : 'none' }}>
                          {item.name}
                        </p>
                        {item.brand && <p className="text-xs" style={{ color: TextTer }}>{item.brand}</p>}
                      </div>
                      {item.quantity && (
                        <span className="text-xs px-2 py-0.5 rounded-full border"
                          style={{ borderColor: Border, color: TextTer, background: 'rgba(245,238,232,0.03)' }}>
                          {item.quantity}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Ajouter un article */}
        <div className="px-4 pb-6 pt-3 flex gap-2 border-t flex-shrink-0" style={{ borderColor: Border }}>
          <input
            type="text"
            value={newItem}
            onChange={e => setNewItem(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addItem()}
            placeholder="Ajouter un article..."
            className="flex-1 rounded-xl px-4 py-2.5 text-sm outline-none transition-all"
            style={{
              background: 'rgba(245,238,232,0.05)',
              border: `1px solid ${Border}`,
              color: TextPri,
            }}
          />
          <button
            onClick={addItem}
            disabled={!newItem.trim() || adding}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white transition-all disabled:opacity-40 hover:opacity-90"
            style={{ background: C }}>
            +
          </button>
        </div>
      </div>
    </div>
  )
}
