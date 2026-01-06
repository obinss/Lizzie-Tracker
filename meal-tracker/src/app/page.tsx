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

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;

      // Calculate progress through the plate section
      const plateSection = document.getElementById('plate-section');
      if (plateSection) {
        const plateSectionTop = plateSection.offsetTop;
        const plateSectionHeight = plateSection.offsetHeight;
        const plateSectionBottom = plateSectionTop + plateSectionHeight;

        if (scrollPosition >= plateSectionTop && scrollPosition <= plateSectionBottom) {
          const progress = (scrollPosition - plateSectionTop) / plateSectionHeight;
          setScrollProgress(Math.min(progress, 1));
        } else if (scrollPosition > plateSectionBottom) {
          setScrollProgress(1);
        } else {
          setScrollProgress(0);
        }
      }

      setNavScrolled(scrollPosition > 50);
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
        background: '#0a0a0a',
        color: '#ffffff'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderTop: '1px solid #ffffff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p style={{ fontSize: '0.875rem', opacity: 0.5, letterSpacing: '0.1em' }}>LOADING</p>
        </div>
      </div>
    );
  }

  const features = [
    { icon: Calendar, title: 'Meal Planning', link: '/meal-plan' },
    { icon: BookOpen, title: 'Recipes', link: '/meal-plan' },
    { icon: ShoppingCart, title: 'Shopping', link: '/shopping-list' },
    { icon: Camera, title: 'Photos', link: '/upload-photo' },
    { icon: Settings, title: 'Settings', link: '/settings' },
    { icon: Users, title: 'Community', link: '/dashboard' }
  ];

  // Calculate which icons should be visible based on scroll progress
  const visibleIconCount = Math.floor(scrollProgress * features.length);

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

      {/* Hero Section - Title at Top */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: '8rem 2rem 4rem'
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
          A minimalist approach to meal planning, accountability, and community
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/signup" className="btn">
            Begin Your Journey
          </Link>
          <Link href="/login" className="btn-minimal">
            Sign In
          </Link>
        </div>
        <div className="scroll-indicator">Scroll to Explore</div>
      </section>

      {/* Plate Section - Fixed height where icons appear */}
      <section id="plate-section" style={{
        minHeight: '400vh',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Sticky plate that stays in view while scrolling through this section */}
        <div style={{
          position: 'sticky',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '100%',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none'
        }}>
          <div style={{
            width: 'min(80vw, 600px)',
            height: 'min(80vw, 600px)',
            background: 'var(--plate)',
            borderRadius: '50%',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
            position: 'relative',
            transform: `rotate(${scrollProgress * 360}deg)`,
            transition: 'transform 0.1s linear'
          }}>
            {/* Food icons appearing on the plate */}
            {features.map((feature, index) => {
              const angle = (index * Math.PI * 2) / features.length - Math.PI / 2;
              const radius = 35; // percentage from center
              const x = 50 + Math.cos(angle) * radius;
              const y = 50 + Math.sin(angle) * radius;
              const isVisible = index < visibleIconCount;

              return (
                <div
                  key={index}
                  style={{
                    position: 'absolute',
                    top: `${y}%`,
                    left: `${x}%`,
                    transform: `translate(-50%, -50%) rotate(-${scrollProgress * 360}deg) scale(${isVisible ? 1 : 0.5})`,
                    opacity: isVisible ? 1 : 0,
                    transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                    pointerEvents: 'auto'
                  }}
                >
                  <Link href={feature.link} style={{ display: 'block', color: '#0a0a0a' }}>
                    <feature.icon size={48} strokeWidth={1.5} />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Feature Sections - Below the plate */}
      <section style={{ background: '#0a0a0a', position: 'relative', zIndex: 10 }}>
        {features.map((feature, index) => (
          <div key={index} className="section">
            <div className="section-content">
              <Link href={feature.link} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ margin: '0 auto 2rem', width: 'fit-content' }}>
                  <feature.icon size={48} strokeWidth={1} />
                </div>
                <h2 className="section-title">{feature.title}</h2>
                <p className="section-description">
                  {index === 0 && 'Curated weekly plans tailored to your goals'}
                  {index === 1 && 'Detailed instructions for every dish'}
                  {index === 2 && 'Automated ingredient lists'}
                  {index === 3 && 'Document your meals visually'}
                  {index === 4 && 'Customize times and notifications'}
                  {index === 5 && 'Track progress with friends'}
                </p>
              </Link>
            </div>
          </div>
        ))}

        {/* Final CTA */}
        <div className="section" style={{ minHeight: '70vh' }}>
          <div className="section-content">
            <h2 style={{ marginBottom: '2rem' }}>
              Start Tracking Today
            </h2>
            <Link href="/signup" className="btn" style={{ padding: '1rem 2rem' }}>
              Create Account
            </Link>
          </div>
        </div>

        {/* Footer */}
        <footer style={{
          padding: '4rem 2rem',
          textAlign: 'center',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          fontSize: '0.875rem',
          opacity: 0.5
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
