'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Save, Loader2, Upload, Trash2, Eye, EyeOff, CheckCircle } from 'lucide-react'
import type { Profile } from '@/types/database'

export default function AdminProfilePage() {
    const [profile, setProfile] = useState<Profile | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [message, setMessage] = useState('')

    useEffect(() => {
        fetchProfile()
    }, [])

    const fetchProfile = async () => {
        const supabase = createClient()
        const { data } = await supabase.from('profile').select('*').single()
        setProfile(data)
        setIsLoading(false)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!profile) return

        setIsSaving(true)
        setMessage('')

        const supabase = createClient()
        const { error } = await supabase
            .from('profile')
            .update({
                name: profile.name,
                title: profile.title,
                bio: profile.bio,
                email: profile.email,
                phone: profile.phone,
                location: profile.location,
                resume_text: profile.resume_text,
                profile_image_visible: profile.profile_image_visible,
                updated_at: new Date().toISOString(),
            })
            .eq('id', profile.id)

        if (error) {
            setMessage('حدث خطأ أثناء الحفظ')
        } else {
            setMessage('تم الحفظ بنجاح!')
        }
        setIsSaving(false)
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file || !profile) return

        setIsUploading(true)
        const supabase = createClient()

        // Upload to storage
        const fileName = `profile-${Date.now()}.${file.name.split('.').pop()}`
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('images')
            .upload(fileName, file, { upsert: true })

        if (uploadError) {
            setMessage('حدث خطأ أثناء رفع الصورة')
            setIsUploading(false)
            return
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(fileName)

        // Update profile
        const { error } = await supabase
            .from('profile')
            .update({ profile_image_url: publicUrl })
            .eq('id', profile.id)

        if (!error) {
            setProfile({ ...profile, profile_image_url: publicUrl })
            setMessage('تم رفع الصورة بنجاح!')
        }
        setIsUploading(false)
    }

    const handleDeleteImage = async () => {
        if (!profile) return

        const supabase = createClient()
        const { error } = await supabase
            .from('profile')
            .update({ profile_image_url: null })
            .eq('id', profile.id)

        if (!error) {
            setProfile({ ...profile, profile_image_url: null })
            setMessage('تم حذف الصورة')
        }
    }

    const toggleImageVisibility = async () => {
        if (!profile) return

        const newVisibility = !profile.profile_image_visible
        const supabase = createClient()
        const { error } = await supabase
            .from('profile')
            .update({ profile_image_visible: newVisibility })
            .eq('id', profile.id)

        if (!error) {
            setProfile({ ...profile, profile_image_visible: newVisibility })
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold gradient-text mb-2">الملف الشخصي</h1>
                <p className="text-gray-400">تعديل معلوماتك الشخصية</p>
            </div>

            {message && (
                <div className={`p-4 rounded-xl flex items-center gap-3 ${message.includes('خطأ') ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
                    <CheckCircle className="w-5 h-5" />
                    <span>{message}</span>
                </div>
            )}

            {/* Profile Image Section */}
            <div className="glass rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-4">الصورة الشخصية</h2>
                <div className="flex items-start gap-6">
                    <div className="w-32 h-32 rounded-2xl overflow-hidden bg-white/5 flex items-center justify-center">
                        {profile?.profile_image_url ? (
                            <img src={profile.profile_image_url} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-4xl font-bold gradient-text">{profile?.name?.charAt(0) || 'م'}</span>
                        )}
                    </div>
                    <div className="space-y-3">
                        <label className="btn-primary px-4 py-2 rounded-lg cursor-pointer inline-flex items-center gap-2">
                            <Upload className="w-4 h-4" />
                            <span>{isUploading ? 'جاري الرفع...' : 'رفع صورة جديدة'}</span>
                            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={isUploading} />
                        </label>
                        <div className="flex gap-2">
                            <button
                                onClick={toggleImageVisibility}
                                className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10 transition-all flex items-center gap-2"
                            >
                                {profile?.profile_image_visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                <span>{profile?.profile_image_visible ? 'إخفاء' : 'إظهار'}</span>
                            </button>
                            {profile?.profile_image_url && (
                                <button
                                    onClick={handleDeleteImage}
                                    className="px-4 py-2 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-all flex items-center gap-2"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    <span>حذف</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Profile Form */}
            <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 space-y-6">
                <h2 className="text-xl font-bold">المعلومات الأساسية</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">الاسم الكامل</label>
                        <input
                            type="text"
                            value={profile?.name || ''}
                            onChange={(e) => setProfile({ ...profile!, name: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">المسمى الوظيفي</label>
                        <input
                            type="text"
                            value={profile?.title || ''}
                            onChange={(e) => setProfile({ ...profile!, title: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:outline-none"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">نبذة تعريفية</label>
                    <textarea
                        rows={4}
                        value={profile?.bio || ''}
                        onChange={(e) => setProfile({ ...profile!, bio: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:outline-none resize-none"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">البريد الإلكتروني</label>
                        <input
                            type="email"
                            value={profile?.email || ''}
                            onChange={(e) => setProfile({ ...profile!, email: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">رقم الهاتف</label>
                        <input
                            type="tel"
                            value={profile?.phone || ''}
                            onChange={(e) => setProfile({ ...profile!, phone: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">الموقع</label>
                        <input
                            type="text"
                            value={profile?.location || ''}
                            onChange={(e) => setProfile({ ...profile!, location: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:outline-none"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">السيرة الذاتية (نص)</label>
                    <textarea
                        rows={8}
                        value={profile?.resume_text || ''}
                        onChange={(e) => setProfile({ ...profile!, resume_text: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:outline-none resize-none"
                        placeholder="أدخل سيرتك الذاتية هنا..."
                    />
                </div>

                <button
                    type="submit"
                    disabled={isSaving}
                    className="btn-primary px-8 py-3 rounded-xl font-semibold flex items-center gap-2 disabled:opacity-50"
                >
                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    <span>{isSaving ? 'جاري الحفظ...' : 'حفظ التغييرات'}</span>
                </button>
            </form>
        </div>
    )
}
