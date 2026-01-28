'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Save, Trash2, Loader2, Edit2, X, CheckCircle } from 'lucide-react'
import type { Service } from '@/types/database'

const iconOptions = [
    { value: 'globe', label: 'كرة أرضية' },
    { value: 'smartphone', label: 'هاتف ذكي' },
    { value: 'palette', label: 'لوحة ألوان' },
    { value: 'code', label: 'برمجة' },
    { value: 'database', label: 'قاعدة بيانات' },
    { value: 'cloud', label: 'سحابة' },
    { value: 'briefcase', label: 'حقيبة' },
    { value: 'cpu', label: 'معالج' },
]

export default function AdminServicesPage() {
    const [services, setServices] = useState<Service[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [isAdding, setIsAdding] = useState(false)
    const [message, setMessage] = useState('')
    const [formData, setFormData] = useState({ title: '', description: '', icon: 'briefcase' })

    useEffect(() => {
        fetchServices()
    }, [])

    const fetchServices = async () => {
        const supabase = createClient()
        const { data } = await supabase.from('services').select('*').order('sort_order')
        setServices(data || [])
        setIsLoading(false)
    }

    const handleAdd = async () => {
        const supabase = createClient()
        const { data, error } = await supabase
            .from('services')
            .insert([{ ...formData, sort_order: services.length }])
            .select()
            .single()

        if (!error && data) {
            setServices([...services, data])
            setFormData({ title: '', description: '', icon: 'briefcase' })
            setIsAdding(false)
            setMessage('تمت الإضافة بنجاح!')
        }
    }

    const handleUpdate = async (service: Service) => {
        const supabase = createClient()
        const { error } = await supabase
            .from('services')
            .update({
                title: service.title,
                description: service.description,
                icon: service.icon,
                is_visible: service.is_visible,
            })
            .eq('id', service.id)

        if (!error) {
            setEditingId(null)
            setMessage('تم التحديث بنجاح!')
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('هل أنت متأكد من حذف هذه الخدمة؟')) return

        const supabase = createClient()
        const { error } = await supabase.from('services').delete().eq('id', id)

        if (!error) {
            setServices(services.filter(s => s.id !== id))
            setMessage('تم الحذف بنجاح!')
        }
    }

    const toggleVisibility = async (service: Service) => {
        const newVisibility = !service.is_visible
        const supabase = createClient()
        await supabase.from('services').update({ is_visible: newVisibility }).eq('id', service.id)
        setServices(services.map(s => s.id === service.id ? { ...s, is_visible: newVisibility } : s))
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold gradient-text mb-2">إدارة الخدمات</h1>
                    <p className="text-gray-400">إضافة وتعديل وحذف الخدمات</p>
                </div>
                <button
                    onClick={() => setIsAdding(true)}
                    className="btn-primary px-4 py-2 rounded-xl flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    <span>إضافة خدمة</span>
                </button>
            </div>

            {message && (
                <div className="p-4 rounded-xl bg-green-500/10 text-green-400 flex items-center gap-3">
                    <CheckCircle className="w-5 h-5" />
                    <span>{message}</span>
                </div>
            )}

            {/* Add Form */}
            {isAdding && (
                <div className="glass rounded-2xl p-6">
                    <h2 className="text-xl font-bold mb-4">إضافة خدمة جديدة</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <input
                            type="text"
                            placeholder="عنوان الخدمة"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:outline-none"
                        />
                        <select
                            value={formData.icon}
                            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:outline-none"
                        >
                            {iconOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                    <textarea
                        placeholder="وصف الخدمة"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:outline-none mb-4 resize-none"
                        rows={3}
                    />
                    <div className="flex gap-2">
                        <button onClick={handleAdd} className="btn-primary px-4 py-2 rounded-lg flex items-center gap-2">
                            <Save className="w-4 h-4" />
                            <span>حفظ</span>
                        </button>
                        <button onClick={() => setIsAdding(false)} className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10">
                            إلغاء
                        </button>
                    </div>
                </div>
            )}

            {/* Services List */}
            <div className="space-y-4">
                {services.map((service) => (
                    <div key={service.id} className="glass rounded-2xl p-6">
                        {editingId === service.id ? (
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        value={service.title}
                                        onChange={(e) => setServices(services.map(s => s.id === service.id ? { ...s, title: e.target.value } : s))}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:outline-none"
                                    />
                                    <select
                                        value={service.icon || 'briefcase'}
                                        onChange={(e) => setServices(services.map(s => s.id === service.id ? { ...s, icon: e.target.value } : s))}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:outline-none"
                                    >
                                        {iconOptions.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <textarea
                                    value={service.description || ''}
                                    onChange={(e) => setServices(services.map(s => s.id === service.id ? { ...s, description: e.target.value } : s))}
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:outline-none resize-none"
                                    rows={3}
                                />
                                <div className="flex gap-2">
                                    <button onClick={() => handleUpdate(service)} className="btn-primary px-4 py-2 rounded-lg flex items-center gap-2">
                                        <Save className="w-4 h-4" />
                                        <span>حفظ</span>
                                    </button>
                                    <button onClick={() => setEditingId(null)} className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="text-lg font-bold mb-2">{service.title}</h3>
                                    <p className="text-gray-400">{service.description}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => toggleVisibility(service)}
                                        className={`px-3 py-1 rounded-lg text-sm ${service.is_visible ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}
                                    >
                                        {service.is_visible ? 'ظاهر' : 'مخفي'}
                                    </button>
                                    <button
                                        onClick={() => setEditingId(service.id)}
                                        className="p-2 rounded-lg hover:bg-white/10 transition-all"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(service.id)}
                                        className="p-2 rounded-lg hover:bg-red-500/10 text-red-400 transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
