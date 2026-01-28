import { createClient } from '@/lib/supabase/server'
import { Globe, Smartphone, Palette, Code, Database, Cloud, Briefcase, Cpu } from 'lucide-react'

const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
    globe: Globe,
    smartphone: Smartphone,
    palette: Palette,
    code: Code,
    database: Database,
    cloud: Cloud,
    briefcase: Briefcase,
    cpu: Cpu,
}

export default async function ServicesSection() {
    const supabase = await createClient()
    const { data: services } = await supabase
        .from('services')
        .select('*')
        .eq('is_visible', true)
        .order('sort_order')

    if (!services || services.length === 0) return null

    return (
        <section className="py-24 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        <span className="gradient-text">خدماتي</span>
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        أقدم مجموعة متنوعة من الخدمات الاحترافية لمساعدتك في تحقيق أهدافك الرقمية
                    </p>
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service, index) => {
                        const Icon = iconMap[service.icon || 'briefcase'] || Briefcase
                        return (
                            <div
                                key={service.id}
                                className="glass rounded-2xl p-8 card-hover animate-fadeInUp"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-6">
                                    <Icon className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                                <p className="text-gray-400 leading-relaxed">{service.description}</p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
