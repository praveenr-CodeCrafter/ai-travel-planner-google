

import React, { useState, useEffect } from 'react';
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
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
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
    }, [attractionName, destination]);

    if (isLoading) {
        return <ImageSkeletonLoader />;
    }

    if (error && !imageUrl) {
        return <div className="w-full h-full bg-red-100 flex items-center justify-center text-red-600 rounded-lg">{error}</div>;
    }

    return (
        <img
            src={imageUrl ?? ''}
            alt={`AI generated image of ${attractionName}`}
            className="w-full h-full object-cover transition-opacity duration-500 opacity-0 transition-transform duration-300 ease-in-out group-hover:scale-110 attraction-image"
            onLoad={(e) => (e.currentTarget.style.opacity = '1')}
            data-attraction-name={attractionName}
        />
    );
};


export default GeneratedImage;