import { Metadata } from 'next'
import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'
import ServicesSection from '@/components/public/ServicesSection'

export const metadata: Metadata = {
    title: 'خدمات تطوير المواقع والتطبيقات',
    description: 'خدمات يوسف محمد في تطوير البرمجيات - تطوير مواقع HTML5, CSS3, JavaScript, تطبيقات Node.js, REST APIs, تصميم واجهات Responsive Design, وحلول برمجية احترافية.',
    keywords: [
        'تطوير مواقع',
        'تطوير تطبيقات ويب',
        'HTML5 CSS3 JavaScript',
        'Node.js developer',
        'REST API',
        'تصميم واجهات',
        'برمجة مواقع العراق',
    ],
    alternates: {
        canonical: 'https://yousef-muhamed.vercel.app/services',
    },
}

export default function ServicesPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1 pt-16">
                <div className="py-12 px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">الخدمات</h1>
                    <p className="text-gray-400 text-lg">استكشف الخدمات الاحترافية التي أقدمها</p>
                </div>
                <ServicesSection />
            </main>
            <Footer />
        </div>
    )
}
