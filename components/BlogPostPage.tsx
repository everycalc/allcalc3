import React, { useMemo } from 'react';
import { blogPosts, BlogPost } from '../data/blogPosts';
import AdsensePlaceholder from './AdsensePlaceholder';
import CalculatorLinkCard from './CalculatorLinkCard';

interface BlogPostPageProps {
  slug: string;
  onBack: () => void;
  onSelectCalculator: (name: string) => void;
}

const BlogPostPage: React.FC<BlogPostPageProps> = ({ slug, onBack, onSelectCalculator }) => {
    const post = useMemo(() => blogPosts.find(p => p.slug === slug), [slug]);

    if (!post) {
        return (
            <div className="flex flex-col min-h-screen">
                 <header className="page-header p-4 flex items-center shadow-md sticky top-0 z-10">
                    <button onClick={onBack} className="p-2 rounded-full hover:bg-surface-container-high transition-colors" aria-label="Go back to blog list">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h1 className="text-xl font-bold ml-4">Not Found</h1>
                </header>
                 <main className="flex-grow p-4 md:p-6 lg:p-8 max-w-3xl mx-auto w-full text-center">
                    <p>The blog post you're looking for could not be found.</p>
                </main>
            </div>
        );
    }
    
    // A more robust, multi-stage parser for the blog content.
    const renderContent = () => {
        // Stage 1: Split the entire content by the calculator tag, keeping the tag in the result array.
        const contentParts = post.content.split(/(\[CALCULATOR:.*?\])/g).filter(part => part.trim() !== '');

        const elements: React.ReactNode[] = contentParts.flatMap((part, index) => {
            // Stage 2: If a part is a calculator tag, render the CalculatorLinkCard component.
            if (part.startsWith('[CALCULATOR:')) {
                const calcMatch = part.match(/\[CALCULATOR:(.*?)\]/);
                if (calcMatch && calcMatch[1]) {
                    return [<CalculatorLinkCard key={`calc-${index}`} name={calcMatch[1]} onSelect={onSelectCalculator} />];
                }
                return []; // Return an empty array if the tag is malformed.
            }

            // Stage 3: If a part is plain text, process it for paragraphs.
            const paragraphs = part.split('\n\n').filter(p => p.trim() !== '');
            
            return paragraphs.map((paragraph, pIndex) => {
                // Stage 4: Process each paragraph for bold text using a non-greedy regex.
                const boldParts = paragraph.split(/(\*\*.*?\*\*)/g).filter(Boolean);
                return (
                    <p key={`p-${index}-${pIndex}`}>
                        {boldParts.map((boldPart, bIndex) => {
                            if (boldPart.startsWith('**') && boldPart.endsWith('**')) {
                                return <strong key={bIndex}>{boldPart.slice(2, -2)}</strong>;
                            }
                            return boldPart;
                        })}
                    </p>
                );
            });
        });

        // Inject Adsense placeholders between the rendered elements.
        const finalElementsWithAds: React.ReactNode[] = [];
        let contentBlockCount = 0;
        elements.forEach((el, i) => {
            finalElementsWithAds.push(el);
            
            // Count paragraphs and calculator cards as content blocks for ad placement.
            if (React.isValidElement(el) && (el.type === 'p' || el.type === CalculatorLinkCard)) {
                contentBlockCount++;
                // Add an ad after every 3 content blocks, but not after the very last one.
                if (contentBlockCount > 0 && contentBlockCount % 3 === 0 && i < elements.length - 1) {
                    finalElementsWithAds.push(<div key={`ad-${i}`} className="my-6"><AdsensePlaceholder /></div>);
                }
            }
        });

        return finalElementsWithAds;
    };


    return (
        <div className="flex flex-col min-h-screen">
            <header className="page-header p-4 flex items-center shadow-md sticky top-0 z-10">
                <button onClick={onBack} className="p-2 rounded-full hover:bg-surface-container-high transition-colors" aria-label="Go back to blog list">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 className="text-xl font-bold ml-4 truncate">{post.title}</h1>
            </header>
             <main className="flex-grow p-4 md:p-6 lg:p-8 max-w-3xl mx-auto w-full">
                <div className="bg-surface-container p-6 sm:p-8 rounded-lg shadow-lg">
                    <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-2">{post.title}</h1>
                    <p className="text-sm text-on-surface-variant mb-6">{post.category} &bull; {new Date().toLocaleDateString()}</p>
                    <article className="prose max-w-none space-y-4">
                        {renderContent()}
                    </article>
                </div>
            </main>
        </div>
    );
};

export default BlogPostPage;