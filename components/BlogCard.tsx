import React from 'react';
import { BlogPost } from '../data/blogPosts';

interface BlogCardProps {
  post: BlogPost;
  onSelect: () => void;
}

const BlogCard: React.FC<BlogCardProps> = ({ post, onSelect }) => {
  return (
    <div
      onClick={onSelect}
      role="button"
      tabIndex={0}
      className="blog-card group focus:outline-none focus:ring-2 focus:ring-offset-2 p-4 h-full"
      aria-label={`Read blog post: ${post.title}`}
    >
      <div className="flex flex-col h-full">
        <p className="text-xs font-bold text-primary uppercase tracking-wide mb-2">{post.category}</p>
        <h3 className="text-md font-bold text-on-surface mb-2 flex-grow">{post.title}</h3>
        <p className="text-sm text-on-surface-variant line-clamp-3">{post.excerpt}</p>
      </div>
    </div>
  );
};

export default BlogCard;
