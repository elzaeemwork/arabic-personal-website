import { Metadata } from 'next'
import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'
import ProjectsSection from '@/components/public/ProjectsSection'
import { generatePageMetadata } from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
    return generatePageMetadata('projects', '/projects')
}

export default function ProjectsPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1 pt-16">
                <div className="py-12 px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">المشاريع</h1>
                    <p className="text-gray-400 text-lg">استعرض بعض المشاريع التي عملت عليها</p>
                </div>
                <ProjectsSection />
            </main>
            <Footer />
        </div>
    )
}
