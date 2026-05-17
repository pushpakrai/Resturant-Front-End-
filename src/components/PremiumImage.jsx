import { useState, useCallback, useEffect } from 'react';
import { Diamond, Info, ExternalLink } from 'lucide-react';
import axios from 'axios';
import { API } from '../context/AuthContext';

/**
 * Remote images with gold shimmer while loading and a branded fallback if the URL fails.
 * Includes mandatory Unsplash attribution and download tracking for production use.
 */
export default function PremiumImage({
  src,
  alt,
  className = '',
  imgClassName = '',
  wrapperClassName = '',
  photographer = null,
  downloadLocation = null,
  emoji = '✨',
}) {
  const [phase, setPhase] = useState('loading');
  const [showCredit, setShowCredit] = useState(false);

  const onLoad = useCallback(() => {
    setPhase('loaded');
  }, []);

  const onError = useCallback(() => setPhase('error'), []);

  // Unsplash Compliance: Trigger download track when image is displayed
  useEffect(() => {
    if (phase === 'loaded' && downloadLocation) {
      axios.post(`${API}/utils/unsplash-download`, { downloadLocation })
        .catch(() => {}); // Silent fail for compliance tracking
    }
  }, [phase, downloadLocation]);

  return (
    <div 
      className={`relative overflow-hidden bg-deep-accent ${wrapperClassName} ${className}`}
      onMouseEnter={() => setShowCredit(true)}
      onMouseLeave={() => setShowCredit(false)}
    >
      {phase !== 'error' && (
        <>
          {phase === 'loading' && (
            <div
              className="absolute inset-0 z-10 premium-img-shimmer pointer-events-none opacity-50"
              aria-hidden
            />
          )}
          <img
            src={src}
            alt={alt}
            onLoad={onLoad}
            onError={onError}
            className={`w-full h-full object-cover transition-opacity duration-700 ${
              phase === 'loaded' ? 'opacity-100' : 'opacity-0'
            } ${imgClassName}`}
            loading="lazy"
            decoding="async"
          />

          {/* Cinematic Vignette */}
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(10,10,10,0.6)_100%)] mix-blend-multiply transition-opacity duration-1000" style={{ opacity: phase === 'loaded' ? 1 : 0 }} />
          
          {/* Subtle Scanline Overlay */}
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.05)_50%)] bg-[length:100%_4px] mix-blend-overlay transition-opacity duration-1000" style={{ opacity: phase === 'loaded' ? 1 : 0 }} />

          {/* Unsplash Attribution Compliance */}
          {photographer && phase === 'loaded' && (
            <div className={`absolute bottom-0 right-0 p-2 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${showCredit ? 'opacity-100' : 'opacity-0'}`}>
              <a 
                href={photographer.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[8px] uppercase tracking-widest text-cream/90 hover:text-gold"
              >
                <span>Photo by {photographer.name}</span>
                <ExternalLink size={8} />
              </a>
            </div>
          )}
        </>
      )}
      {phase === 'error' && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-deep-accent via-deep to-wine/20 text-gold-light/90 px-4 select-none"
          role="img"
          aria-label={alt || 'Diamond Queen placeholder'}
        >
          <span className="text-4xl filter grayscale-[0.5] opacity-80">{emoji}</span>
          <Diamond size={24} strokeWidth={1.2} className="opacity-40" />
          <span className="text-[10px] uppercase tracking-[0.4em] text-center text-gold/40 font-medium">
            Diamond Queen
          </span>
        </div>
      )}
    </div>
  );
}
