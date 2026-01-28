'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
    LayoutDashboard,
    User,
    Briefcase,
    FolderOpen,
    Mail,
    Settings,
    LogOut,
    ExternalLink,
    Share2,
    Search
} from 'lucide-react'

const menuItems = [
    { href: '/admin', label: 'لوحة التحكم', icon: LayoutDashboard },
    { href: '/admin/profile', label: 'الملف الشخصي', icon: User },
    { href: '/admin/services', label: 'الخدمات', icon: Briefcase },
    { href: '/admin/projects', label: 'المشاريع', icon: FolderOpen },
    { href: '/admin/social', label: 'الروابط الاجتماعية', icon: Share2 },
    { href: '/admin/messages', label: 'الرسائل', icon: Mail },
    { href: '/admin/seo', label: 'إعدادات SEO', icon: Search },
    { href: '/admin/sections', label: 'التحكم بالأقسام', icon: Settings },
]

export default function AdminSidebar() {
    const pathname = usePathname()
    const router = useRouter()

    const handleLogout = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push('/admin/login')
        router.refresh()
    }

    return (
        <aside className="w-64 min-h-screen glass border-l border-white/10 flex flex-col">
            {/* Logo */}
            <div className="p-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">م</span>
                    </div>
                    <div>
                        <h1 className="font-bold gradient-text">لوحة التحكم</h1>
                        <p className="text-xs text-gray-400">إدارة الموقع</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4">
                <ul className="space-y-1">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                                            ? 'bg-gradient-to-l from-indigo-500/20 to-purple-500/20 text-white border-r-2 border-indigo-500'
                                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span>{item.label}</span>
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-white/10 space-y-2">
                <Link
                    href="/"
                    target="_blank"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200"
                >
                    <ExternalLink className="w-5 h-5" />
                    <span>عرض الموقع</span>
                </Link>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200"
                >
                    <LogOut className="w-5 h-5" />
                    <span>تسجيل الخروج</span>
                </button>
            </div>
        </aside>
    )
}
