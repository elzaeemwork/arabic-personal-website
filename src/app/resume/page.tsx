import { Metadata } from 'next'
import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'
import { createClient } from '@/lib/supabase/server'
import { Download, FileText } from 'lucide-react'

export const metadata: Metadata = {
    title: 'السيرة الذاتية',
    description: 'السيرة الذاتية ليوسف محمد - مطور برمجيات محترف. اطلع على خبراتي ومهاراتي المهنية في تطوير البرمجيات.',
    alternates: {
        canonical: 'https://yousef-muhamed.vercel.app/resume',
    },
}

export default async function ResumePage() {
    const supabase = await createClient()
    const { data: profile } = await supabase
        .from('profile')
        .select('*')
        .single()

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1 pt-16">
                <div className="py-12 px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">السيرة الذاتية</h1>
                    <p className="text-gray-400 text-lg">خبراتي ومهاراتي المهنية</p>
                </div>

                <section className="py-12 px-4">
                    <div className="max-w-4xl mx-auto">
                        {/* Download Button */}
                        {profile?.resume_pdf_url && (
                            <div className="text-center mb-12">
                                <a
                                    href={profile.resume_pdf_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-3 btn-primary px-8 py-4 rounded-xl font-semibold"
                                >
                                    <Download className="w-5 h-5" />
                                    <span>تحميل السيرة الذاتية (PDF)</span>
                                </a>
                            </div>
                        )}

                        {/* Resume Content */}
                        <div className="glass rounded-2xl p-8 md:p-12">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                    <FileText className="w-8 h-8" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold">{profile?.name}</h2>
                                    <p className="text-gray-400">{profile?.title}</p>
                                </div>
                            </div>

                            {/* Resume Text Content */}
                            {profile?.resume_text ? (
                                <div className="prose prose-invert max-w-none">
                                    <div
                                        className="text-gray-300 leading-relaxed whitespace-pre-wrap"
                                        dangerouslySetInnerHTML={{ __html: profile.resume_text.replace(/\n/g, '<br />') }}
                                    />
                                </div>
                            ) : (
                                <div className="text-center py-12 text-gray-400">
                                    <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                    <p>لم يتم إضافة محتوى السيرة الذاتية بعد</p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    )
}
