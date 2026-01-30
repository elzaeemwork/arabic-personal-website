'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Save, Loader2, CheckCircle, Search, RefreshCw, AlertTriangle, Database } from 'lucide-react'
import type { SeoSettings } from '@/types/database'

// Default SEO settings for initialization
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
    const [isInitializing, setIsInitializing] = useState(false)
    const [message, setMessage] = useState('')
    const [messageType, setMessageType] = useState<'success' | 'error' | 'warning'>('success')

    useEffect(() => {
        fetchSettings()
    }, [])

    const fetchSettings = async () => {
        const supabase = createClient()
        const { data } = await supabase.from('seo_settings').select('*').order('page_name')

        // Show actual database data (no fallback)
        const mergedSettings: SeoSettings[] = allPages.map(pageName => {
            const dbSetting = data?.find(s => s.page_name === pageName)

            if (dbSetting) {
                return dbSetting
            }

            // Create a virtual entry for pages not in database (empty values)
            return {
                id: `virtual-${pageName}`,
                page_name: pageName,
                title: '',
                description: '',
                keywords: [],
                og_image_url: null,
                updated_at: new Date().toISOString(),
            }
        })

        setSettings(mergedSettings)
        setIsLoading(false)
    }

    // Initialize all pages with default values
    const initializeAllDefaults = async () => {
        setIsInitializing(true)
        setMessage('')
        const supabase = createClient()

        let successCount = 0
        for (const pageName of allPages) {
            const existingSetting = settings.find(s => s.page_name === pageName && !s.id.startsWith('virtual-'))
            const defaults = defaultSeoSettings[pageName]

            if (existingSetting) {
                // Update existing
                const { error } = await supabase
                    .from('seo_settings')
                    .update({
                        title: defaults.title,
                        description: defaults.description,
                        keywords: defaults.keywords,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', existingSetting.id)
                if (!error) successCount++
            } else {
                // Insert new
                const { error } = await supabase
                    .from('seo_settings')
                    .insert({
                        page_name: pageName,
                        title: defaults.title,
                        description: defaults.description,
                        keywords: defaults.keywords,
                    })
                if (!error) successCount++
            }
        }

        if (successCount === allPages.length) {
            setMessage('تم تهيئة جميع الصفحات بالبيانات الافتراضية!')
            setMessageType('success')
        } else {
            setMessage(`تم تهيئة ${successCount} من ${allPages.length} صفحات`)
            setMessageType('warning')
        }

        await fetchSettings()
        setIsInitializing(false)
        setTimeout(() => setMessage(''), 3000)
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
                setMessageType('success')
                fetchSettings()
            } else {
                setMessage('حدث خطأ أثناء الحفظ')
                setMessageType('error')
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
                setMessageType('success')
            } else {
                setMessage('حدث خطأ أثناء الحفظ')
                setMessageType('error')
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

    const hasEmptySettings = settings.some(s => !s.title && !s.description && (!s.keywords || s.keywords.length === 0))

    if (isLoading) {
        return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold gradient-text mb-2">إعدادات SEO</h1>
                    <p className="text-gray-400">تحكم كامل بمحركات البحث لكل صفحة</p>
                </div>
                <button
                    onClick={initializeAllDefaults}
                    disabled={isInitializing}
                    className="btn-secondary px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
                >
                    {isInitializing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
                    <span>ملء البيانات الافتراضية</span>
                </button>
            </div>

            {/* Warning for empty settings */}
            {hasEmptySettings && (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-gray-300">
                        <p className="font-medium text-amber-400 mb-1">تنبيه: بعض الصفحات فارغة!</p>
                        <p>الصفحات الفارغة ستظهر بدون عنوان أو وصف. اضغط على &quot;ملء البيانات الافتراضية&quot; لتعبئتها.</p>
                    </div>
                </div>
            )}

            {message && (
                <div className={`p-4 rounded-xl flex items-center gap-3 ${messageType === 'success' ? 'bg-green-500/10 text-green-400' :
                        messageType === 'warning' ? 'bg-amber-500/10 text-amber-400' :
                            'bg-red-500/10 text-red-400'
                    }`}>
                    <CheckCircle className="w-5 h-5" /><span>{message}</span>
                </div>
            )}

            <div className="space-y-6">
                {settings.map((setting) => {
                    const isEmpty = !setting.title && !setting.description && (!setting.keywords || setting.keywords.length === 0)
                    const isVirtual = setting.id.startsWith('virtual-')

                    return (
                        <div key={setting.id} className={`glass rounded-2xl p-6 ${isEmpty ? 'border border-amber-500/30' : ''}`}>
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isEmpty ? 'bg-amber-500/20' : 'bg-gradient-to-br from-indigo-500 to-purple-600'
                                        }`}>
                                        <Search className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h2 className="text-xl font-bold">{pageLabels[setting.page_name] || setting.page_name}</h2>
                                            {isVirtual && <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-400">غير محفوظ</span>}
                                            {isEmpty && !isVirtual && <span className="text-xs px-2 py-0.5 rounded bg-red-500/20 text-red-400">فارغ</span>}
                                        </div>
                                        <p className="text-xs text-gray-500">/{setting.page_name === 'home' ? '' : setting.page_name}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => resetToDefaults(setting.page_name)}
                                    className="text-xs text-gray-400 hover:text-indigo-400 flex items-center gap-1 transition-colors"
                                    title="ملء بالقيم الافتراضية"
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
                                        className={`w-full px-4 py-3 rounded-xl bg-white/5 border focus:border-indigo-500 focus:outline-none ${!setting.title ? 'border-amber-500/30' : 'border-white/10'
                                            }`}
                                        placeholder="أدخل عنوان الصفحة..."
                                    />
                                    <p className="text-xs text-gray-500 mt-1">{(setting.title || '').length} حرف</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">الوصف (Description)</label>
                                    <textarea
                                        value={setting.description || ''}
                                        onChange={(e) => setSettings(settings.map(s => s.id === setting.id ? { ...s, description: e.target.value } : s))}
                                        className={`w-full px-4 py-3 rounded-xl bg-white/5 border focus:border-indigo-500 focus:outline-none resize-none ${!setting.description ? 'border-amber-500/30' : 'border-white/10'
                                            }`}
                                        rows={3}
                                        placeholder="أدخل وصف الصفحة..."
                                    />
                                    <p className={`text-xs mt-1 ${(setting.description || '').length > 160 ? 'text-amber-400' : 'text-gray-500'
                                        }`}>
                                        {(setting.description || '').length} حرف (الموصى: 150-160)
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">الكلمات المفتاحية (Keywords)</label>
                                    <textarea
                                        value={setting.keywords?.join(', ') || ''}
                                        onChange={(e) => setSettings(settings.map(s => s.id === setting.id ? { ...s, keywords: e.target.value.split(',').map(k => k.trim()).filter(k => k) } : s))}
                                        className={`w-full px-4 py-3 rounded-xl bg-white/5 border focus:border-indigo-500 focus:outline-none resize-none ${!setting.keywords?.length ? 'border-amber-500/30' : 'border-white/10'
                                            }`}
                                        rows={2}
                                        placeholder="كلمات مفتاحية مفصولة بفاصلة..."
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
                    )
                })}
            </div>
        </div>
    )
}
