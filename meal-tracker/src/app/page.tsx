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
        background: '#ebeae7',
        color: '#2a3636'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '1px solid rgba(42, 54, 54, 0.3)',
            borderTop: '1px solid #2a3636',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p style={{ fontSize: '0.875rem', opacity: 0.5, letterSpacing: '0.1em' }}>LOADING</p>
        </div>
      </div>
    );
  }

  const foodItems = [
    { name: 'Quinoa', image: '/quinoa.png', left: '15%', top: '45%', size: '35%' },
    { name: 'Broccoli', image: '/broccoli.png', left: '20%', top: '25%', size: '28%' },
    { name: 'Chicken', image: '/chicken.png', left: '55%', top: '40%', size: '32%' },
    { name: 'Berries', image: '/berries.png', left: '50%', top: '10%', size: '20%' },
    { name: 'Yogurt', image: '/yogurt.png', left: '18%', top: '15%', size: '18%' }
  ];

  const features = [
    { icon: Calendar, title: 'Meal Planning', link: '/meal-plan', description: 'Weekly plans tailored to your goals' },
    { icon: BookOpen, title: 'Recipes', link: '/meal-plan', description: 'Detailed instructions for every dish' },
    { icon: ShoppingCart, title: 'Shopping', link: '/shopping-list', description: 'Automated ingredient lists' },
    { icon: Camera, title: 'Photos', link: '/upload-photo', description: 'Document your meals visually' },
    { icon: Settings, title: 'Settings', link: '/settings', description: 'Customize times and notifications' },
    { icon: Users, title: 'Community', link: '/dashboard', description: 'Track progress with friends' }
  ];

  // Calculate which food items should be visible based on scroll progress
  const visibleFoodCount = Math.floor(scrollProgress * (foodItems.length + 1));

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

      {/* Hero Section */}
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

      {/* Plate Section - Fixed plate stays in view, content scrolls */}
      <section id="plate-section" style={{
        minHeight: '500vh',
        position: 'relative'
      }}>
        {/* Sticky container that keeps plate centered */}
        <div style={{
          position: 'sticky',
          top: 0,
          width: '100%',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none'
        }}>
          {/* Plate with food items */}
          <div style={{
            position: 'relative',
            width: 'min(70vw, 500px)',
            height: 'min(70vw, 500px)',
            maxWidth: '500px',
            maxHeight: '500px'
          }}>
            {/* Plate image */}
            <img
              src="/plate.png"
              alt="Plate"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                filter: 'drop-shadow(0 20px 60px rgba(0, 0, 0, 0.2))'
              }}
            />

            {/* Food items appearing on the plate */}
            {foodItems.map((food, index) => (
              <img
                key={index}
                src={food.image}
                alt={food.name}
                style={{
                  position: 'absolute',
                  left: food.left,
                  top: food.top,
                  width: food.size,
                  height: 'auto',
                  opacity: index < visibleFoodCount ? 1 : 0,
                  transform: `scale(${index < visibleFoodCount ? 1 : 0.5})`,
                  transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                  pointerEvents: 'none'
                }}
              />
            ))}
          </div>

          {/* Feature icons with labels positioned around the plate */}
          <div style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            maxWidth: '900px',
            pointerEvents: 'auto'
          }}>
            {features.map((feature, index) => {
              const angle = (index * Math.PI * 2) / features.length - Math.PI / 2;
              const radius = 45; // percentage from center
              const x = 50 + Math.cos(angle) * radius;
              const y = 50 + Math.sin(angle) * radius;
              const isVisible = index < visibleFoodCount;

              return (
                <Link
                  key={index}
                  href={feature.link}
                  style={{
                    position: 'absolute',
                    left: `${x}%`,
                    top: `${y}%`,
                    transform: `translate(-50%, -50%) scale(${isVisible ? 1 : 0.7})`,
                    opacity: isVisible ? 1 : 0,
                    transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                    textDecoration: 'none',
                    color: 'var(--foreground)',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'rgba(235, 234, 231, 0.9)',
                    padding: '1rem',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    backdropFilter: 'blur(10px)',
                    minWidth: '120px'
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
      </section>

      {/* Feature Details Section */}
      <section style={{ background: 'var(--accent-bg)', color: 'var(--accent-fg)', position: 'relative', zIndex: 10 }}>
        {features.map((feature, index) => (
          <div key={index} className="section">
            <div className="section-content">
              <Link href={feature.link} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ margin: '0 auto 2rem', width: 'fit-content' }}>
                  <feature.icon size={48} strokeWidth={1} />
                </div>
                <h2 className="section-title">{feature.title}</h2>
                <p className="section-description">{feature.description}</p>
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
            <Link href="/signup" className="btn" style={{ padding: '1rem 2rem', borderColor: 'var(--accent-fg)', color: 'var(--accent-fg)' }}>
              Create Account
            </Link>
          </div>
        </div>

        {/* Footer */}
        <footer style={{
          padding: '4rem 2rem',
          textAlign: 'center',
          borderTop: '1px solid rgba(235, 234, 231, 0.2)',
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
