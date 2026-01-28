'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Eye, EyeOff, GripVertical, CheckCircle } from 'lucide-react'
import type { SectionVisibility } from '@/types/database'

export default function AdminSectionsPage() {
    const [sections, setSections] = useState<SectionVisibility[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [message, setMessage] = useState('')

    useEffect(() => {
        fetchSections()
    }, [])

    const fetchSections = async () => {
        const supabase = createClient()
        const { data } = await supabase.from('sections_visibility').select('*').order('sort_order')
        setSections(data || [])
        setIsLoading(false)
    }

    const toggleVisibility = async (section: SectionVisibility) => {
        const newVisibility = !section.is_visible
        const supabase = createClient()
        await supabase.from('sections_visibility').update({ is_visible: newVisibility }).eq('id', section.id)
        setSections(sections.map(s => s.id === section.id ? { ...s, is_visible: newVisibility } : s))
        setMessage(`تم ${newVisibility ? 'إظهار' : 'إخفاء'} قسم ${section.section_title}`)
    }

    const moveSection = async (index: number, direction: 'up' | 'down') => {
        if ((direction === 'up' && index === 0) || (direction === 'down' && index === sections.length - 1)) return

        const newIndex = direction === 'up' ? index - 1 : index + 1
        const newSections = [...sections]
        const temp = newSections[index]
        newSections[index] = newSections[newIndex]
        newSections[newIndex] = temp

        // Update sort_order for both
        const supabase = createClient()
        await Promise.all([
            supabase.from('sections_visibility').update({ sort_order: newIndex }).eq('id', temp.id),
            supabase.from('sections_visibility').update({ sort_order: index }).eq('id', newSections[index].id)
        ])

        setSections(newSections)
        setMessage('تم تغيير ترتيب الأقسام')
    }

    if (isLoading) {
        return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold gradient-text mb-2">التحكم بالأقسام</h1>
                <p className="text-gray-400">إظهار وإخفاء أقسام الموقع</p>
            </div>

            {message && (
                <div className="p-4 rounded-xl bg-green-500/10 text-green-400 flex items-center gap-3">
                    <CheckCircle className="w-5 h-5" /><span>{message}</span>
                </div>
            )}

            <div className="glass rounded-2xl p-6">
                <div className="space-y-3">
                    {sections.map((section, index) => (
                        <div
                            key={section.id}
                            className={`flex items-center justify-between p-4 rounded-xl transition-all ${section.is_visible ? 'bg-white/5' : 'bg-red-500/5 border border-red-500/20'}`}
                        >
                            <div className="flex items-center gap-4">
                                <div className="flex flex-col gap-1">
                                    <button
                                        onClick={() => moveSection(index, 'up')}
                                        disabled={index === 0}
                                        className="p-1 rounded hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                                    </button>
                                    <button
                                        onClick={() => moveSection(index, 'down')}
                                        disabled={index === sections.length - 1}
                                        className="p-1 rounded hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                    </button>
                                </div>
                                <GripVertical className="w-5 h-5 text-gray-500" />
                                <div>
                                    <h3 className="font-bold">{section.section_title}</h3>
                                    <p className="text-sm text-gray-400">{section.section_name}</p>
                                </div>
                            </div>

                            <button
                                onClick={() => toggleVisibility(section)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${section.is_visible ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'}`}
                            >
                                {section.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                <span>{section.is_visible ? 'ظاهر' : 'مخفي'}</span>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
