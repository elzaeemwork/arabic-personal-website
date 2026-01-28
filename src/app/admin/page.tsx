import { createClient } from '@/lib/supabase/server'
import { User, Briefcase, FolderOpen, Mail, Eye } from 'lucide-react'

export default async function AdminDashboard() {
    const supabase = await createClient()

    const [
        { count: servicesCount },
        { count: projectsCount },
        { count: messagesCount },
        { data: unreadMessages },
    ] = await Promise.all([
        supabase.from('services').select('*', { count: 'exact', head: true }),
        supabase.from('projects').select('*', { count: 'exact', head: true }),
        supabase.from('contact_messages').select('*', { count: 'exact', head: true }),
        supabase.from('contact_messages').select('*').eq('is_read', false),
    ])

    const stats = [
        { label: 'الخدمات', value: servicesCount || 0, icon: Briefcase, color: 'from-blue-500 to-cyan-500' },
        { label: 'المشاريع', value: projectsCount || 0, icon: FolderOpen, color: 'from-purple-500 to-pink-500' },
        { label: 'الرسائل', value: messagesCount || 0, icon: Mail, color: 'from-green-500 to-emerald-500' },
        { label: 'رسائل غير مقروءة', value: unreadMessages?.length || 0, icon: Eye, color: 'from-orange-500 to-red-500' },
    ]

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold gradient-text mb-2">مرحباً بك في لوحة التحكم</h1>
                <p className="text-gray-400">إدارة موقعك الشخصي بسهولة</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="glass rounded-2xl p-6 card-hover">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4`}>
                            <stat.icon className="w-6 h-6 text-white" />
                        </div>
                        <p className="text-3xl font-bold mb-1">{stat.value}</p>
                        <p className="text-gray-400">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="glass rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-4">إجراءات سريعة</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <a
                        href="/admin/profile"
                        className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all flex items-center gap-3"
                    >
                        <User className="w-5 h-5 text-indigo-400" />
                        <span>تعديل الملف الشخصي</span>
                    </a>
                    <a
                        href="/admin/services"
                        className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all flex items-center gap-3"
                    >
                        <Briefcase className="w-5 h-5 text-indigo-400" />
                        <span>إضافة خدمة جديدة</span>
                    </a>
                    <a
                        href="/admin/projects"
                        className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all flex items-center gap-3"
                    >
                        <FolderOpen className="w-5 h-5 text-indigo-400" />
                        <span>إضافة مشروع جديد</span>
                    </a>
                </div>
            </div>

            {/* Recent Messages */}
            {unreadMessages && unreadMessages.length > 0 && (
                <div className="glass rounded-2xl p-6">
                    <h2 className="text-xl font-bold mb-4">أحدث الرسائل</h2>
                    <div className="space-y-4">
                        {unreadMessages.slice(0, 5).map((message) => (
                            <div key={message.id} className="p-4 rounded-xl bg-white/5 flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                                    <span className="text-white font-bold">{message.name.charAt(0)}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-medium">{message.name}</span>
                                        <span className="text-xs text-gray-400">{message.email}</span>
                                    </div>
                                    <p className="text-gray-400 text-sm truncate">{message.message}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
