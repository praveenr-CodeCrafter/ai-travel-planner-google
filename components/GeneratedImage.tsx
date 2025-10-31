import React, { useState, useEffect, useRef } from 'react';
import { generateImageForAttraction } from '../services/geminiService';

interface GeneratedImageProps {
    attractionName: string;
    destination: string;
}

const ImageSkeletonLoader: React.FC = () => (
    <div className="w-full h-full bg-slate-200 dark:bg-slate-700 animate-pulse rounded-lg"></div>
);

const GeneratedImage: React.FC<GeneratedImageProps> = ({ attractionName, destination }) => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isInView, setIsInView] = useState(false);
    const imageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                // Only trigger once
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            },
            {
                // Pre-load images that are 250px below the viewport
                rootMargin: '0px 0px 250px 0px',
            }
        );

        const currentRef = imageRef.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, []);

    useEffect(() => {
        // Don't fetch until the component is in view
        if (!isInView) return;

        const fetchImage = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const url = await generateImageForAttraction(attractionName, destination);
                setImageUrl(url);
            } catch (err) {
                setError('Could not generate image.');
                // Fallback to picsum on error, as service does
                setImageUrl(`https://picsum.photos/seed/${encodeURIComponent(attractionName)}/1280/720`);
            } finally {
                setIsLoading(false);
            }
        };

        fetchImage();
         // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isInView, attractionName, destination]);

    return (
        <div ref={imageRef} className="w-full h-full">
            { isLoading || !isInView ? (
                <ImageSkeletonLoader />
            ) : error && !imageUrl ? (
                <div className="w-full h-full bg-red-100 flex items-center justify-center text-red-600 rounded-lg">{error}</div>
            ) : (
                 <img
                    src={imageUrl ?? ''}
                    alt={`AI generated image of ${attractionName}`}
                    className="w-full h-full object-cover transition-opacity duration-500 opacity-0 transition-transform duration-300 ease-in-out group-hover:scale-110 attraction-image"
                    onLoad={(e) => (e.currentTarget.style.opacity = '1')}
                    data-attraction-name={attractionName}
                />
            )}
        </div>
    );
};


export default GeneratedImage;