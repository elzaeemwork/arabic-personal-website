import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Download } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

export default async function HeroSection() {
    const supabase = await createClient()
    const { data: profile } = await supabase
        .from('profile')
        .select('*')
        .single()

    if (!profile) return null

    return (
        <section className="min-h-screen flex items-center justify-center pt-16 px-4">
            <div className="max-w-7xl mx-auto w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Content */}
                    <div className="animate-fadeInUp">
                        <p className="text-indigo-400 text-lg mb-4">مرحباً بكم، أنا</p>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                            <span className="gradient-text">{profile.name}</span>
                        </h1>
                        <h2 className="text-2xl md:text-3xl text-gray-300 mb-6">
                            {profile.title}
                        </h2>
                        <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-xl">
                            {profile.bio}
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <Link
                                href="/contact"
                                className="btn-primary px-8 py-4 rounded-xl font-semibold flex items-center gap-2"
                            >
                                <span>تواصل معي</span>
                                <ArrowLeft className="w-5 h-5" />
                            </Link>

                            {profile.resume_pdf_url && (
                                <a
                                    href={profile.resume_pdf_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-8 py-4 rounded-xl font-semibold border border-white/20 hover:bg-white/10 transition-all flex items-center gap-2"
                                >
                                    <Download className="w-5 h-5" />
                                    <span>تحميل السيرة الذاتية</span>
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Profile Image */}
                    {profile.profile_image_visible && profile.profile_image_url && (
                        <div className="flex justify-center lg:justify-end animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl blur-3xl opacity-30 animate-pulse"></div>
                                <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-3xl overflow-hidden border-4 border-white/10">
                                    <Image
                                        src={profile.profile_image_url}
                                        alt={`صورة ${profile.name}`}
                                        fill
                                        sizes="(max-width: 768px) 288px, 384px"
                                        className="object-cover"
                                        priority
                                        loading="eager"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Placeholder if no image */}
                    {(!profile.profile_image_url || !profile.profile_image_visible) && (
                        <div className="flex justify-center lg:justify-end animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl blur-3xl opacity-30 animate-pulse"></div>
                                <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-3xl overflow-hidden border-4 border-white/10 bg-gradient-to-br from-indigo-500/20 to-purple-600/20 flex items-center justify-center">
                                    <span className="text-8xl font-bold gradient-text">{profile.name?.charAt(0) || 'م'}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}
