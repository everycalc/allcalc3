import React, { useState, useMemo } from 'react';
import { blogPosts, BlogPost } from '../data/blogPosts';
import BlogCard from './BlogCard';
import AdsensePlaceholder from './AdsensePlaceholder';

interface BlogPageProps {
  onBack: () => void;
  onSelectPost: (slug: string) => void;
}

const BlogPage: React.FC<BlogPageProps> = ({ onBack, onSelectPost }) => {
    const [selectedCategory, setSelectedCategory] = useState('All');

    const categories = useMemo(() => ['All', ...Array.from(new Set(blogPosts.map(p => p.category)))], []);

    const filteredPosts = useMemo(() => {
        if (selectedCategory === 'All') {
            return blogPosts;
        }
        return blogPosts.filter(p => p.category === selectedCategory);
    }, [selectedCategory]);

    return (
        <div className="flex flex-col min-h-screen">
            <header className="page-header p-4 flex items-center shadow-md sticky top-0 z-10">
                <button onClick={onBack} className="p-2 rounded-full hover:bg-surface-container-high transition-colors" aria-label="Go back to home page">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 className="text-xl font-bold ml-4">Blog & Guides</h1>
            </header>
            <main className="flex-grow p-4 md:p-6 lg:p-8 max-w-6xl mx-auto w-full">
                <div className="mb-6">
                    <div className="flex flex-wrap gap-2">
                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${selectedCategory === category ? 'bg-primary text-on-primary' : 'bg-surface-container hover:bg-surface-container-high'}`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPosts.map((post, index) => (
                        <React.Fragment key={post.slug}>
                            <BlogCard post={post} onSelect={() => onSelectPost(post.slug)} />
                            {(index + 1) % 6 === 0 && (
                                <div className="sm:col-span-2 lg:col-span-3">
                                    <AdsensePlaceholder />
                                </div>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default BlogPage;
