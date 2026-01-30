import { Metadata } from 'next'
import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'
import AboutSection from '@/components/public/AboutSection'
import { generatePageMetadata } from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
    return generatePageMetadata('about', '/about')
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
