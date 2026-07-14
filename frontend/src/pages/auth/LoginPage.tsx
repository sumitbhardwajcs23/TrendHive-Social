import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import FluidBackground from '../../components/FluidBackground';
import { useAuthStore } from '../../stores/authStore';
import api from '../../api/client';

export default function LoginPage() {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { setAuth } = useAuthStore();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 40, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'power3.out', delay: 0.2 }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', { email, password });
      const { user, token } = response.data;
      setAuth(user, token);
      navigate(user.role === 'CLIENT_STAKEHOLDER' ? '/client' : '/dashboard', { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (roleEmail: string) => {
    setEmail(roleEmail);
    setPassword('admin123');
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <FluidBackground isActive={true} />

      {/* Back button */}
      <button
        onClick={() => navigate('/')}
        className="font-sans-body"
        style={{
          position: 'fixed',
          top: '28px',
          left: '4vw',
          zIndex: 100,
          background: 'transparent',
          border: '1px solid rgba(255,255,255,0.3)',
          color: '#ffffff',
          fontSize: 11,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          padding: '10px 22px',
          borderRadius: 30,
          cursor: 'pointer',
          transition: 'all 0.4s ease',
        }}
        onMouseEnter={(e) => {
          (e.target as HTMLElement).style.borderColor = 'rgba(255,255,255,0.7)';
          (e.target as HTMLElement).style.background = 'rgba(255,255,255,0.05)';
        }}
        onMouseLeave={(e) => {
          (e.target as HTMLElement).style.borderColor = 'rgba(255,255,255,0.3)';
          (e.target as HTMLElement).style.background = 'transparent';
        }}
      >
        ← Back
      </button>

      {/* Login Card */}
      <div
        ref={cardRef}
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: 440,
          margin: '20px',
          padding: '52px 44px',
          borderRadius: 20,
          background: 'rgba(5, 10, 15, 0.55)',
          backdropFilter: 'blur(24px) saturate(140%)',
          WebkitBackdropFilter: 'blur(24px) saturate(140%)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 24px 80px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.06)',
          opacity: 0,
        }}
      >
        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div
            className="font-serif-display"
            style={{
              fontSize: 28,
              fontWeight: 400,
              letterSpacing: '0.2em',
              color: '#ffffff',
              marginBottom: 8,
            }}
          >
            TrendHive Social
          </div>
          <div
            className="font-sans-body"
            style={{
              fontSize: 11,
              letterSpacing: '0.25em',
              color: 'rgba(255,255,255,0.4)',
              textTransform: 'uppercase',
            }}
          >
            Agency Platform
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {error && (
            <div
              className="font-sans-body"
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                color: '#ef4444',
                padding: '12px',
                borderRadius: '10px',
                fontSize: '12px',
                textAlign: 'center'
              }}
            >
              {error}
            </div>
          )}
          {/* Email */}
          <div style={{ position: 'relative' }}>
            <label
              className="font-sans-body"
              style={{
                display: 'block',
                fontSize: 10,
                letterSpacing: '0.2em',
                color: 'rgba(255,255,255,0.5)',
                textTransform: 'uppercase',
                marginBottom: 10,
              }}
            >
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="font-sans-body"
              style={{
                width: '100%',
                padding: '14px 18px',
                fontSize: 14,
                letterSpacing: '0.02em',
                color: '#ffffff',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 10,
                outline: 'none',
                transition: 'all 0.3s ease',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'rgba(48, 176, 208, 0.6)';
                e.target.style.background = 'rgba(255, 255, 255, 0.07)';
                e.target.style.boxShadow = '0 0 0 3px rgba(48, 176, 208, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                e.target.style.background = 'rgba(255, 255, 255, 0.04)';
                e.target.style.boxShadow = 'none';
              }}
              placeholder="you@agency.com"
            />
          </div>

          {/* Password */}
          <div style={{ position: 'relative' }}>
            <label
              className="font-sans-body"
              style={{
                display: 'block',
                fontSize: 10,
                letterSpacing: '0.2em',
                color: 'rgba(255,255,255,0.5)',
                textTransform: 'uppercase',
                marginBottom: 10,
              }}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="font-sans-body"
              style={{
                width: '100%',
                padding: '14px 18px',
                fontSize: 14,
                letterSpacing: '0.02em',
                color: '#ffffff',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 10,
                outline: 'none',
                transition: 'all 0.3s ease',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'rgba(48, 176, 208, 0.6)';
                e.target.style.background = 'rgba(255, 255, 255, 0.07)';
                e.target.style.boxShadow = '0 0 0 3px rgba(48, 176, 208, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                e.target.style.background = 'rgba(255, 255, 255, 0.04)';
                e.target.style.boxShadow = 'none';
              }}
              placeholder="Enter your password"
            />
          </div>

          {/* Remember + Forgot */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: -4,
            }}
          >
            <label
              className="font-sans-body"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 12,
                color: 'rgba(255,255,255,0.45)',
                cursor: 'pointer',
                letterSpacing: '0.02em',
              }}
            >
              <input
                type="checkbox"
                style={{
                  width: 14,
                  height: 14,
                  accentColor: '#30B0D0',
                  cursor: 'pointer',
                }}
              />
              Remember me
            </label>
            <button
              type="button"
              className="font-sans-body"
              style={{
                background: 'none',
                border: 'none',
                fontSize: 12,
                color: 'rgba(48, 176, 208, 0.8)',
                cursor: 'pointer',
                letterSpacing: '0.02em',
                transition: 'color 0.3s ease',
                padding: 0,
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.color = '#30B0D0';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.color = 'rgba(48, 176, 208, 0.8)';
              }}
            >
              Forgot password?
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="font-sans-body"
            style={{
              width: '100%',
              padding: '16px',
              marginTop: 8,
              fontSize: 12,
              fontWeight: 500,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#050A0F',
              background: isLoading ? 'rgba(48, 176, 208, 0.5)' : '#30B0D0',
              border: 'none',
              borderRadius: 10,
              cursor: isLoading ? 'wait' : 'pointer',
              transition: 'all 0.4s ease',
              position: 'relative',
              overflow: 'hidden',
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                (e.target as HTMLElement).style.background = '#4DC9E8';
                (e.target as HTMLElement).style.transform = 'translateY(-1px)';
                (e.target as HTMLElement).style.boxShadow = '0 8px 24px rgba(48, 176, 208, 0.3)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                (e.target as HTMLElement).style.background = '#30B0D0';
                (e.target as HTMLElement).style.transform = 'translateY(0)';
                (e.target as HTMLElement).style.boxShadow = 'none';
              }
            }}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Divider */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            margin: '32px 0',
          }}
        >
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
          <span
            className="font-sans-body"
            style={{
              fontSize: 10,
              letterSpacing: '0.15em',
              color: 'rgba(255,255,255,0.3)',
              textTransform: 'uppercase',
            }}
          >
            or demo
          </span>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
        </div>

        {/* Demo Logins */}
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={() => handleDemoLogin('admin@trendhive.social')}
            type="button"
            className="font-sans-body"
            style={{
              flex: 1,
              padding: '14px',
              fontSize: 11,
              letterSpacing: '0.1em',
              color: 'rgba(255,255,255,0.7)',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 10,
              cursor: 'pointer',
              transition: 'all 0.4s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.background = 'rgba(255, 255, 255, 0.08)';
              (e.target as HTMLElement).style.borderColor = 'rgba(255, 255, 255, 0.18)';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.background = 'rgba(255, 255, 255, 0.04)';
              (e.target as HTMLElement).style.borderColor = 'rgba(255, 255, 255, 0.1)';
            }}
          >
            Admin
          </button>

          <button
            onClick={() => handleDemoLogin('creator@trendhive.social')}
            type="button"
            className="font-sans-body"
            style={{
              flex: 1,
              padding: '14px',
              fontSize: 11,
              letterSpacing: '0.1em',
              color: 'rgba(255,255,255,0.7)',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 10,
              cursor: 'pointer',
              transition: 'all 0.4s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.background = 'rgba(255, 255, 255, 0.08)';
              (e.target as HTMLElement).style.borderColor = 'rgba(255, 255, 255, 0.18)';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.background = 'rgba(255, 255, 255, 0.04)';
              (e.target as HTMLElement).style.borderColor = 'rgba(255, 255, 255, 0.1)';
            }}
          >
            Team Member
          </button>
          
          <button
            onClick={() => handleDemoLogin('client@waveco.test')}
            type="button"
            className="font-sans-body"
            style={{
              flex: 1,
              padding: '14px',
              fontSize: 11,
              letterSpacing: '0.1em',
              color: 'rgba(255,255,255,0.7)',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 10,
              cursor: 'pointer',
              transition: 'all 0.4s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.background = 'rgba(255, 255, 255, 0.08)';
              (e.target as HTMLElement).style.borderColor = 'rgba(255, 255, 255, 0.18)';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.background = 'rgba(255, 255, 255, 0.04)';
              (e.target as HTMLElement).style.borderColor = 'rgba(255, 255, 255, 0.1)';
            }}
          >
            Client
          </button>
        </div>

      </div>
    </div>
  );
}
