import { useEffect, useState } from 'react';

interface PerformanceMetrics {
  renderTime: number;
  memoryUsage: number;
  apiResponseTime: number;
}

export const PerformanceMonitor = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderTime: 0,
    memoryUsage: 0,
    apiResponseTime: 0
  });

  useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.entryType === 'measure') {
          setMetrics(prev => ({
            ...prev,
            renderTime: entry.duration
          }));
        }
        if (entry.entryType === 'navigation') {
          const navEntry = entry as PerformanceNavigationTiming;
          setMetrics(prev => ({
            ...prev,
            apiResponseTime: navEntry.responseEnd - navEntry.requestStart
          }));
        }
      });
    });

    observer.observe({ entryTypes: ['measure', 'navigation'] });

    // Monitor memory usage
    const checkMemory = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        setMetrics(prev => ({
          ...prev,
          memoryUsage: memory.usedJSHeapSize / 1024 / 1024 // MB
        }));
      }
    };

    const interval = setInterval(checkMemory, 5000);

    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, []);

  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-2 rounded text-xs z-50">
      <div>Render: {metrics.renderTime.toFixed(2)}ms</div>
      <div>Memory: {metrics.memoryUsage.toFixed(2)}MB</div>
      <div>API: {metrics.apiResponseTime.toFixed(2)}ms</div>
    </div>
  );
};