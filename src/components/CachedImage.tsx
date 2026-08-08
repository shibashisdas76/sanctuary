import React, { useState, useEffect } from 'react';
import { cachedNetworkImageService } from '../services/cachedNetworkImageService';
import { ImageOff, Download, Zap } from 'lucide-react';

interface CachedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt?: string;
  className?: string;
  showBadge?: boolean;
  fallbackIcon?: React.ReactNode;
}

export const CachedImage: React.FC<CachedImageProps> = ({
  src,
  alt = '',
  className = '',
  showBadge = false,
  fallbackIcon,
  ...props
}) => {
  const [resolvedSrc, setResolvedSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [isFromCache, setIsFromCache] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(false);

    cachedNetworkImageService
      .getImage(src)
      .then(({ src: loadedSrc, isFromCache: cached }) => {
        if (isMounted) {
          setResolvedSrc(loadedSrc);
          setIsFromCache(cached);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          // Fallback to direct hotlink if fetch error occurred but src is available
          setResolvedSrc(src);
          setIsFromCache(false);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [src]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {loading && (
        <div className="absolute inset-0 bg-slate-200/60 dark:bg-slate-700/60 animate-pulse flex items-center justify-center rounded-[inherit] z-10">
          <div className="w-5 h-5 border-2 border-[#4a654e] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {error ? (
        <div className="w-full h-full min-h-[100px] bg-slate-100 flex flex-col items-center justify-center p-4 text-slate-400 rounded-[inherit]">
          {fallbackIcon || <ImageOff className="w-8 h-8 mb-1" />}
          <span className="text-xs">Image unavailable</span>
        </div>
      ) : (
        resolvedSrc && (
          <img
            src={resolvedSrc}
            alt={alt}
            onError={() => setError(true)}
            onLoad={() => setLoading(false)}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              loading ? 'opacity-0' : 'opacity-100'
            }`}
            {...props}
          />
        )
      )}

      {/* Flutter Dev Inspector Cache Badge */}
      {showBadge && !loading && !error && (
        <div
          className={`absolute top-2 right-2 text-[10px] font-mono px-2 py-0.5 rounded-full backdrop-blur-md shadow-xs flex items-center gap-1 z-20 ${
            isFromCache
              ? 'bg-emerald-500/90 text-white'
              : 'bg-sky-500/90 text-white'
          }`}
          title={isFromCache ? 'Loaded from SQFlite / Disk Memory Cache' : 'Downloaded over Network'}
        >
          {isFromCache ? (
            <>
              <Zap className="w-2.5 h-2.5 fill-current" />
              <span>Cached</span>
            </>
          ) : (
            <>
              <Download className="w-2.5 h-2.5" />
              <span>Network</span>
            </>
          )}
        </div>
      )}
    </div>
  );
};
