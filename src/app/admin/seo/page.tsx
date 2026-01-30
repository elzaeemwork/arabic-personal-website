'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Save, Loader2, CheckCircle, Search, RefreshCw, Info } from 'lucide-react'
import type { SeoSettings } from '@/types/database'

// Default SEO settings (same as lib/seo.ts)
const defaultSeoSettings: Record<string, { title: string; description: string; keywords: string[] }> = {
    home: {
        title: 'يوسف محمد | مهندس اتصالات ومطور تطبيقات ويب',
        description: 'يوسف محمد أسود الجوباني - مهندس اتصالات ومطور تطبيقات ويب من الموصل، العراق. متخصص في HTML5, CSS3, JavaScript, Node.js وتصميم واجهات المستخدم التفاعلية.',
        keywords: ['يوسف محمد', 'يوسف محمد أسود الجوباني', 'مهندس اتصالات', 'مطور تطبيقات ويب', 'الموصل', 'العراق', 'HTML5', 'CSS3', 'JavaScript', 'Node.js']
    },
    about: {
        title: 'من أنا - يوسف محمد أسود الجوباني',
        description: 'تعرف على يوسف محمد أسود الجوباني - مهندس اتصالات ومطور تطبيقات ويب من الموصل، العراق. خريج جامعة نينوى بخبرة في HTML5, CSS3, JavaScript, Node.js.',
        keywords: ['يوسف محمد', 'مهندس اتصالات', 'مطور ويب العراق', 'جامعة نينوى', 'مبرمج الموصل']
    },
    services: {
        title: 'خدمات تطوير المواقع والتطبيقات',
        description: 'خدمات يوسف محمد في تطوير البرمجيات - تطوير مواقع HTML5, CSS3, JavaScript, تطبيقات Node.js, REST APIs, تصميم واجهات Responsive Design.',
        keywords: ['تطوير مواقع', 'تطوير تطبيقات ويب', 'HTML5', 'CSS3', 'JavaScript', 'Node.js', 'REST API', 'تصميم واجهات', 'برمجة مواقع العراق']
    },
    projects: {
        title: 'المشاريع',
        description: 'مشاريع يوسف محمد في تطوير المواقع والتطبيقات - أمثلة عملية على أعمالي في HTML5, CSS3, JavaScript, Node.js.',
        keywords: ['مشاريع برمجية', 'تطوير مواقع', 'portfolio', 'أعمال برمجية']
    },
    resume: {
        title: 'السيرة الذاتية - مهندس اتصالات ومطور ويب',
        description: 'السيرة الذاتية ليوسف محمد أسود الجوباني - مهندس اتصالات وخريج جامعة نينوى. خبرة في HTML5, CSS3, JavaScript, Node.js, Git, REST APIs.',
        keywords: ['سيرة ذاتية مبرمج', 'CV مطور ويب', 'مهندس اتصالات العراق', 'خريج جامعة نينوى', 'JavaScript developer CV']
    },
    contact: {
        title: 'تواصل معي - يوسف محمد',
        description: 'تواصل مع يوسف محمد - مهندس اتصالات ومطور تطبيقات ويب من الموصل، العراق. استفسارات المشاريع البرمجية وطلبات التعاون.',
        keywords: ['تواصل مبرمج', 'طلب تطوير موقع', 'مطور ويب الموصل', 'استئجار مبرمج عراقي']
    }
}

const pageLabels: { [key: string]: string } = {
    home: 'الصفحة الرئيسية',
    about: 'من أنا',
    services: 'الخدمات',
    projects: 'المشاريع',
    resume: 'السيرة الذاتية',
    contact: 'تواصل معي',
}

const allPages = ['home', 'about', 'services', 'projects', 'resume', 'contact']

