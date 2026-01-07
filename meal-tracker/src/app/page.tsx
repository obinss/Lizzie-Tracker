'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { Calendar, ShoppingCart, Camera, Settings, Users, BookOpen } from 'lucide-react';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [navScrolled, setNavScrolled] = useState(false);
  const [currentPlateIndex, setCurrentPlateIndex] = useState(0);
  const [plateRotation, setPlateRotation] = useState(0);
  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(-1);

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;

      // Calculate progress through the plate section
      const plateSection = document.getElementById('plate-section');
      if (plateSection) {
        const plateSectionTop = plateSection.offsetTop;
        const plateSectionHeight = plateSection.offsetHeight;
        const plateSectionBottom = plateSectionTop + plateSectionHeight;

        if (scrollPosition >= plateSectionTop && scrollPosition <= plateSectionBottom) {
          const progress = (scrollPosition - plateSectionTop) / plateSectionHeight;
          setScrollProgress(Math.min(progress, 1));

          // Calculate plate index (0-5 for 6 states)
          const plateIndex = Math.min(Math.floor(progress * 6), 5);
          setCurrentPlateIndex(plateIndex);

          // Calculate rotation (full 360 degree rotation through the section)
          const rotation = progress * 360;
          setPlateRotation(rotation);

          // Calculate which feature detail to show (6 features total)
          // Features appear in second half of scroll
          const featureProgress = Math.max(0, (progress - 0.5) * 2);
          const featureIndex = Math.min(Math.floor(featureProgress * 6), 5);
          setCurrentFeatureIndex(featureProgress > 0 ? featureIndex : -1);
        } else if (scrollPosition > plateSectionBottom) {
          setScrollProgress(1);
          setCurrentPlateIndex(5);
          setCurrentFeatureIndex(5);
        } else {
          setScrollProgress(0);
          setCurrentPlateIndex(0);
          setPlateRotation(0);
          setCurrentFeatureIndex(-1);
        }
      }

      // Only show dark nav when in footer section
      const footerSection = document.getElementById('footer-section');
      if (footerSection) {
        const footerTop = footerSection.offsetTop;
        setNavScrolled(scrollPosition >= footerTop - 100);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#efc18f',
        color: '#113e53'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '1px solid rgba(17, 62, 83, 0.3)',
            borderTop: '1px solid #113e53',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p style={{ fontSize: '0.875rem', opacity: 0.5, letterSpacing: '0.1em' }}>LOADING</p>
        </div>
      </div>
    );
  }

  const plateImages = [
    '/Gemini_Generated_Image_cc5xhscc5xhscc5x.png',
    '/Gemini_Generated_Image_cc5xhscc5xhscc5x(1).png',
    '/Gemini_Generated_Image_cc5xhscc5xhscc5x(2).png',
    '/Gemini_Generated_Image_cc5xhscc5xhscc5x(3).png',
    '/Gemini_Generated_Image_cc5xhscc5xhscc5x(5).png',
    '/Gemini_Generated_Image_cc5xhscc5xhscc5x(6).png'
  ];

  const plateTitles = [
    'Start Your Journey',
    'Choose Your Grains',
    'Add Fresh Vegetables',
    'Include Lean Protein',
    'Complete with Fruits',
    'Balanced & Delicious'
  ];

  const plateSubtitles = [
    'Begin building your perfect meal',
    'Quinoa provides sustained energy',
    'Broccoli adds essential nutrients',
    'Grilled chicken for protein',
    'Berries & yogurt for wellness',
    'A complete, balanced plate'
  ];

  const features = [
    { icon: Calendar, title: 'Meal Planning', link: '/meal-plan', description: 'Weekly plans tailored to your goals' },
    { icon: BookOpen, title: 'Recipes', link: '/meal-plan', description: 'Detailed instructions for every dish' },
    { icon: ShoppingCart, title: 'Shopping', link: '/shopping-list', description: 'Automated ingredient lists' },
    { icon: Camera, title: 'Photos', link: '/upload-photo', description: 'Document your meals visually' },
    { icon: Settings, title: 'Settings', link: '/settings', description: 'Customize times and notifications' },
    { icon: Users, title: 'Community', link: '/dashboard', description: 'Track progress with friends' }
  ];

  // Calculate which icons should be visible based on plate index
  const visibleIconsCount = currentPlateIndex + 1;

  return (
    <>
      {/* Minimalist Navigation */}
      <nav className={`nav ${navScrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <Link href="/" className="nav-logo">
            Lizzie Tracker
          </Link>
          <div className="nav-links">
            <Link href="/login" className="nav-link">
              Sign In
            </Link>
            <Link href="/signup" className="btn" style={{ padding: '0.75rem 1.5rem' }}>
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* SECTION 1: Hero / Landing */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: '8rem 2rem 4rem',
        background: 'var(--background)'
      }}>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(3rem, 10vw, 8rem)',
          fontWeight: 400,
          letterSpacing: '-0.03em',
          marginBottom: '2rem',
          lineHeight: 1,
          maxWidth: '1200px'
        }}>
          Mindful Eating,<br />Tracked Together
        </h1>
        <p style={{
          fontSize: '1.25rem',
          fontWeight: 300,
          opacity: 0.7,
          marginBottom: '3rem',
          maxWidth: '600px'
        }}>
          A thoughtful approach to meal planning, accountability, and community
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
          <Link href="/signup" className="btn" style={{ padding: '1rem 2rem' }}>
            Begin Your Journey
          </Link>
          <Link href="/login" className="btn-minimal">
            Sign In
          </Link>
        </div>
        <div className="scroll-indicator">Scroll to Explore</div>
      </section>

      {/* SECTION 2: Integrated Plate Section with Feature Details */}
      <section id="plate-section" style={{
        minHeight: '600vh',
        position: 'relative',
        background: 'var(--background)'
      }}>
        {/* Sticky container - everything happens here */}
        <div style={{
          position: 'sticky',
          top: 0,
          width: '100%',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '6rem 2rem',
          overflow: 'hidden'
        }}>
          {/* Top Title */}
          <div style={{ textAlign: 'center', flex: '0 0 auto' }}>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 5vw, 4rem)',
              fontWeight: 400,
              marginBottom: '1rem',
              opacity: 0.95,
              transition: 'all 0.5s ease'
            }}>
              {currentFeatureIndex >= 0 ? features[currentFeatureIndex].title : plateTitles[currentPlateIndex]}
            </h2>
          </div>

          {/* Center: Rotating Plate with Icons OR Feature Details */}
          <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: '800px',
            height: 'auto',
            flex: '1 1 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {/* Plate Container (visible when no feature detail is shown) */}
            <div style={{
              position: 'absolute',
              width: 'min(60vw, 600px)',
              height: 'min(60vw, 600px)',
              maxWidth: '600px',
              maxHeight: '600px',
              opacity: currentFeatureIndex >= 0 ? 0 : 1,
              transition: 'opacity 0.6s ease',
              pointerEvents: currentFeatureIndex >= 0 ? 'none' : 'auto'
            }}>
              {/* Rotating Plate - cycles through different states */}
              {plateImages.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Plate state ${index + 1}`}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    opacity: currentPlateIndex === index ? 1 : 0,
                    transform: `rotate(${plateRotation}deg)`,
                    transition: 'opacity 0.6s ease',
                    filter: 'drop-shadow(0 20px 60px rgba(0, 0, 0, 0.15))'
                  }}
                />
              ))}

              {/* Feature icons appearing around the plate - with fixed positioning */}
              <div style={{
                position: 'absolute',
                width: '150%',
                height: '150%',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none'
              }}>
                {features.map((feature, index) => {
                  // Custom positioning for each icon
                  let position = { left: '50%', top: '50%', transform: 'translate(-50%, -50%)' };

                  // Meal Planning - Left top quadrant
                  if (index === 0) {
                    position = { left: '15%', top: '20%', transform: 'translate(-50%, -50%)' };
                  }
                  // Recipes - Right side, aligned horizontally with Meal Planning
                  else if (index === 1) {
                    position = { right: '15%', left: 'auto', top: '20%', transform: 'translate(50%, -50%)' };
                  }
                  // Shopping - Right bottom
                  else if (index === 2) {
                    position = { right: '15%', left: 'auto', bottom: '20%', top: 'auto', transform: 'translate(50%, 50%)' };
                  }
                  // Photos - Bottom center
                  else if (index === 3) {
                    position = { left: '50%', bottom: '10%', top: 'auto', transform: 'translate(-50%, 50%)' };
                  }
                  // Settings - Left side, aligned vertically with Meal Planning
                  else if (index === 4) {
                    position = { left: '15%', top: '50%', transform: 'translate(-50%, -50%)' };
                  }
                  // Community - Top center
                  else if (index === 5) {
                    position = { left: '50%', top: '10%', transform: 'translate(-50%, -50%)' };
                  }

                  return (
                    <Link
                      key={index}
                      href={feature.link}
                      style={{
                        position: 'absolute',
                        ...position,
                        opacity: index < visibleIconsCount ? 1 : 0,
                        transition: 'opacity 0.6s ease',
                        textDecoration: 'none',
                        color: 'var(--foreground)',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: 'rgba(239, 193, 143, 0.95)',
                        padding: '1rem',
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        backdropFilter: 'blur(10px)',
                        minWidth: '120px',
                        pointerEvents: 'auto',
                        border: '1px solid rgba(17, 62, 83, 0.1)'
                      }}
                    >
                      <feature.icon size={32} strokeWidth={1.5} />
                      <span style={{
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        letterSpacing: '0.02em'
                      }}>
                        {feature.title}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Feature Detail Card (visible when feature is selected) */}
            {currentFeatureIndex >= 0 && (
              <div style={{
                opacity: currentFeatureIndex >= 0 ? 1 : 0,
                transition: 'opacity 0.6s ease',
                textAlign: 'center',
                maxWidth: '600px',
                padding: '3rem'
              }}>
                <div style={{ margin: '0 auto 2rem', width: 'fit-content' }}>
                  {(() => {
                    const FeatureIcon = features[currentFeatureIndex].icon;
                    return <FeatureIcon size={64} strokeWidth={1} />;
                  })()}
                </div>
                <h3 style={{
                  fontSize: '2rem',
                  fontWeight: 400,
                  marginBottom: '1.5rem'
                }}>
                  {features[currentFeatureIndex].title}
                </h3>
                <p style={{
                  fontSize: '1.25rem',
                  opacity: 0.8,
                  lineHeight: 1.6
                }}>
                  {features[currentFeatureIndex].description}
                </p>
                <Link
                  href={features[currentFeatureIndex].link}
                  className="btn"
                  style={{
                    marginTop: '2rem',
                    display: 'inline-block',
                    padding: '1rem 2rem'
                  }}
                >
                  Explore {features[currentFeatureIndex].title}
                </Link>
              </div>
            )}
          </div>

          {/* Bottom Subtitle */}
          <div style={{ textAlign: 'center', flex: '0 0 auto' }}>
            <p style={{
              fontSize: '1.25rem',
              fontWeight: 300,
              opacity: 0.7,
              transition: 'all 0.5s ease'
            }}>
              {currentFeatureIndex >= 0 ? 'Discover all the tools you need' : plateSubtitles[currentPlateIndex]}
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3: Footer */}
      <section id="footer-section" style={{ background: 'var(--accent-bg)', color: 'var(--accent-fg)', position: 'relative', zIndex: 10 }}>
        {/* Final CTA */}
        <div className="section" style={{ minHeight: '70vh' }}>
          <div className="section-content">
            <h2 style={{ marginBottom: '2rem', color: 'var(--accent-pink)' }}>
              Start Tracking Today
            </h2>
            <p style={{ fontSize: '1.25rem', marginBottom: '3rem', opacity: 0.9 }}>
              Join thousands of users achieving their wellness goals
            </p>
            <Link href="/signup" className="btn" style={{
              padding: '1rem 2rem',
              borderColor: 'var(--accent-fg)',
              color: 'var(--accent-fg)',
              background: 'transparent'
            }}>
              Create Account
            </Link>
          </div>
        </div>

        {/* Footer */}
        <footer style={{
          padding: '4rem 2rem',
          textAlign: 'center',
          borderTop: '1px solid rgba(239, 193, 143, 0.2)',
          fontSize: '0.875rem',
          opacity: 0.7
        }}>
          <p>© 2026 Lizzie Tracker</p>
        </footer>
      </section>

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}
