import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiX, FiChevronLeft, FiChevronRight, FiSettings } from 'react-icons/fi';
import './Portfolio.css';

const Portfolio = () => {
  const [photos, setPhotos] = useState([]);
  const [lightbox, setLightbox] = useState({ open: false, index: 0 });
  const [visibleItems, setVisibleItems] = useState(new Set());
  const itemRefs = useRef({});

  useEffect(() => {
    // Load photos from localStorage (admin panel uploads only)
    const savedPhotos = localStorage.getItem('portfolio_photos');
    if (savedPhotos) {
      try {
        const parsed = JSON.parse(savedPhotos);
        setPhotos(parsed);
      } catch (e) {
        console.error('Error loading photos:', e);
        setPhotos([]);
      }
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleItems((prev) => new Set([...prev, entry.target.dataset.id]));
          }
        });
      },
      { threshold: 0.1, rootMargin: '100px' }
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
  }, [photos]);

  const openLightbox = (index) => {
    setLightbox({ open: true, index });
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightbox({ open: false, index: 0 });
    document.body.style.overflow = 'unset';
  };

  const navigateLightbox = (direction) => {
    let newIndex = lightbox.index + direction;
    if (newIndex < 0) newIndex = photos.length - 1;
    if (newIndex >= photos.length) newIndex = 0;
    setLightbox({ open: true, index: newIndex });
  };

  useEffect(() => {
    if (!lightbox.open) return;

    const handleKeyPress = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigateLightbox(-1);
      if (e.key === 'ArrowRight') navigateLightbox(1);
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [lightbox]);

  // Create artistic layout pattern
  const getItemClass = (index) => {
    const pattern = index % 12;
    if (pattern === 0) return 'item-large';
    if (pattern === 3) return 'item-tall';
    if (pattern === 5) return 'item-wide';
    if (pattern === 8) return 'item-large';
    if (pattern === 11) return 'item-tall';
    return 'item-normal';
  };

  return (
    <div className="portfolio-page">
      {photos.length === 0 ? (
        <div className="portfolio-empty">
          <h2>No photos yet</h2>
          <p>Upload photos from the Admin Panel to display them here.</p>
          <Link to="/admin" className="admin-link">
            <FiSettings /> Go to Admin Panel
          </Link>
        </div>
      ) : (
        <div className="portfolio-masonry">
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              ref={(el) => (itemRefs.current[photo.id] = el)}
              data-id={photo.id}
              className={`masonry-item ${getItemClass(index)} ${visibleItems.has(String(photo.id)) ? 'visible' : ''}`}
              style={{ animationDelay: `${(index % 6) * 0.1}s` }}
              onClick={() => openLightbox(index)}
            >
              <img 
                src={photo.url} 
                alt={photo.title || ''} 
                loading="lazy" 
                style={{ objectPosition: photo.position || 'center center' }}
              />
              <div className="item-overlay"></div>
            </div>
          ))}
        </div>
      )}

      {lightbox.open && photos[lightbox.index] && (
        <div className="portfolio-lightbox" onClick={closeLightbox}>
          <button className="lightbox-close" onClick={closeLightbox}>
            <FiX />
          </button>
          <button 
            className="lightbox-nav lightbox-prev"
            onClick={(e) => { e.stopPropagation(); navigateLightbox(-1); }}
          >
            <FiChevronLeft />
          </button>
          <button 
            className="lightbox-nav lightbox-next"
            onClick={(e) => { e.stopPropagation(); navigateLightbox(1); }}
          >
            <FiChevronRight />
          </button>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img 
              src={photos[lightbox.index].url} 
              alt=""
            />
          </div>
          <div className="lightbox-counter">
            {lightbox.index + 1} / {photos.length}
          </div>
        </div>
      )}
    </div>
  );
};

export default Portfolio;
