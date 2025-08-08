import React, { useMemo } from 'react';
import { calculatorsData } from '../data/calculators';
import { blogPosts } from '../data/blogPosts';
import BlogCard from './BlogCard';

interface RelatedBlogsProps {
  calculatorName: string;
  onSelectBlogPost: (slug: string) => void;
}

const RelatedBlogs: React.FC<RelatedBlogsProps> = ({ calculatorName, onSelectBlogPost }) => {
    const relatedBlogSlugs = useMemo(() => {
        const calcData = calculatorsData.flatMap(c => c.items).find(c => c.name === calculatorName);
        return calcData?.relatedBlogs || [];
    }, [calculatorName]);

    const posts = useMemo(() => {
        return relatedBlogSlugs.map(slug => blogPosts.find(p => p.slug === slug)).filter(Boolean);
    }, [relatedBlogSlugs]);

    if (posts.length === 0) {
        return null;
    }

    return (
        <div className="bg-surface-container rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-primary mb-4">Blogs and Read Our Guides</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {posts.slice(0, 2).map(post => post && (
                    <BlogCard key={post.slug} post={post} onSelect={() => onSelectBlogPost(post.slug)} />
                ))}
            </div>
        </div>
    );
};

export default RelatedBlogs;