export default function AdminSeoPage() {
    const [settings, setSettings] = useState<SeoSettings[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState<string | null>(null)
    const [message, setMessage] = useState('')

    useEffect(() => {
        fetchSettings()
    }, [])

    const fetchSettings = async () => {
        const supabase = createClient()
        const { data } = await supabase.from('seo_settings').select('*').order('page_name')

        // Merge database data with defaults for all pages
        const mergedSettings: SeoSettings[] = allPages.map(pageName => {
            const dbSetting = data?.find(s => s.page_name === pageName)
            const defaults = defaultSeoSettings[pageName]

            if (dbSetting) {
                return {
                    ...dbSetting,
                    // Use database values, fall back to defaults if empty
                    title: dbSetting.title || defaults.title,
                    description: dbSetting.description || defaults.description,
                    keywords: dbSetting.keywords?.length > 0 ? dbSetting.keywords : defaults.keywords,
                }
            }

            // Create a virtual entry for pages not in database
            return {
                id: `virtual-${pageName}`,
                page_name: pageName,
                title: defaults.title,
                description: defaults.description,
                keywords: defaults.keywords,
                og_image_url: null,
                updated_at: new Date().toISOString(),
            }
        })

        setSettings(mergedSettings)
        setIsLoading(false)
    }

    const handleUpdate = async (setting: SeoSettings) => {
        setIsSaving(setting.id)
        setMessage('')
        const supabase = createClient()

        // Check if this is a virtual entry (not in database yet)
        if (setting.id.startsWith('virtual-')) {
            // Insert new entry
            const { error } = await supabase
                .from('seo_settings')
                .insert({
                    page_name: setting.page_name,
                    title: setting.title,
                    description: setting.description,
                    keywords: setting.keywords,
                })

            if (!error) {
                setMessage(`تم حفظ إعدادات ${pageLabels[setting.page_name]} بنجاح!`)
                fetchSettings() // Refresh to get the new ID
            } else {
                setMessage('حدث خطأ أثناء الحفظ')
            }
        } else {
            // Update existing entry
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
                setMessage(`تم حفظ إعدادات ${pageLabels[setting.page_name]} بنجاح!`)
            } else {
                setMessage('حدث خطأ أثناء الحفظ')
            }
        }
        setIsSaving(null)
        setTimeout(() => setMessage(''), 3000)
    }

    const resetToDefaults = (pageName: string) => {
        const defaults = defaultSeoSettings[pageName]
        setSettings(settings.map(s =>
            s.page_name === pageName
                ? { ...s, title: defaults.title, description: defaults.description, keywords: defaults.keywords }
                : s
        ))
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

            {/* Info Box */}
            <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-start gap-3">
                <Info className="w-5 h-5 text-indigo-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-gray-300">
                    <p className="font-medium text-indigo-400 mb-1">ملاحظة:</p>
                    <p>الحقول تعرض القيم الافتراضية من الكود. أي تعديل تحفظه سيظهر على الموقع مباشرة.</p>
                </div>
            </div>

            {message && (
                <div className="p-4 rounded-xl bg-green-500/10 text-green-400 flex items-center gap-3">
                    <CheckCircle className="w-5 h-5" /><span>{message}</span>
                </div>
            )}

            <div className="space-y-6">
                {settings.map((setting) => (
                    <div key={setting.id} className="glass rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                    <Search className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold">{pageLabels[setting.page_name] || setting.page_name}</h2>
                                    <p className="text-xs text-gray-500">/{setting.page_name === 'home' ? '' : setting.page_name}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => resetToDefaults(setting.page_name)}
                                className="text-xs text-gray-400 hover:text-indigo-400 flex items-center gap-1 transition-colors"
                                title="إعادة للقيم الافتراضية"
                            >
                                <RefreshCw className="w-3 h-3" />
                                <span>افتراضي</span>
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">عنوان الصفحة (Title)</label>
                                <input
                                    type="text"
                                    value={setting.title || ''}
                                    onChange={(e) => setSettings(settings.map(s => s.id === setting.id ? { ...s, title: e.target.value } : s))}
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:outline-none"
                                />
                                <p className="text-xs text-gray-500 mt-1">{(setting.title || '').length} حرف</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">الوصف (Description)</label>
                                <textarea
                                    value={setting.description || ''}
                                    onChange={(e) => setSettings(settings.map(s => s.id === setting.id ? { ...s, description: e.target.value } : s))}
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:outline-none resize-none"
                                    rows={3}
                                />
                                <p className="text-xs text-gray-500 mt-1">{(setting.description || '').length} حرف (الموصى: 150-160)</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">الكلمات المفتاحية (Keywords)</label>
                                <textarea
                                    value={setting.keywords?.join(', ') || ''}
                                    onChange={(e) => setSettings(settings.map(s => s.id === setting.id ? { ...s, keywords: e.target.value.split(',').map(k => k.trim()).filter(k => k) } : s))}
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:outline-none resize-none"
                                    rows={2}
                                    placeholder="كلمات مفتاحية مفصولة بفاصلة"
                                />
                                <p className="text-xs text-gray-500 mt-1">{setting.keywords?.length || 0} كلمات</p>
                            </div>

                            <button
                                onClick={() => handleUpdate(setting)}
                                disabled={isSaving === setting.id}
                                className="btn-primary px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
                            >
                                {isSaving === setting.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                <span>حفظ التغييرات</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
