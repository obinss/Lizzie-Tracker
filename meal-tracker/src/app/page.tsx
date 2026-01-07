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
  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);

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

          // Calculate plate index (0-5 for 6 states) - cycles through all 6
          const plateIndex = Math.min(Math.floor(progress * 6), 5);
          setCurrentPlateIndex(plateIndex);

          // Calculate rotation (full 360 degree rotation through the section)
          const rotation = progress * 360;
          setPlateRotation(rotation);

          // Calculate which feature to highlight (0-5)
          const featureIndex = Math.min(Math.floor(progress * 6), 5);
          setCurrentFeatureIndex(featureIndex);
        } else if (scrollPosition > plateSectionBottom) {
          setScrollProgress(1);
          setCurrentPlateIndex(5);
          setCurrentFeatureIndex(5);
        } else {
          setScrollProgress(0);
          setCurrentPlateIndex(0);
          setPlateRotation(0);
          setCurrentFeatureIndex(0);
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
    {
      icon: Calendar,
      title: 'Meal Planning',
      link: '/meal-plan',
      description: 'Weekly meal plans tailored to your dietary goals and preferences'
    },
    {
      icon: BookOpen,
      title: 'Recipes',
      link: '/meal-plan',
      description: 'Detailed cooking instructions and nutritional information for every dish'
    },
    {
      icon: ShoppingCart,
      title: 'Shopping',
      link: '/shopping-list',
      description: 'Automated grocery lists generated from your meal plans'
    },
    {
      icon: Camera,
      title: 'Photos',
      link: '/upload-photo',
      description: 'Document your meals visually and track your progress over time'
    },
    {
      icon: Settings,
      title: 'Settings',
      link: '/settings',
      description: 'Customize meal times, preparation schedules, and notifications'
    },
    {
      icon: Users,
      title: 'Community',
      link: '/dashboard',
      description: 'Connect with friends and share your wellness journey together'
    }
  ];

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

      {/* SECTION 2: Integrated Plate Section - Plate Always Visible */}
      <section id="plate-section" style={{
        minHeight: '600vh',
        position: 'relative',
        background: 'var(--background)'
      }}>
        {/* Sticky container - plate stays centered, content changes below */}
        <div style={{
          position: 'sticky',
          top: 0,
          width: '100%',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '4rem 2rem',
          overflow: 'hidden'
        }}>
          {/* Main Content Container */}
          <div style={{
            width: '100%',
            maxWidth: '1200px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2rem'
          }}>

            {/* Plate Title - Always Above Plate */}
            <div style={{
              textAlign: 'center',
              width: '100%',
              minHeight: '80px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.75rem, 4vw, 3rem)',
                fontWeight: 400,
                marginBottom: 0,
                opacity: 0.95,
                transition: 'all 0.5s ease'
              }}>
                {plateTitles[currentPlateIndex]}
              </h2>
            </div>

            {/* Rotating Plate - Always Centered, Always Visible */}
            <div style={{
              position: 'relative',
              width: 'min(50vw, 500px)',
              height: 'min(50vw, 500px)',
              maxWidth: '500px',
              maxHeight: '500px',
              flex: '0 0 auto'
            }}>
              {/* Plate Images - cycle through states */}
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
            </div>

            {/* Feature Card - Below Plate */}
            <div style={{
              width: '100%',
              maxWidth: '600px',
              minHeight: '200px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-start',
              textAlign: 'center',
              transition: 'all 0.5s ease'
            }}>
              {/* Feature Icon - Clickable */}
              <Link
                href={features[currentFeatureIndex].link}
                style={{
                  marginBottom: '1.5rem',
                  padding: '1.5rem',
                  background: 'rgba(17, 62, 83, 0.05)',
                  borderRadius: '16px',
                  border: '1px solid rgba(17, 62, 83, 0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'block',
                  textDecoration: 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(17, 62, 83, 0.1)';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = 'rgba(17, 62, 83, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(17, 62, 83, 0.05)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'rgba(17, 62, 83, 0.1)';
                }}
              >
                {(() => {
                  const FeatureIcon = features[currentFeatureIndex].icon;
                  return <FeatureIcon size={48} strokeWidth={1.5} color="#113e53" />;
                })()}
              </Link>

              {/* Feature Title */}
              <h3 style={{
                fontSize: '1.75rem',
                fontWeight: 500,
                marginBottom: '1rem',
                color: '#113e53'
              }}>
                {features[currentFeatureIndex].title}
              </h3>

              {/* Feature Description */}
              <p style={{
                fontSize: '1.125rem',
                opacity: 0.75,
                lineHeight: 1.6,
                marginBottom: '1.5rem',
                color: '#113e53'
              }}>
                {features[currentFeatureIndex].description}
              </p>

              {/* CTA Button */}
              <Link
                href={features[currentFeatureIndex].link}
                className="btn"
                style={{
                  padding: '0.875rem 1.75rem',
                  fontSize: '0.95rem'
                }}
              >
                Explore {features[currentFeatureIndex].title}
              </Link>
            </div>

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
