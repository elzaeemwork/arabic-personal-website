import { Metadata } from 'next'
import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'
import ContactForm from '@/components/public/ContactForm'
import { createClient } from '@/lib/supabase/server'
import { MapPin, Mail, Phone } from 'lucide-react'

export const metadata: Metadata = {
    title: 'تواصل معي | موقعي الشخصي',
    description: 'تواصل معي للاستفسارات والمشاريع',
}

export default async function ContactPage() {
    const supabase = await createClient()
    const { data: profile } = await supabase
        .from('profile')
        .select('*')
        .single()

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1 pt-16">
                <div className="py-12 px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">تواصل معي</h1>
                    <p className="text-gray-400 text-lg">أنا هنا لمساعدتك. لا تتردد في التواصل</p>
                </div>

                <section className="py-12 px-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            {/* Contact Info */}
                            <div className="animate-fadeInUp">
                                <h2 className="text-2xl font-bold mb-6">معلومات التواصل</h2>
                                <p className="text-gray-400 mb-8 leading-relaxed">
                                    إذا كان لديك أي استفسار أو ترغب في التعاون في مشروع، لا تتردد في التواصل معي.
                                    سأكون سعيداً بالرد على رسائلكم في أقرب وقت ممكن.
                                </p>

                                <div className="space-y-4">
                                    {profile?.location && (
                                        <div className="flex items-center gap-4 p-4 glass rounded-xl">
                                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                                <MapPin className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-400">الموقع</p>
                                                <p className="font-medium">{profile.location}</p>
                                            </div>
                                        </div>
                                    )}

                                    {profile?.email && (
                                        <div className="flex items-center gap-4 p-4 glass rounded-xl">
                                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                                <Mail className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-400">البريد الإلكتروني</p>
                                                <a href={`mailto:${profile.email}`} className="font-medium hover:text-indigo-400 transition-colors">
                                                    {profile.email}
                                                </a>
                                            </div>
                                        </div>
                                    )}

                                    {profile?.phone && (
                                        <div className="flex items-center gap-4 p-4 glass rounded-xl">
                                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                                <Phone className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-400">الهاتف</p>
                                                <a href={`tel:${profile.phone}`} className="font-medium hover:text-indigo-400 transition-colors">
                                                    {profile.phone}
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Contact Form */}
                            <div className="animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                                <h2 className="text-2xl font-bold mb-6">أرسل رسالة</h2>
                                <ContactForm />
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    )
}
