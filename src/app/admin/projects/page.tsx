'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Save, Trash2, Loader2, Edit2, X, CheckCircle, Upload } from 'lucide-react'
import type { Project } from '@/types/database'

export default function AdminProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [isAdding, setIsAdding] = useState(false)
    const [message, setMessage] = useState('')
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        technologies: '',
        project_url: '',
        github_url: '',
        image_url: ''
    })

    useEffect(() => {
        fetchProjects()
    }, [])

    const fetchProjects = async () => {
        const supabase = createClient()
        const { data } = await supabase.from('projects').select('*').order('sort_order')
        setProjects(data || [])
        setIsLoading(false)
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, projectId?: string) => {
        const file = e.target.files?.[0]
        if (!file) return

        const supabase = createClient()
        const fileName = `project-${Date.now()}.${file.name.split('.').pop()}`
        const { error: uploadError } = await supabase.storage.from('images').upload(fileName, file, { upsert: true })

        if (uploadError) {
            setMessage('حدث خطأ أثناء رفع الصورة')
            return
        }

        const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(fileName)

        if (projectId) {
            await supabase.from('projects').update({ image_url: publicUrl }).eq('id', projectId)
            setProjects(projects.map(p => p.id === projectId ? { ...p, image_url: publicUrl } : p))
        } else {
            setFormData({ ...formData, image_url: publicUrl })
        }
        setMessage('تم رفع الصورة بنجاح!')
    }

    const handleAdd = async () => {
        const supabase = createClient()
        const { data, error } = await supabase
            .from('projects')
            .insert([{
                ...formData,
                technologies: formData.technologies.split(',').map(t => t.trim()).filter(Boolean),
                sort_order: projects.length
            }])
            .select()
            .single()

        if (!error && data) {
            setProjects([...projects, data])
            setFormData({ title: '', description: '', technologies: '', project_url: '', github_url: '', image_url: '' })
            setIsAdding(false)
            setMessage('تمت الإضافة بنجاح!')
        }
    }

    const handleUpdate = async (project: Project) => {
        const supabase = createClient()
        const { error } = await supabase
            .from('projects')
            .update({
                title: project.title,
                description: project.description,
                technologies: project.technologies,
                project_url: project.project_url,
                github_url: project.github_url,
                image_url: project.image_url,
                is_visible: project.is_visible,
            })
            .eq('id', project.id)

        if (!error) {
            setEditingId(null)
            setMessage('تم التحديث بنجاح!')
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('هل أنت متأكد من حذف هذا المشروع؟')) return
        const supabase = createClient()
        const { error } = await supabase.from('projects').delete().eq('id', id)
        if (!error) {
            setProjects(projects.filter(p => p.id !== id))
            setMessage('تم الحذف بنجاح!')
        }
    }

    const toggleVisibility = async (project: Project) => {
        const newVisibility = !project.is_visible
        const supabase = createClient()
        await supabase.from('projects').update({ is_visible: newVisibility }).eq('id', project.id)
        setProjects(projects.map(p => p.id === project.id ? { ...p, is_visible: newVisibility } : p))
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
                    <h1 className="text-3xl font-bold gradient-text mb-2">إدارة المشاريع</h1>
                    <p className="text-gray-400">إضافة وتعديل وحذف المشاريع</p>
                </div>
                <button onClick={() => setIsAdding(true)} className="btn-primary px-4 py-2 rounded-xl flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    <span>إضافة مشروع</span>
                </button>
            </div>

            {message && (
                <div className="p-4 rounded-xl bg-green-500/10 text-green-400 flex items-center gap-3">
                    <CheckCircle className="w-5 h-5" />
                    <span>{message}</span>
                </div>
            )}

            {isAdding && (
                <div className="glass rounded-2xl p-6 space-y-4">
                    <h2 className="text-xl font-bold">إضافة مشروع جديد</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" placeholder="عنوان المشروع" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:outline-none" />
                        <input type="text" placeholder="التقنيات (مفصولة بفاصلة)" value={formData.technologies} onChange={(e) => setFormData({ ...formData, technologies: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:outline-none" />
                    </div>
                    <textarea placeholder="وصف المشروع" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:outline-none resize-none" rows={3} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="url" placeholder="رابط المشروع" value={formData.project_url} onChange={(e) => setFormData({ ...formData, project_url: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:outline-none" />
                        <input type="url" placeholder="رابط GitHub" value={formData.github_url} onChange={(e) => setFormData({ ...formData, github_url: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:outline-none" />
                    </div>
                    <div>
                        <label className="btn-primary px-4 py-2 rounded-lg cursor-pointer inline-flex items-center gap-2">
                            <Upload className="w-4 h-4" />
                            <span>رفع صورة المشروع</span>
                            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e)} className="hidden" />
                        </label>
                        {formData.image_url && <span className="mr-4 text-green-400 text-sm">تم رفع الصورة</span>}
                    </div>
                    <div className="flex gap-2">
                        <button onClick={handleAdd} className="btn-primary px-4 py-2 rounded-lg flex items-center gap-2">
                            <Save className="w-4 h-4" /><span>حفظ</span>
                        </button>
                        <button onClick={() => setIsAdding(false)} className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10">إلغاء</button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map((project) => (
                    <div key={project.id} className="glass rounded-2xl overflow-hidden">
                        {project.image_url && (
                            <div className="h-40 overflow-hidden">
                                <img src={project.image_url} alt={project.title} className="w-full h-full object-cover" />
                            </div>
                        )}
                        <div className="p-6">
                            {editingId === project.id ? (
                                <div className="space-y-3">
                                    <input type="text" value={project.title} onChange={(e) => setProjects(projects.map(p => p.id === project.id ? { ...p, title: e.target.value } : p))} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:outline-none" />
                                    <textarea value={project.description || ''} onChange={(e) => setProjects(projects.map(p => p.id === project.id ? { ...p, description: e.target.value } : p))} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:outline-none resize-none" rows={2} />
                                    <input type="text" placeholder="التقنيات (مفصولة بفاصلة)" value={project.technologies?.join(', ') || ''} onChange={(e) => setProjects(projects.map(p => p.id === project.id ? { ...p, technologies: e.target.value.split(',').map(t => t.trim()) } : p))} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:outline-none" />
                                    <label className="px-3 py-1 rounded-lg border border-white/20 cursor-pointer inline-flex items-center gap-2 text-sm">
                                        <Upload className="w-3 h-3" /><span>تغيير الصورة</span>
                                        <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, project.id)} className="hidden" />
                                    </label>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleUpdate(project)} className="btn-primary px-3 py-1 rounded-lg text-sm flex items-center gap-1"><Save className="w-3 h-3" /><span>حفظ</span></button>
                                        <button onClick={() => setEditingId(null)} className="px-3 py-1 rounded-lg border border-white/20 text-sm"><X className="w-3 h-3" /></button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="text-lg font-bold">{project.title}</h3>
                                        <div className="flex items-center gap-1">
                                            <button onClick={() => toggleVisibility(project)} className={`px-2 py-1 rounded text-xs ${project.is_visible ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                                {project.is_visible ? 'ظاهر' : 'مخفي'}
                                            </button>
                                            <button onClick={() => setEditingId(project.id)} className="p-1 rounded hover:bg-white/10"><Edit2 className="w-4 h-4" /></button>
                                            <button onClick={() => handleDelete(project.id)} className="p-1 rounded hover:bg-red-500/10 text-red-400"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </div>
                                    <p className="text-gray-400 text-sm mb-3">{project.description}</p>
                                    {project.technologies && project.technologies.length > 0 && (
                                        <div className="flex flex-wrap gap-1">
                                            {project.technologies.map((tech, i) => (
                                                <span key={i} className="px-2 py-0.5 rounded bg-white/10 text-xs">{tech}</span>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
