'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Mail, Trash2, Eye, CheckCircle } from 'lucide-react'
import type { ContactMessage } from '@/types/database'

export default function AdminMessagesPage() {
    const [messages, setMessages] = useState<ContactMessage[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
    const [notification, setNotification] = useState('')

    useEffect(() => {
        fetchMessages()
    }, [])

    const fetchMessages = async () => {
        const supabase = createClient()
        const { data } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false })
        setMessages(data || [])
        setIsLoading(false)
    }

    const markAsRead = async (id: string) => {
        const supabase = createClient()
        await supabase.from('contact_messages').update({ is_read: true }).eq('id', id)
        setMessages(messages.map(m => m.id === id ? { ...m, is_read: true } : m))
    }

    const handleDelete = async (id: string) => {
        if (!confirm('هل أنت متأكد من حذف هذه الرسالة؟')) return
        const supabase = createClient()
        await supabase.from('contact_messages').delete().eq('id', id)
        setMessages(messages.filter(m => m.id !== id))
        if (selectedMessage?.id === id) setSelectedMessage(null)
        setNotification('تم حذف الرسالة')
    }

    const viewMessage = (message: ContactMessage) => {
        setSelectedMessage(message)
        if (!message.is_read) markAsRead(message.id)
    }

    if (isLoading) {
        return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold gradient-text mb-2">الرسائل</h1>
                <p className="text-gray-400">رسائل التواصل الواردة من الزوار</p>
            </div>

            {notification && (
                <div className="p-4 rounded-xl bg-green-500/10 text-green-400 flex items-center gap-3">
                    <CheckCircle className="w-5 h-5" /><span>{notification}</span>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Messages List */}
                <div className="lg:col-span-1 space-y-3 max-h-[600px] overflow-y-auto">
                    {messages.length === 0 ? (
                        <div className="glass rounded-2xl p-8 text-center">
                            <Mail className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                            <p className="text-gray-400">لا توجد رسائل</p>
                        </div>
                    ) : (
                        messages.map((message) => (
                            <div
                                key={message.id}
                                onClick={() => viewMessage(message)}
                                className={`glass rounded-xl p-4 cursor-pointer transition-all hover:bg-white/10 ${selectedMessage?.id === message.id ? 'border border-indigo-500' : ''} ${!message.is_read ? 'border-r-4 border-r-indigo-500' : ''}`}
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <span className="font-bold">{message.name}</span>
                                    {!message.is_read && <span className="w-2 h-2 rounded-full bg-indigo-500"></span>}
                                </div>
                                <p className="text-sm text-gray-400 truncate">{message.subject || message.message}</p>
                                <p className="text-xs text-gray-500 mt-2">{new Date(message.created_at).toLocaleDateString('ar-EG')}</p>
                            </div>
                        ))
                    )}
                </div>

                {/* Message Detail */}
                <div className="lg:col-span-2">
                    {selectedMessage ? (
                        <div className="glass rounded-2xl p-6">
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <h2 className="text-xl font-bold mb-1">{selectedMessage.name}</h2>
                                    <a href={`mailto:${selectedMessage.email}`} className="text-indigo-400 hover:underline">{selectedMessage.email}</a>
                                </div>
                                <button onClick={() => handleDelete(selectedMessage.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-red-400">
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                            {selectedMessage.subject && (
                                <div className="mb-4">
                                    <span className="text-sm text-gray-400">الموضوع:</span>
                                    <p className="font-medium">{selectedMessage.subject}</p>
                                </div>
                            )}
                            <div className="mb-4">
                                <span className="text-sm text-gray-400">الرسالة:</span>
                                <p className="mt-2 text-gray-300 leading-relaxed whitespace-pre-wrap">{selectedMessage.message}</p>
                            </div>
                            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                                <span className="text-sm text-gray-500">{new Date(selectedMessage.created_at).toLocaleString('ar-EG')}</span>
                                <a href={`mailto:${selectedMessage.email}?subject=رد: ${selectedMessage.subject || ''}`} className="btn-primary px-4 py-2 rounded-lg text-sm">
                                    الرد على الرسالة
                                </a>
                            </div>
                        </div>
                    ) : (
                        <div className="glass rounded-2xl p-12 text-center">
                            <Eye className="w-16 h-16 mx-auto mb-4 text-gray-400 opacity-50" />
                            <p className="text-gray-400">اختر رسالة لعرضها</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
