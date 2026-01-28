import { createClient } from '@/lib/supabase/server'
import { ExternalLink, Github } from 'lucide-react'

export default async function ProjectsSection() {
    const supabase = await createClient()
    const { data: projects } = await supabase
        .from('projects')
        .select('*')
        .eq('is_visible', true)
        .order('sort_order')

    if (!projects || projects.length === 0) return null

    return (
        <section className="py-24 px-4 bg-white/5">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        <span className="gradient-text">أعمالي ومشاريعي</span>
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        استعرض بعض المشاريع التي عملت عليها وساهمت في تطويرها
                    </p>
                </div>

                {/* Projects Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {projects.map((project, index) => (
                        <div
                            key={project.id}
                            className="glass rounded-2xl overflow-hidden card-hover animate-fadeInUp"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            {/* Project Image */}
                            {project.image_url ? (
                                <div className="h-48 overflow-hidden">
                                    <img
                                        src={project.image_url}
                                        alt={project.title}
                                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                            ) : (
                                <div className="h-48 bg-gradient-to-br from-indigo-500/20 to-purple-600/20 flex items-center justify-center">
                                    <span className="text-4xl font-bold gradient-text">{project.title.charAt(0)}</span>
                                </div>
                            )}

                            {/* Project Content */}
                            <div className="p-6">
                                <h3 className="text-xl font-bold mb-3">{project.title}</h3>
                                <p className="text-gray-400 mb-4 leading-relaxed">{project.description}</p>

                                {/* Technologies */}
                                {project.technologies && project.technologies.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {project.technologies.map((tech: string, i: number) => (
                                            <span
                                                key={i}
                                                className="px-3 py-1 rounded-full text-sm bg-white/10 text-gray-300"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* Links */}
                                <div className="flex gap-4">
                                    {project.project_url && (
                                        <a
                                            href={project.project_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                            <span>معاينة</span>
                                        </a>
                                    )}
                                    {project.github_url && (
                                        <a
                                            href={project.github_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                                        >
                                            <Github className="w-4 h-4" />
                                            <span>الكود</span>
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
