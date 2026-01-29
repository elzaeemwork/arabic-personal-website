import { Metadata } from 'next'
import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'
import AboutSection from '@/components/public/AboutSection'

export const metadata: Metadata = {
    title: 'من أنا',
    description: 'تعرف على يوسف محمد - مطور برمجيات محترف من الموصل، العراق. خبراتي ومهاراتي في تطوير المواقع والتطبيقات.',
    alternates: {
        canonical: 'https://yousef-muhamed.vercel.app/about',
    },
}

export default function AboutPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1 pt-16">
                <div className="py-12 px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">من أنا</h1>
                    <p className="text-gray-400 text-lg">تعرف على المزيد عني وعن خبراتي</p>
                </div>
                <AboutSection />
            </main>
            <Footer />
        </div>
    )
}
