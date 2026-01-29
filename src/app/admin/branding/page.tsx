'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Save, Type, Palette, RefreshCw } from 'lucide-react'

interface SiteSettings {
    site_name: string
    logo_letter: string
    logo_font: string
}

const fontOptions = [
    { value: 'Times New Roman', label: 'Times New Roman', style: 'font-serif' },
    { value: 'Arial', label: 'Arial', style: 'font-sans' },
    { value: 'Georgia', label: 'Georgia', style: 'font-serif' },
    { value: 'Courier New', label: 'Courier New', style: 'font-mono' },
    { value: 'Tajawal', label: 'Tajawal (عربي)', style: 'font-tajawal' },
    { value: 'Verdana', label: 'Verdana', style: 'font-sans' },
    { value: 'Impact', label: 'Impact', style: 'font-sans' },
    { value: 'Comic Sans MS', label: 'Comic Sans MS', style: 'font-sans' },
    { value: 'Trebuchet MS', label: 'Trebuchet MS', style: 'font-sans' },
    { value: 'Palatino Linotype', label: 'Palatino Linotype', style: 'font-serif' },
]

export default function BrandingPage() {
    const [settings, setSettings] = useState<SiteSettings>({
        site_name: 'Elzaeem',
        logo_letter: 'Y',
        logo_font: 'Times New Roman'
    })
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    useEffect(() => {
        loadSettings()
    }, [])

    const loadSettings = async () => {
        const supabase = createClient()
        const { data, error } = await supabase
            .from('site_settings')
            .select('setting_key, setting_value')

        if (error) {
            console.error('Error loading settings:', error)
            setLoading(false)
            return
        }

        if (data) {
            const settingsObj: SiteSettings = {
                site_name: 'Elzaeem',
                logo_letter: 'Y',
                logo_font: 'Times New Roman'
            }

            data.forEach((item) => {
                if (item.setting_key === 'site_name') settingsObj.site_name = item.setting_value
                if (item.setting_key === 'logo_letter') settingsObj.logo_letter = item.setting_value
                if (item.setting_key === 'logo_font') settingsObj.logo_font = item.setting_value
            })

            setSettings(settingsObj)
        }
        setLoading(false)
    }

    const handleSave = async () => {
        setSaving(true)
        setMessage(null)

        const supabase = createClient()

        try {
            // Update each setting
            const updates = [
                { setting_key: 'site_name', setting_value: settings.site_name },
                { setting_key: 'logo_letter', setting_value: settings.logo_letter },
                { setting_key: 'logo_font', setting_value: settings.logo_font }
            ]

            for (const update of updates) {
                const { error } = await supabase
                    .from('site_settings')
                    .upsert(update, { onConflict: 'setting_key' })

                if (error) throw error
            }

            setMessage({ type: 'success', text: 'تم حفظ الإعدادات بنجاح!' })
        } catch (error) {
            console.error('Error saving settings:', error)
            setMessage({ type: 'error', text: 'حدث خطأ أثناء الحفظ' })
        }

        setSaving(false)
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <RefreshCw className="w-8 h-8 animate-spin text-indigo-500" />
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">هوية الموقع</h1>
                    <p className="text-gray-400 mt-1">تخصيص اسم الموقع والشعار</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="btn-primary px-6 py-3 rounded-xl flex items-center gap-2 disabled:opacity-50"
                >
                    <Save className="w-5 h-5" />
                    {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                </button>
            </div>

            {/* Message */}
            {message && (
                <div className={`p-4 rounded-xl ${message.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Settings Form */}
                <div className="glass rounded-2xl p-6 space-y-6">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                        <Type className="w-5 h-5 text-indigo-400" />
                        إعدادات النص
                    </h2>

                    {/* Site Name */}
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">اسم الموقع</label>
                        <input
                            type="text"
                            value={settings.site_name}
                            onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:outline-none text-lg"
                            placeholder="مثال: Elzaeem"
                        />
                    </div>

                    {/* Logo Letter */}
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">حرف الشعار</label>
                        <input
                            type="text"
                            maxLength={2}
                            value={settings.logo_letter}
                            onChange={(e) => setSettings({ ...settings, logo_letter: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:outline-none text-2xl text-center"
                            placeholder="مثال: Y"
                        />
                        <p className="text-xs text-gray-500 mt-1">حرف أو حرفين كحد أقصى</p>
                    </div>

                    {/* Font Selection */}
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">خط الشعار</label>
                        <select
                            value={settings.logo_font}
                            onChange={(e) => setSettings({ ...settings, logo_font: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:outline-none"
                        >
                            {fontOptions.map((font) => (
                                <option key={font.value} value={font.value} className="bg-slate-800">
                                    {font.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Live Preview */}
                <div className="glass rounded-2xl p-6 space-y-6">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                        <Palette className="w-5 h-5 text-purple-400" />
                        معاينة مباشرة
                    </h2>

                    {/* Preview Card */}
                    <div className="bg-slate-800/50 rounded-xl p-8 space-y-6">
                        {/* Navbar Preview */}
                        <div>
                            <p className="text-xs text-gray-500 mb-3">شريط التنقل</p>
                            <div className="glass rounded-xl p-4 flex items-center gap-3">
                                <div
                                    className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center"
                                >
                                    <span
                                        className="text-white font-bold text-lg"
                                        style={{ fontFamily: settings.logo_font }}
                                    >
                                        {settings.logo_letter || 'Y'}
                                    </span>
                                </div>
                                <span className="text-xl font-bold gradient-text">
                                    {settings.site_name || 'Elzaeem'}
                                </span>
                            </div>
                        </div>

                        {/* Footer Preview */}
                        <div>
                            <p className="text-xs text-gray-500 mb-3">التذييل</p>
                            <div className="glass rounded-xl p-4 flex items-center gap-3">
                                <div
                                    className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center"
                                >
                                    <span
                                        className="text-white font-bold text-lg"
                                        style={{ fontFamily: settings.logo_font }}
                                    >
                                        {settings.logo_letter || 'Y'}
                                    </span>
                                </div>
                                <span className="text-xl font-bold gradient-text">
                                    {settings.site_name || 'Elzaeem'}
                                </span>
                            </div>
                        </div>

                        {/* Large Preview */}
                        <div>
                            <p className="text-xs text-gray-500 mb-3">الشعار بحجم كبير</p>
                            <div className="flex items-center justify-center">
                                <div
                                    className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl"
                                >
                                    <span
                                        className="text-white font-bold text-5xl"
                                        style={{ fontFamily: settings.logo_font }}
                                    >
                                        {settings.logo_letter || 'Y'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Font Preview */}
                    <div className="bg-slate-800/50 rounded-xl p-4">
                        <p className="text-xs text-gray-500 mb-2">معاينة الخط: {settings.logo_font}</p>
                        <p
                            className="text-3xl text-center py-4"
                            style={{ fontFamily: settings.logo_font }}
                        >
                            ABCDEFGHIJKLMNOPQRSTUVWXYZ
                        </p>
                        <p
                            className="text-3xl text-center py-2"
                            style={{ fontFamily: settings.logo_font }}
                        >
                            abcdefghijklmnopqrstuvwxyz
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
