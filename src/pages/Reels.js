import React, { useState, useEffect, useRef } from 'react';
import './Reels.css';

// Import actual photos as posters
import photo1 from '../Photos/DSC00390.jpg';
import photo2 from '../Photos/DSC04635.jpg';
import photo3 from '../Photos/DSC04724.jpg';
import photo4 from '../Photos/DSC04875.jpg';

const Reels = () => {
  const [visibleItems, setVisibleItems] = useState(new Set());
  const itemRefs = useRef({});

  // Reels data - you can add more reels here
  const reels = [
    { id: 1, poster: photo1, video: 'https://res.cloudinary.com/dmhqg1wim/video/upload/v1767009438/introFilm_solpgd.mp4', title: 'Fashion Reel 1' },
    { id: 2, poster: photo2, video: 'https://res.cloudinary.com/dmhqg1wim/video/upload/v1767009438/introFilm_solpgd.mp4', title: 'Fashion Reel 2' },
    { id: 3, poster: photo3, video: 'https://res.cloudinary.com/dmhqg1wim/video/upload/v1767009438/introFilm_solpgd.mp4', title: 'Fashion Reel 3' },
    { id: 4, poster: photo4, video: 'https://res.cloudinary.com/dmhqg1wim/video/upload/v1767009438/introFilm_solpgd.mp4', title: 'Fashion Reel 4' },
    { id: 5, poster: photo1, video: 'https://res.cloudinary.com/dmhqg1wim/video/upload/v1767009438/introFilm_solpgd.mp4', title: 'Fashion Reel 5' },
    { id: 6, poster: photo2, video: 'https://res.cloudinary.com/dmhqg1wim/video/upload/v1767009438/introFilm_solpgd.mp4', title: 'Fashion Reel 6' },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleItems((prev) => new Set([...prev, entry.target.dataset.id]));
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    const timeoutId = setTimeout(() => {
      Object.values(itemRefs.current).forEach((ref) => {
        if (ref) observer.observe(ref);
      });
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, []);

  const handleMouseEnter = (e) => {
    const video = e.currentTarget.querySelector('video');
    if (video) video.play();
  };

  const handleMouseLeave = (e) => {
    const video = e.currentTarget.querySelector('video');
    if (video) video.pause();
  };

  return (
    <div className="reels-page">
      <div className="reels-header">
        <h1 className="reels-title">REELS</h1>
      </div>
      <div className="reels-container">
        <div className="reels-grid">
          {reels.map((reel) => (
            <div
              key={reel.id}
              ref={(el) => (itemRefs.current[reel.id] = el)}
              data-id={reel.id}
              className={`reel-item ${visibleItems.has(String(reel.id)) ? 'visible' : ''}`}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <video
                className="reel-video"
                playsInline
                muted
                loop
                poster={reel.poster}
              >
                <source src={reel.video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reels;

