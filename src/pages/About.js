import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './About.css';

// Import actual photos
import photo1 from '../Photos/DSC00390.jpg';

const About = () => {
  const [isVisible, setIsVisible] = useState({});
  const sectionRefs = useRef({});

  useEffect(() => {
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
      { threshold: 0.1, rootMargin: '50px' }
    );

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="about-page">
      <section className="about-hero" ref={(el) => (sectionRefs.current['hero'] = el)}>
        <div className="about-hero-container">
          <div className={`about-hero-content ${isVisible['hero'] ? 'visible' : ''}`}>
            <h1 className="about-name">Marta Zboravska</h1>
            <div className="about-divider"></div>
          </div>
        </div>
      </section>

      <section className="about-main" ref={(el) => (sectionRefs.current['main'] = el)}>
        <div className="about-container">
          <div className="about-layout">
            <div className="about-image-section">
              <div className="about-image-wrapper">
                <img src={photo1} alt="Marta Zboravska" className="about-image" />
              </div>
            </div>
            <div className={`about-text-section ${isVisible['main'] ? 'visible' : ''}`}>
              <p className="about-intro">
                I am a <strong>photographer and videographer</strong> working between Prague and Italy.
              </p>
              <p className="about-specialization">
                I specialize in the <strong>premium segment</strong>: wedding photography, portraits, and visual campaigns for niche brands.
              </p>
              <p className="about-clients">
                I shoot for people who value <strong>aesthetics, atmosphere, and depth</strong>.
              </p>
              <p className="about-style">
                My style is <strong>cinematic</strong>, with a touch of <strong>vintage elegance</strong> and attention to detail.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="about-philosophy-section" ref={(el) => (sectionRefs.current['philosophy'] = el)}>
        <div className="about-container">
          <div className={`philosophy-content ${isVisible['philosophy'] ? 'visible' : ''}`}>
            <p className="philosophy-text">
              Not just a picture, but a <strong>mood + story + style</strong>.
            </p>
            <p className="philosophy-text">
              You are not a technical performer, but a <strong>visual author and co-author</strong> of the image.
            </p>
          </div>
        </div>
      </section>

      <section className="about-cta-section" ref={(el) => (sectionRefs.current['cta'] = el)}>
        <div className="about-container">
          <div className={`about-cta-content ${isVisible['cta'] ? 'visible' : ''}`}>
            <h2 className="cta-heading">Ready to create something beautiful?</h2>
            <Link to="/booking" className="about-cta-button">Get in touch</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

