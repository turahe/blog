export type Blogs = {
    slug: string;
    title: string;
    image: string | null;
    subtitle: string;
    description: string;
    content: string;
    is_sticky: boolean;
    published_at: string;
    language: string;
    layout: string;
    tags: string[];
    created_at: string;
    updated_at: string;
};