'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X, Home, User, Briefcase, FolderOpen, Mail, FileText } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const navItems = [
    { href: '/', label: 'الرئيسية', icon: Home },
    { href: '/about', label: 'من أنا', icon: User },
    { href: '/services', label: 'الخدمات', icon: Briefcase },
    { href: '/projects', label: 'المشاريع', icon: FolderOpen },
    { href: '/resume', label: 'السيرة الذاتية', icon: FileText },
    { href: '/contact', label: 'تواصل معي', icon: Mail },
]

interface SiteSettings {
    site_name: string
    logo_letter: string
    font_family: string
}

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const [settings, setSettings] = useState<SiteSettings>({
        site_name: 'موقعي',
        logo_letter: 'م',
        font_family: 'Tajawal'
    })

    useEffect(() => {
        async function fetchSettings() {
            const supabase = createClient()
            const { data } = await supabase
                .from('site_settings')
                .select('site_name, logo_letter, font_family')
                .single()

            if (data) {
                setSettings(data)
            }
        }
        fetchSettings()
    }, [])

    return (
        <nav className="fixed top-0 right-0 left-0 z-50 glass">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                            <span className="text-white font-bold text-lg">{settings.logo_letter}</span>
                        </div>
                        <span className="text-xl font-bold gradient-text">{settings.site_name}</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
                            >
                                <item.icon className="w-4 h-4" />
                                <span>{item.label}</span>
                            </Link>
                        ))}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
                    >
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isOpen && (
                    <div className="md:hidden py-4 border-t border-white/10">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                            >
                                <item.icon className="w-5 h-5" />
                                <span>{item.label}</span>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </nav>
    )
}
