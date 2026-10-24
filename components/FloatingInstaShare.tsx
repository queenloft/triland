import React from 'react';

const FloatingInstaShare: React.FC = () => {
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const instaShareUrl = `https://www.instagram.com/?url=${encodeURIComponent(shareUrl)}`;

  return (
    <>
      <style>{`
        .floating-insta-share {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 1000;
          background: linear-gradient(45deg, #f58529, #dd2a7b, #8134af, #515bd4);
          border-radius: 50%;
          width: 64px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 24px 0 rgba(221,42,123,0.25), 0 1.5px 8px 0 rgba(81,91,212,0.15);
          border: 3px solid #fff;
          animation: insta-pulse 1.8s infinite;
          transition: transform 0.18s cubic-bezier(.4,2,.6,1), box-shadow 0.18s;
        }
        .floating-insta-share:hover {
          transform: scale(1.12) rotate(-2deg);
          box-shadow: 0 8px 32px 0 rgba(221,42,123,0.35), 0 2px 12px 0 rgba(81,91,212,0.18);
        }
        @keyframes insta-pulse {
          0% { box-shadow: 0 0 0 0 rgba(221,42,123,0.25), 0 1.5px 8px 0 rgba(81,91,212,0.15); }
          70% { box-shadow: 0 0 0 12px rgba(221,42,123,0.08), 0 1.5px 8px 0 rgba(81,91,212,0.15); }
          100% { box-shadow: 0 0 0 0 rgba(221,42,123,0.25), 0 1.5px 8px 0 rgba(81,91,212,0.15); }
        }
      `}</style>
      <a
        href={instaShareUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Instagram"
        className="floating-insta-share"
      >
        <svg width="32" height="32" viewBox="0 0 448 512" fill="#fff" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="insta-gradient" cx="50%" cy="50%" r="80%" fx="50%" fy="50%">
              <stop offset="0%" stopColor="#fdf497" />
              <stop offset="45%" stopColor="#fdf497" />
              <stop offset="60%" stopColor="#fd5949" />
              <stop offset="90%" stopColor="#d6249f" />
              <stop offset="100%" stopColor="#285AEB" />
            </radialGradient>
          </defs>
          <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9 114.9-51.3 114.9-114.9S287.7 141 224.1 141zm0 186.6c-39.6 0-71.7-32.1-71.7-71.7s32.1-71.7 71.7-71.7 71.7 32.1 71.7 71.7-32.1 71.7-71.7 71.7zm146.4-194.3c0 14.9-12 26.9-26.9 26.9s-26.9-12-26.9-26.9 12-26.9 26.9-26.9 26.9 12 26.9 26.9zm76.1 27.2c-1.7-35.3-9.9-66.7-36.2-92.9S388.6 1.7 353.3 0C317.3-1.7 130.7-1.7 94.7 0 59.4 1.7 28 9.9 1.7 36.2S1.7 123.4 0 158.7C-1.7 194.7-1.7 381.3 0 417.3c1.7 35.3 9.9 66.7 36.2 92.9s57.6 34.5 92.9 36.2c36 1.7 222.6 1.7 258.6 0 35.3-1.7 66.7-9.9 92.9-36.2s34.5-57.6 36.2-92.9c1.7-36 1.7-222.6 0-258.6zM398.8 388c-7.8 19.6-22.9 34.7-42.5 42.5-29.4 11.7-99.2 9-132.3 9s-102.9 2.6-132.3-9c-19.6-7.8-34.7-22.9-42.5-42.5-11.7-29.4-9-99.2-9-132.3s-2.6-102.9 9-132.3c7.8-19.6 22.9-34.7 42.5-42.5C121.1 49.2 190.9 51.8 224 51.8s102.9-2.6 132.3 9c19.6 7.8 34.7 22.9 42.5 42.5 11.7 29.4 9 99.2 9 132.3s2.7 102.9-9 132.3z" fill="url(#insta-gradient)"/>
        </svg>
      </a>
    </>
  );
};

export default FloatingInstaShare;
