'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Save, Trash2, Loader2, Edit2, X, CheckCircle } from 'lucide-react'
import type { SocialLink } from '@/types/database'

const platformOptions = [
    { value: 'github', label: 'GitHub' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'twitter', label: 'Twitter / X' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'youtube', label: 'YouTube' },
    { value: 'whatsapp', label: 'WhatsApp' },
    { value: 'telegram', label: 'Telegram' },
    { value: 'email', label: 'البريد الإلكتروني' },
]

export default function AdminSocialPage() {
    const [links, setLinks] = useState<SocialLink[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [isAdding, setIsAdding] = useState(false)
    const [message, setMessage] = useState('')
    const [formData, setFormData] = useState({ platform: 'github', url: '' })

    useEffect(() => {
        fetchLinks()
    }, [])

    const fetchLinks = async () => {
        const supabase = createClient()
        const { data } = await supabase.from('social_links').select('*').order('sort_order')
        setLinks(data || [])
        setIsLoading(false)
    }

    const handleAdd = async () => {
        const supabase = createClient()
        const { data, error } = await supabase
            .from('social_links')
            .insert([{ ...formData, icon: formData.platform, sort_order: links.length }])
            .select()
            .single()

        if (!error && data) {
            setLinks([...links, data])
            setFormData({ platform: 'github', url: '' })
            setIsAdding(false)
            setMessage('تمت الإضافة بنجاح!')
        }
    }

    const handleUpdate = async (link: SocialLink) => {
        const supabase = createClient()
        const { error } = await supabase
            .from('social_links')
            .update({ platform: link.platform, url: link.url, icon: link.platform, is_visible: link.is_visible })
            .eq('id', link.id)

        if (!error) {
            setEditingId(null)
            setMessage('تم التحديث بنجاح!')
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('هل أنت متأكد من حذف هذا الرابط؟')) return
        const supabase = createClient()
        const { error } = await supabase.from('social_links').delete().eq('id', id)
        if (!error) {
            setLinks(links.filter(l => l.id !== id))
            setMessage('تم الحذف بنجاح!')
        }
    }

    const toggleVisibility = async (link: SocialLink) => {
        const newVisibility = !link.is_visible
        const supabase = createClient()
        await supabase.from('social_links').update({ is_visible: newVisibility }).eq('id', link.id)
        setLinks(links.map(l => l.id === link.id ? { ...l, is_visible: newVisibility } : l))
    }

    if (isLoading) {
        return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold gradient-text mb-2">الروابط الاجتماعية</h1>
                    <p className="text-gray-400">إدارة روابط التواصل الاجتماعي</p>
                </div>
                <button onClick={() => setIsAdding(true)} className="btn-primary px-4 py-2 rounded-xl flex items-center gap-2">
                    <Plus className="w-5 h-5" /><span>إضافة رابط</span>
                </button>
            </div>

            {message && (
                <div className="p-4 rounded-xl bg-green-500/10 text-green-400 flex items-center gap-3">
                    <CheckCircle className="w-5 h-5" /><span>{message}</span>
                </div>
            )}

            {isAdding && (
                <div className="glass rounded-2xl p-6 space-y-4">
                    <h2 className="text-xl font-bold">إضافة رابط جديد</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <select value={formData.platform} onChange={(e) => setFormData({ ...formData, platform: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:outline-none">
                            {platformOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </select>
                        <input type="url" placeholder="الرابط" value={formData.url} onChange={(e) => setFormData({ ...formData, url: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:outline-none" />
                    </div>
                    <div className="flex gap-2">
                        <button onClick={handleAdd} className="btn-primary px-4 py-2 rounded-lg flex items-center gap-2"><Save className="w-4 h-4" /><span>حفظ</span></button>
                        <button onClick={() => setIsAdding(false)} className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10">إلغاء</button>
                    </div>
                </div>
            )}

            <div className="space-y-4">
                {links.map((link) => (
                    <div key={link.id} className="glass rounded-2xl p-6">
                        {editingId === link.id ? (
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <select value={link.platform} onChange={(e) => setLinks(links.map(l => l.id === link.id ? { ...l, platform: e.target.value } : l))} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:outline-none">
                                        {platformOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                    </select>
                                    <input type="url" value={link.url} onChange={(e) => setLinks(links.map(l => l.id === link.id ? { ...l, url: e.target.value } : l))} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:outline-none" />
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleUpdate(link)} className="btn-primary px-4 py-2 rounded-lg flex items-center gap-2"><Save className="w-4 h-4" /><span>حفظ</span></button>
                                    <button onClick={() => setEditingId(null)} className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10"><X className="w-4 h-4" /></button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-bold capitalize">{link.platform}</h3>
                                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-indigo-400 text-sm">{link.url}</a>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => toggleVisibility(link)} className={`px-3 py-1 rounded-lg text-sm ${link.is_visible ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                        {link.is_visible ? 'ظاهر' : 'مخفي'}
                                    </button>
                                    <button onClick={() => setEditingId(link.id)} className="p-2 rounded-lg hover:bg-white/10"><Edit2 className="w-4 h-4" /></button>
                                    <button onClick={() => handleDelete(link.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-red-400"><Trash2 className="w-4 h-4" /></button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
