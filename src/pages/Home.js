import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowDown } from 'react-icons/fi';
import './Home.css';

// Import actual photos
import photo1 from '../Photos/DSC00390.jpg';
import photo2 from '../Photos/DSC04635.jpg';
import photo3 from '../Photos/DSC04724.jpg';
import photo4 from '../Photos/DSC04875.jpg';

const Home = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  const sectionRefs = useRef({});

  const images = [photo1, photo2, photo3, photo4];

  useEffect(() => {
    // Scroll-based animations with horizontal movement
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      setScrollY(currentScroll);
      
      const windowHeight = window.innerHeight;
      
      // Calculate visibility and horizontal movement based on scroll position
      Object.keys(sectionRefs.current).forEach((key) => {
        const ref = sectionRefs.current[key];
        if (ref) {
          const rect = ref.getBoundingClientRect();
          const sectionTop = rect.top;
          const sectionBottom = rect.bottom;
          const isInView = sectionTop < windowHeight * 0.8 && sectionBottom > windowHeight * 0.2;
          
          // Calculate horizontal offset based on scroll position
          // Images start off-screen to the right and slide in
          let horizontalOffset = 150; // Start position (off-screen to the right)
          if (key.startsWith('image')) {
            // Calculate how far through the viewport the section is
            const sectionStart = rect.top + windowHeight;
            const sectionEnd = rect.top;
            const scrollRange = windowHeight * 1.2; // Range for animation
            
            // Calculate progress: 0 when section is below viewport, 1 when fully in view
            const progress = Math.max(0, Math.min(1, 
              (windowHeight - sectionTop) / scrollRange
            ));
            
            // Ease out function for smooth deceleration
            const easeOut = 1 - Math.pow(1 - progress, 3);
            
            // Start 150px to the right, slide to 0
            horizontalOffset = 150 * (1 - easeOut);
          }
          
          setIsVisible((prev) => ({
            ...prev,
            [key]: isInView,
            [`${key}_offset`]: horizontalOffset,
          }));
        }
      });
    };

    const handleScrollThrottled = () => {
      requestAnimationFrame(handleScroll);
    };

    window.addEventListener('scroll', handleScrollThrottled, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScrollThrottled);
  }, []);

  useEffect(() => {
    // Intersection Observer for initial animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({
              ...prev,
              [entry.target.dataset.section]: true,
            }));
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px' }
    );

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="home">
      {/* Hero Section with Video */}
      <section className="hero-section" ref={(el) => (sectionRefs.current['hero'] = el)}>
        <div className="hero-image" style={{ backgroundImage: `url(${images[0]})` }}></div>
        <div className="hero-video-wrapper">
          <video 
            className="hero-video" 
            autoPlay 
            playsInline 
            muted 
            loop
            poster={images[0]}
          >
            <source src="/videos/introFilm.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <div className="hero-overlay"></div>
        <div className={`hero-scroll ${scrollY > 100 ? 'fade-out' : ''}`}>
          <span>Scroll</span>
          <FiArrowDown />
        </div>
      </section>

      {/* Introduction Section */}
      <section className="intro-section" ref={(el) => (sectionRefs.current['intro'] = el)}>
        <div className="intro-container">
          <div className={`intro-content ${isVisible['intro'] ? 'visible' : ''}`}>
            <h1 className="intro-title">
              <span className="intro-greeting">Hello!</span>
              <span className="intro-name">I'm Marta</span>
            </h1>
            <div className="intro-text">
              <h2 className="intro-subtitle">
                A <strong>photographer and videographer</strong> working between Prague and Italy.
              </h2>
              <p className="intro-description">
                I specialize in the <strong>premium segment</strong>: wedding photography, portraits, and visual campaigns for niche brands.
              </p>
              <p className="intro-description">
                I shoot for people who value <strong>aesthetics, atmosphere, and depth</strong>.
              </p>
              <p className="intro-description">
                My style is <strong>cinematic</strong>, with a touch of <strong>vintage elegance</strong> and attention to detail.
              </p>
              <Link to="/booking" className="intro-cta">Get in touch</Link>
            </div>
          </div>
        </div>
      </section>

      {/* The Approach Section */}
      <section className="approach-section" ref={(el) => (sectionRefs.current['approach'] = el)}>
        <div className="approach-container">
          <div className={`approach-content ${isVisible['approach'] ? 'visible' : ''}`}>
            <h2 className="approach-label">THE APPROACH</h2>
            <h3 className="approach-title">Not just a picture, but a mood + story + style</h3>
            <p className="approach-subtitle">You are not a technical performer, but a visual author and co-author of the image.</p>
            <div className="approach-highlight">
              <p>For brides, women, and brands that value <strong>individuality, visual harmony, and aesthetics</strong>.</p>
            </div>
            <Link to="/gallery" className="approach-cta">Begin your story</Link>
          </div>
        </div>
      </section>

      {/* Photo Gallery Section */}
      <section className="photos-section" ref={(el) => (sectionRefs.current['photos'] = el)}>
        <div className="photos-container">
          <div className={`photos-header ${isVisible['photos'] ? 'visible' : ''}`}>
            <h2 className="photos-title">STORIES FROM THE GALLERY</h2>
            <Link to="/gallery" className="photos-link">Enter the gallery</Link>
          </div>
          <div className={`photos-grid ${isVisible['photos'] ? 'visible' : ''}`}>
            <div className="photo-item">
              <img src={photo1} alt="Photography work" loading="lazy" />
            </div>
            <div className="photo-item">
              <img src={photo2} alt="Photography work" loading="lazy" />
            </div>
            <div className="photo-item">
              <img src={photo3} alt="Photography work" loading="lazy" />
            </div>
            <div className="photo-item">
              <img src={photo4} alt="Photography work" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section" ref={(el) => (sectionRefs.current['services'] = el)}>
        <div className="services-container">
          <div className={`services-content ${isVisible['services'] ? 'visible' : ''}`}>
            <h2 className="services-label">SERVICES</h2>
            <h3 className="services-title">Your story can be narrated differently</h3>
            <div className="services-grid">
              <div className="service-item">
                <h4 className="service-name">Personal Photoshoot</h4>
                <p className="service-description">Intimate portraits that capture your essence</p>
              </div>
              <div className="service-item">
                <h4 className="service-name">Weddings</h4>
                <p className="service-description">Timeless memories from your special day</p>
              </div>
              <div className="service-item">
                <h4 className="service-name">Fashion/Beauty Campaigns</h4>
                <p className="service-description">Visual campaigns for niche brands</p>
              </div>
            </div>
            <p className="services-footer">
              This <del>isn't</del> just a choice. It's the beginning of a story you'll never stop telling.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section" ref={(el) => (sectionRefs.current['cta'] = el)}>
        <div className={`cta-content ${isVisible['cta'] ? 'visible' : ''}`}>
          <h2 className="cta-title">Your story begins here</h2>
          <Link to="/booking" className="cta-link">Let's start the magic</Link>
        </div>
      </section>
    </div>
  );
};

export default Home;

