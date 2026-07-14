import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { navigationConfig } from '../config';

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleBrandClick = () => {
    if (location.pathname !== '/') {
      navigate('/');
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (!navigationConfig.brandMark && navigationConfig.links.length === 0) {
    return null;
  }

  return (
    <nav
      ref={navRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 100,
        padding: '24px 4vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        transition: 'background-color 0.5s ease',
        backgroundColor: scrolled ? 'rgba(5, 10, 15, 0.7)' : 'transparent',
        backdropFilter: scrolled ? 'blur(8px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(8px)' : 'none',
      }}
    >
      <button
        onClick={handleBrandClick}
        className="font-serif-display"
        style={{
          fontSize: '18px',
          fontWeight: 400,
          letterSpacing: '0.15em',
          color: '#FFFFFF',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
        }}
      >
        {navigationConfig.brandMark}
      </button>
      <div style={{ display: 'flex', gap: '36px', alignItems: 'center' }}>
        {navigationConfig.links.map((item) => (
          <button
            key={item.targetId}
            onClick={() => handleNavClick(item.targetId)}
            className="font-sans-body"
            style={{
              background: 'none',
              border: 'none',
              color: '#FFFFFF',
              opacity: 0.6,
              fontSize: '14px',
              letterSpacing: '0.08em',
              cursor: 'pointer',
              transition: 'opacity 0.4s ease',
              padding: 0,
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.opacity = '1';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.opacity = '0.6';
            }}
          >
            {item.label}
          </button>
        ))}
        {/* Login Button */}
        <button
          onClick={handleLoginClick}
          className="font-sans-body"
          style={{
            background: 'rgba(48, 176, 208, 0.15)',
            border: '1px solid rgba(48, 176, 208, 0.4)',
            color: '#30B0D0',
            fontSize: '12px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'all 0.4s ease',
            padding: '8px 20px',
            borderRadius: 30,
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLElement).style.background = 'rgba(48, 176, 208, 0.3)';
            (e.target as HTMLElement).style.borderColor = 'rgba(48, 176, 208, 0.7)';
            (e.target as HTMLElement).style.color = '#4DC9E8';
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLElement).style.background = 'rgba(48, 176, 208, 0.15)';
            (e.target as HTMLElement).style.borderColor = 'rgba(48, 176, 208, 0.4)';
            (e.target as HTMLElement).style.color = '#30B0D0';
          }}
        >
          Log In
        </button>
      </div>
    </nav>
  );
}
