import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import './Gallery.css';

// Import actual photos
import photo1 from '../Photos/DSC00390.jpg';
import photo2 from '../Photos/DSC04635.jpg';
import photo3 from '../Photos/DSC04724.jpg';
import photo4 from '../Photos/DSC04875.jpg';

const Gallery = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get('category') || 'all';
  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [visibleItems, setVisibleItems] = useState(new Set());
  const itemRefs = useRef({});

  const images = [photo1, photo2, photo3, photo4];

  const categories = ['all', 'personal', 'video-fashion', 'photo-fashion', 'reels', 'weddings'];
  const categoryLabels = {
    all: 'All Work',
    personal: 'Personal Photoshoot',
    'video-fashion': 'Video: Fashion/Beauty Campaigns',
    'photo-fashion': 'Photo: Fashion/Beauty Campaigns',
    reels: 'Reels',
    weddings: 'Weddings'
  };

  useEffect(() => {
    const category = searchParams.get('category') || 'all';
    setSelectedCategory(category);
  }, [searchParams]);

  // Gallery items with titles and descriptions
  const galleryItems = [
    { 
      id: 1, 
      category: 'personal', 
      image: photo1, 
      title: 'Personal Photoshoot',
      description: 'Intimate portraits that capture your essence and personality.'
    },
    { 
      id: 2, 
      category: 'weddings', 
      image: photo2, 
      title: 'Wedding Collection',
      description: 'Capturing the most beautiful moments of your special day with elegance and artistry.'
    },
    { 
      id: 3, 
      category: 'photo-fashion', 
      image: photo3, 
      title: 'Fashion Campaign',
      description: 'Visual campaigns for niche brands that value aesthetics and depth.'
    },
    { 
      id: 4, 
      category: 'video-fashion', 
      image: photo4, 
      title: 'Beauty Campaign',
      description: 'Cinematic video content with vintage elegance and attention to detail.'
    },
    { 
      id: 5, 
      category: 'personal', 
      image: photo1, 
      title: 'Portrait Session',
      description: 'Exploring the depth of human expression through the lens.'
    },
    { 
      id: 6, 
      category: 'weddings', 
      image: photo2, 
      title: 'Wedding Story',
      description: 'Timeless memories from the most important day of your life.'
    },
  ];

  const filteredItems = selectedCategory === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === selectedCategory);

  useEffect(() => {
    // Reset visible items when filter changes
    setVisibleItems(new Set());
    
    // Intersection Observer for scroll animations
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

    // Small delay to ensure refs are updated
    const timeoutId = setTimeout(() => {
      Object.values(itemRefs.current).forEach((ref) => {
        if (ref) observer.observe(ref);
      });
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [filteredItems]);

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxImage(filteredItems[index]);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxImage(null);
    document.body.style.overflow = 'unset';
  };

  const navigateLightbox = (direction) => {
    let newIndex = lightboxIndex + direction;
    if (newIndex < 0) newIndex = filteredItems.length - 1;
    if (newIndex >= filteredItems.length) newIndex = 0;
    setLightboxIndex(newIndex);
    setLightboxImage(filteredItems[newIndex]);
  };

  useEffect(() => {
    if (!lightboxImage) return;

    const handleKeyPress = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigateLightbox(-1);
      if (e.key === 'ArrowRight') navigateLightbox(1);
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [lightboxImage, lightboxIndex]);

  return (
    <div className="gallery-page">
      <div className="gallery-filters">
        <div className="container">
          <div className="filter-buttons">
            {categories.map(category => (
              <button
                key={category}
                className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => {
                  setSelectedCategory(category);
                  if (category === 'all') {
                    setSearchParams({});
                  } else {
                    setSearchParams({ category });
                  }
                }}
              >
                {categoryLabels[category]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="gallery-container">
        <div className="gallery-content">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              ref={(el) => (itemRefs.current[item.id] = el)}
              data-id={item.id}
              className={`gallery-post ${visibleItems.has(String(item.id)) ? 'visible' : ''}`}
            >
              <div className="gallery-post-layout">
                <div className="gallery-post-header">
                  <h2 className="gallery-post-title">{item.title}</h2>
                  <p className="gallery-post-description">{item.description}</p>
                </div>
                <div className="gallery-post-images">
                  <div 
                    className="gallery-image-wrapper"
                    onClick={() => openLightbox(index)}
                  >
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="gallery-image"
                      loading="lazy"
                    />
                  </div>
                  <div 
                    className="gallery-image-wrapper"
                    onClick={() => openLightbox(index)}
                  >
                    <img 
                      src={images[(index + 1) % images.length]} 
                      alt={item.title}
                      className="gallery-image"
                      loading="lazy"
                    />
                  </div>
                  <div 
                    className="gallery-image-wrapper"
                    onClick={() => openLightbox(index)}
                  >
                    <img 
                      src={images[(index + 2) % images.length]} 
                      alt={item.title}
                      className="gallery-image"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {lightboxImage && (
        <div className="lightbox" onClick={closeLightbox}>
          <button className="lightbox-close" onClick={closeLightbox} aria-label="Close">
            <FiX />
          </button>
          <button 
            className="lightbox-nav lightbox-prev"
            onClick={(e) => {
              e.stopPropagation();
              navigateLightbox(-1);
            }}
            aria-label="Previous image"
          >
            <FiChevronLeft />
          </button>
          <button 
            className="lightbox-nav lightbox-next"
            onClick={(e) => {
              e.stopPropagation();
              navigateLightbox(1);
            }}
            aria-label="Next image"
          >
            <FiChevronRight />
          </button>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <div className="lightbox-image-container">
              <img 
                src={lightboxImage.image} 
                alt={lightboxImage.title}
                className="lightbox-image"
              />
            </div>
            <div className="lightbox-info">
              <h3>{lightboxImage.title}</h3>
              <p>{categoryLabels[lightboxImage.category]}</p>
              <span className="lightbox-counter">
                {lightboxIndex + 1} / {filteredItems.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;

