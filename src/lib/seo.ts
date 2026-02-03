import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'

const siteUrl = 'https://www.yousefmuhamed.com'

/**
 * Fetches SEO settings directly from database (no fallback)
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
            // Return empty values if no data in database
            return {
                title: '',
                description: '',
                keywords: []
            }
        }

        // Return database values directly (no fallback)
        return {
            title: data.title || '',
            description: data.description || '',
            keywords: data.keywords || []
        }
    } catch {
        return {
            title: '',
            description: '',
            keywords: []
        }
    }
}

/**
 * Generates metadata for a page using database SEO settings
 */
export async function generatePageMetadata(pageName: string, canonicalPath: string): Promise<Metadata> {
    const seo = await getSeoSettings(pageName)

    // Only include fields that have values
    const metadata: Metadata = {
        alternates: {
            canonical: `${siteUrl}${canonicalPath}`,
        },
    }

    if (seo.title) {
        metadata.title = seo.title
        metadata.openGraph = { ...metadata.openGraph, title: seo.title }
        metadata.twitter = { ...metadata.twitter, title: seo.title }
    }

    if (seo.description) {
        metadata.description = seo.description
        metadata.openGraph = { ...metadata.openGraph, description: seo.description }
        metadata.twitter = { ...metadata.twitter, description: seo.description }
    }

    if (seo.keywords && seo.keywords.length > 0) {
        metadata.keywords = seo.keywords
    }

    if (canonicalPath) {
        metadata.openGraph = { ...metadata.openGraph, url: `${siteUrl}${canonicalPath}` }
    }

    return metadata
}
