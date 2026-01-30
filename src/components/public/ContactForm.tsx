'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Send, Loader2, CheckCircle } from 'lucide-react'

export default function ContactForm() {
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')

        const formData = new FormData(e.currentTarget)
        const data = {
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            subject: formData.get('subject') as string,
            message: formData.get('message') as string,
        }

        try {
            const supabase = createClient()
            const { error: insertError } = await supabase
                .from('contact_messages')
                .insert([data])

            if (insertError) throw insertError

            // Send Telegram notification (don't wait for it, don't block on errors)
            fetch('/api/telegram', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            }).catch(console.error)

            setIsSuccess(true)
            e.currentTarget.reset()
        } catch (err) {
            setError('حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.')
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    if (isSuccess) {
        return (
            <div className="glass rounded-2xl p-8 text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">تم إرسال رسالتك بنجاح!</h3>
                <p className="text-gray-400">سأتواصل معك في أقرب وقت ممكن.</p>
                <button
                    onClick={() => setIsSuccess(false)}
                    className="mt-4 text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                    إرسال رسالة أخرى
                </button>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="glass rounded-2xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                        الاسم الكامل
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:outline-none transition-colors"
                        placeholder="أدخل اسمك"
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                        البريد الإلكتروني
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:outline-none transition-colors"
                        placeholder="أدخل بريدك الإلكتروني"
                    />
                </div>
            </div>

            <div className="mb-6">
                <label htmlFor="subject" className="block text-sm font-medium mb-2">
                    الموضوع
                </label>
                <input
                    type="text"
                    id="subject"
                    name="subject"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:outline-none transition-colors"
                    placeholder="موضوع الرسالة"
                />
            </div>

            <div className="mb-6">
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                    الرسالة
                </label>
                <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:outline-none transition-colors resize-none"
                    placeholder="اكتب رسالتك هنا..."
                />
            </div>

            {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                    {error}
                </div>
            )}

            <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary py-4 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>جاري الإرسال...</span>
                    </>
                ) : (
                    <>
                        <Send className="w-5 h-5" />
                        <span>إرسال الرسالة</span>
                    </>
                )}
            </button>
        </form>
    )
}
