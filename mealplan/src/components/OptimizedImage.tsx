import { memo, useState } from 'react';

interface OptimizedImageProps {
  src?: string;
  alt: string;
  className?: string;
  fallback?: string;
}

export const OptimizedImage = memo(({ 
  src, 
  alt, 
  className = "", 
  fallback = "🍽️" 
}: OptimizedImageProps) => {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (!src || error) {
    return (
      <div className={`flex items-center justify-center text-2xl ${className}`}>
        {fallback}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {!loaded && (
        <div className="absolute inset-0 bg-muted animate-pulse rounded" />
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} ${loaded ? 'opacity-100' : 'opacity-0'} transition-opacity`}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        loading="lazy"
      />
    </div>
  );
});