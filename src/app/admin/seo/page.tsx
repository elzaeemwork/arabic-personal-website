'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Save, Loader2, CheckCircle, Search } from 'lucide-react'
import type { SeoSettings } from '@/types/database'

export default function AdminSeoPage() {
    const [settings, setSettings] = useState<SeoSettings[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [message, setMessage] = useState('')

    useEffect(() => {
        fetchSettings()
    }, [])

    const fetchSettings = async () => {
        const supabase = createClient()
        const { data } = await supabase.from('seo_settings').select('*').order('page_name')
        setSettings(data || [])
        setIsLoading(false)
    }

    const handleUpdate = async (setting: SeoSettings) => {
        setIsSaving(true)
        const supabase = createClient()
        const { error } = await supabase
            .from('seo_settings')
            .update({
                title: setting.title,
                description: setting.description,
                keywords: setting.keywords,
                updated_at: new Date().toISOString()
            })
            .eq('id', setting.id)

        if (!error) {
            setMessage('تم حفظ التغييرات بنجاح!')
        }
        setIsSaving(false)
    }

    const pageLabels: { [key: string]: string } = {
        home: 'الصفحة الرئيسية',
        about: 'من أنا',
        services: 'الخدمات',
        projects: 'المشاريع',
        contact: 'تواصل معي',
    }

    if (isLoading) {
        return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold gradient-text mb-2">إعدادات SEO</h1>
                <p className="text-gray-400">تحسين محركات البحث لكل صفحة</p>
            </div>

            {message && (
                <div className="p-4 rounded-xl bg-green-500/10 text-green-400 flex items-center gap-3">
                    <CheckCircle className="w-5 h-5" /><span>{message}</span>
                </div>
            )}

            <div className="space-y-6">
                {settings.map((setting) => (
                    <div key={setting.id} className="glass rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                <Search className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-bold">{pageLabels[setting.page_name] || setting.page_name}</h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">عنوان الصفحة (Title)</label>
                                <input
                                    type="text"
                                    value={setting.title || ''}
                                    onChange={(e) => setSettings(settings.map(s => s.id === setting.id ? { ...s, title: e.target.value } : s))}
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:outline-none"
                                    placeholder="عنوان الصفحة للظهور في محركات البحث"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">الوصف (Description)</label>
                                <textarea
                                    value={setting.description || ''}
                                    onChange={(e) => setSettings(settings.map(s => s.id === setting.id ? { ...s, description: e.target.value } : s))}
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:outline-none resize-none"
                                    rows={2}
                                    placeholder="وصف مختصر للصفحة (150-160 حرف)"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">الكلمات المفتاحية (Keywords)</label>
                                <input
                                    type="text"
                                    value={setting.keywords?.join(', ') || ''}
                                    onChange={(e) => setSettings(settings.map(s => s.id === setting.id ? { ...s, keywords: e.target.value.split(',').map(k => k.trim()) } : s))}
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:outline-none"
                                    placeholder="كلمات مفتاحية مفصولة بفاصلة"
                                />
                            </div>

                            <button
                                onClick={() => handleUpdate(setting)}
                                disabled={isSaving}
                                className="btn-primary px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
                            >
                                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                <span>حفظ التغييرات</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
