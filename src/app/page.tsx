import { Metadata } from 'next'
import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'
import HeroSection from '@/components/public/HeroSection'
import AboutSection from '@/components/public/AboutSection'
import ServicesSection from '@/components/public/ServicesSection'
import ProjectsSection from '@/components/public/ProjectsSection'

export const metadata: Metadata = {
  title: 'يوسف محمد | مهندس اتصالات ومطور تطبيقات ويب',
  description: 'يوسف محمد أسود الجوباني - مهندس اتصالات ومطور تطبيقات ويب من الموصل، العراق. متخصص في HTML5, CSS3, JavaScript, Node.js وتصميم واجهات المستخدم التفاعلية. تواصل معي لتحويل أفكارك إلى واقع رقمي.',
  alternates: {
    canonical: 'https://yousef-muhamed.vercel.app',
  },
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <ProjectsSection />
      </main>
      <Footer />
    </div>
  )
}
