import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'

const siteUrl = 'https://yousef-muhamed.vercel.app'

// Default SEO settings based on CV
const defaultSeoSettings: Record<string, { title: string; description: string; keywords: string[] }> = {
    home: {
        title: 'يوسف محمد | مهندس اتصالات ومطور تطبيقات ويب',
        description: 'يوسف محمد أسود الجوباني - مهندس اتصالات ومطور تطبيقات ويب من الموصل، العراق. متخصص في HTML5, CSS3, JavaScript, Node.js وتصميم واجهات المستخدم التفاعلية.',
        keywords: ['يوسف محمد', 'مهندس اتصالات', 'مطور تطبيقات ويب', 'الموصل', 'العراق']
    },
    about: {
        title: 'من أنا - يوسف محمد أسود الجوباني',
        description: 'تعرف على يوسف محمد أسود الجوباني - مهندس اتصالات ومطور تطبيقات ويب من الموصل، العراق. خريج جامعة نينوى بخبرة في HTML5, CSS3, JavaScript, Node.js.',
        keywords: ['يوسف محمد', 'مهندس اتصالات', 'مطور ويب العراق', 'جامعة نينوى']
    },
    services: {
        title: 'خدمات تطوير المواقع والتطبيقات',
        description: 'خدمات يوسف محمد في تطوير البرمجيات - تطوير مواقع HTML5, CSS3, JavaScript, تطبيقات Node.js, REST APIs, تصميم واجهات Responsive Design.',
        keywords: ['تطوير مواقع', 'تطوير تطبيقات ويب', 'HTML5', 'JavaScript', 'Node.js']
    },
    projects: {
        title: 'المشاريع',
        description: 'مشاريع يوسف محمد في تطوير المواقع والتطبيقات - أمثلة عملية على أعمالي في HTML5, CSS3, JavaScript, Node.js.',
        keywords: ['مشاريع برمجية', 'تطوير مواقع', 'portfolio']
    },
    resume: {
        title: 'السيرة الذاتية - مهندس اتصالات ومطور ويب',
        description: 'السيرة الذاتية ليوسف محمد أسود الجوباني - مهندس اتصالات وخريج جامعة نينوى. خبرة في HTML5, CSS3, JavaScript, Node.js, Git, REST APIs.',
        keywords: ['سيرة ذاتية مبرمج', 'CV مطور ويب', 'مهندس اتصالات العراق']
    },
    contact: {
        title: 'تواصل معي - يوسف محمد',
        description: 'تواصل مع يوسف محمد - مهندس اتصالات ومطور تطبيقات ويب من الموصل، العراق. استفسارات المشاريع البرمجية وطلبات التعاون.',
        keywords: ['تواصل مبرمج', 'طلب تطوير موقع', 'مطور ويب الموصل']
    }
}

/**
 * Fetches SEO settings from database or returns defaults
 */
export async function getSeoSettings(pageName: string): Promise<{
    title: string;
    description: string;
    keywords: string[];
}> {
    try {
        const supabase = await createClient()
        const { data, error } = await supabase
            .from('seo_settings')
            .select('title, description, keywords')
            .eq('page_name', pageName)
            .single()

        if (error || !data) {
            return defaultSeoSettings[pageName] || defaultSeoSettings.home
        }

        // Return database values, falling back to defaults for empty fields
        const defaults = defaultSeoSettings[pageName] || defaultSeoSettings.home
        return {
            title: data.title || defaults.title,
            description: data.description || defaults.description,
            keywords: data.keywords?.length > 0 ? data.keywords : defaults.keywords
        }
    } catch {
        return defaultSeoSettings[pageName] || defaultSeoSettings.home
    }
}

/**
 * Generates metadata for a page using database SEO settings
 */
export async function generatePageMetadata(pageName: string, canonicalPath: string): Promise<Metadata> {
    const seo = await getSeoSettings(pageName)

    return {
        title: seo.title,
        description: seo.description,
        keywords: seo.keywords,
        alternates: {
            canonical: `${siteUrl}${canonicalPath}`,
        },
        openGraph: {
            title: seo.title,
            description: seo.description,
            url: `${siteUrl}${canonicalPath}`,
        },
        twitter: {
            title: seo.title,
            description: seo.description,
        },
    }
}
