import { createClient } from '@/lib/supabase/server'
import { MapPin, Mail, Phone } from 'lucide-react'

export default async function AboutSection() {
    const supabase = await createClient()
    const { data: profile } = await supabase
        .from('profile')
        .select('*')
        .single()

    if (!profile) return null

    return (
        <section className="py-24 px-4 bg-white/5">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Image */}
                    {profile.profile_image_visible && profile.profile_image_url && (
                        <div className="animate-fadeInUp">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl blur-3xl opacity-20"></div>
                                <div className="relative rounded-3xl overflow-hidden border-4 border-white/10">
                                    <img
                                        src={profile.profile_image_url}
                                        alt={profile.name}
                                        className="w-full h-auto object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Content */}
                    <div className="animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">
                            <span className="gradient-text">من أنا</span>
                        </h2>

                        <p className="text-gray-300 text-lg leading-relaxed mb-8">
                            {profile.bio}
                        </p>

                        {/* Contact Info */}
                        <div className="space-y-4">
                            {profile.location && (
                                <div className="flex items-center gap-3 text-gray-400">
                                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                                        <MapPin className="w-5 h-5 text-indigo-400" />
                                    </div>
                                    <span>{profile.location}</span>
                                </div>
                            )}

                            {profile.email && (
                                <div className="flex items-center gap-3 text-gray-400">
                                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                                        <Mail className="w-5 h-5 text-indigo-400" />
                                    </div>
                                    <a href={`mailto:${profile.email}`} className="hover:text-white transition-colors">
                                        {profile.email}
                                    </a>
                                </div>
                            )}

                            {profile.phone && (
                                <div className="flex items-center gap-3 text-gray-400">
                                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                                        <Phone className="w-5 h-5 text-indigo-400" />
                                    </div>
                                    <a href={`tel:${profile.phone}`} className="hover:text-white transition-colors">
                                        {profile.phone}
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
