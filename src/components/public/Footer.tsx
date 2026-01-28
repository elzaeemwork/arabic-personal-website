import Link from 'next/link'
import { Github, Linkedin, Twitter, Mail } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

export default async function Footer() {
    const supabase = await createClient()
    const { data: socialLinks } = await supabase
        .from('social_links')
        .select('*')
        .eq('is_visible', true)
        .order('sort_order')

    const getIcon = (platform: string) => {
        switch (platform.toLowerCase()) {
            case 'github': return Github
            case 'linkedin': return Linkedin
            case 'twitter': return Twitter
            default: return Mail
        }
    }

    return (
        <footer className="glass mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Logo & Description */}
                    <div>
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                <span className="text-white font-bold text-lg">م</span>
                            </div>
                            <span className="text-xl font-bold gradient-text">موقعي</span>
                        </Link>
                        <p className="text-gray-400 leading-relaxed">
                            موقع شخصي احترافي يعرض خدماتي ومشاريعي وخبراتي في مجال تطوير البرمجيات
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 gradient-text">روابط سريعة</h3>
                        <ul className="space-y-2">
                            <li><Link href="/" className="text-gray-400 hover:text-white transition-colors">الرئيسية</Link></li>
                            <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">من أنا</Link></li>
                            <li><Link href="/services" className="text-gray-400 hover:text-white transition-colors">الخدمات</Link></li>
                            <li><Link href="/projects" className="text-gray-400 hover:text-white transition-colors">المشاريع</Link></li>
                            <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">تواصل معي</Link></li>
                        </ul>
                    </div>

                    {/* Social Links */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 gradient-text">تابعني</h3>
                        <div className="flex gap-3">
                            {socialLinks?.map((link) => {
                                const Icon = getIcon(link.platform)
                                return (
                                    <a
                                        key={link.id}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all duration-200 hover:scale-110"
                                    >
                                        <Icon className="w-5 h-5" />
                                    </a>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-12 pt-8 border-t border-white/10 text-center text-gray-400">
                    <p>جميع الحقوق محفوظة © {new Date().getFullYear()}</p>
                </div>
            </div>
        </footer>
    )
}
