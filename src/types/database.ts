export interface Profile {
    id: string
    name: string
    title: string | null
    bio: string | null
    profile_image_url: string | null
    profile_image_visible: boolean
    email: string | null
    phone: string | null
    location: string | null
    resume_text: string | null
    resume_pdf_url: string | null
    created_at: string
    updated_at: string
}

export interface Service {
    id: string
    title: string
    description: string | null
    icon: string | null
    sort_order: number
    is_visible: boolean
    created_at: string
    updated_at: string
}

export interface Project {
    id: string
    title: string
    description: string | null
    image_url: string | null
    technologies: string[]
    project_url: string | null
    github_url: string | null
    sort_order: number
    is_visible: boolean
    created_at: string
    updated_at: string
}

export interface SocialLink {
    id: string
    platform: string
    url: string
    icon: string | null
    sort_order: number
    is_visible: boolean
    created_at: string
}

export interface SeoSettings {
    id: string
    page_name: string
    title: string | null
    description: string | null
    keywords: string[]
    og_image_url: string | null
    updated_at: string
}

export interface SectionVisibility {
    id: string
    section_name: string
    section_title: string
    is_visible: boolean
    sort_order: number
    updated_at: string
}

export interface ContactMessage {
    id: string
    name: string
    email: string
    subject: string | null
    message: string
    is_read: boolean
    created_at: string
}
