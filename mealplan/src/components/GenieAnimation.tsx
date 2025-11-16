import { lazy, Suspense, useState, useEffect, memo } from 'react';

const Lottie = lazy(() => import('lottie-react'));

interface GenieAnimationProps {
  className?: string;
}

const GenieAnimationComponent = ({ className = "w-16 h-16" }: GenieAnimationProps) => {
  const [animationData, setAnimationData] = useState(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShouldLoad(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!shouldLoad) return;
    
    fetch('/aladdin-genie.json')
      .then(response => response.json())
      .then(data => setAnimationData(data))
      .catch(() => setAnimationData(null));
  }, [shouldLoad]);

  const fallback = (
    <div className={`${className} flex items-center justify-center`}>
      <div className="text-4xl animate-bounce">🧞♂️</div>
    </div>
  );

  if (!shouldLoad || !animationData) {
    return fallback;
  }

  return (
    <div className={className}>
      <Suspense fallback={fallback}>
        <Lottie 
          animationData={animationData}
          loop
          autoplay
          rendererSettings={{
            preserveAspectRatio: 'xMidYMid slice',
            progressiveLoad: true
          }}
        />
      </Suspense>
    </div>
  );
};

export const GenieAnimation = memo(GenieAnimationComponent);