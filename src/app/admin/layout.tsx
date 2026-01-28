import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminSidebar from '@/components/admin/AdminSidebar'

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Check if we're on login page
    const isLoginPage = typeof window !== 'undefined' && window.location.pathname === '/admin/login'

    if (!user && !isLoginPage) {
        redirect('/admin/login')
    }

    // If on login page, just render children without sidebar
    if (!user) {
        return <>{children}</>
    }

    return (
        <div className="flex min-h-screen">
            <AdminSidebar />
            <main className="flex-1 p-8 overflow-auto">
                {children}
            </main>
        </div>
    )
}
