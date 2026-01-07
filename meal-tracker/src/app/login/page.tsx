'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from '@/lib/auth';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await signIn(email, password);
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Failed to sign in');
            setLoading(false);
        }
    };

    return (
        <>
            {/* Minimalist Navigation - matching landing page */}
            <nav style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 50,
                background: 'rgba(239, 193, 143, 0.8)',
                backdropFilter: 'blur(10px)',
                borderBottom: '1px solid rgba(17, 62, 83, 0.1)'
            }}>
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    padding: '1.25rem 2rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <Link href="/" style={{
                        fontSize: '1.25rem',
                        fontWeight: 600,
                        color: '#113e53',
                        textDecoration: 'none',
                        fontFamily: 'var(--font-display)'
                    }}>
                        Lizzie Tracker
                    </Link>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <Link href="/login" style={{
                            color: '#113e53',
                            textDecoration: 'none',
                            fontSize: '0.95rem',
                            opacity: 0.8,
                            transition: 'opacity 0.2s'
                        }}>
                            Sign In
                        </Link>
                        <Link href="/signup" className="btn" style={{
                            padding: '0.625rem 1.25rem',
                            fontSize: '0.95rem'
                        }}>
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Main Content - Centered Design */}
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--background)',
                padding: '6rem 2rem 4rem'
            }}>
                <div style={{
                    width: '100%',
                    maxWidth: '480px',
                    textAlign: 'center'
                }}>
                    {/* Title */}
                    <h1 style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(2.5rem, 6vw, 4rem)',
                        fontWeight: 400,
                        letterSpacing: '-0.02em',
                        marginBottom: '0.75rem',
                        lineHeight: 1.1,
                        color: '#113e53'
                    }}>
                        Welcome Back
                    </h1>

                    <p style={{
                        fontSize: '1.125rem',
                        opacity: 0.7,
                        marginBottom: '3rem',
                        fontWeight: 300,
                        color: '#113e53'
                    }}>
                        Sign in to continue your journey
                    </p>

                    {/* Error Message */}
                    {error && (
                        <div style={{
                            background: 'rgba(241, 98, 107, 0.1)',
                            border: '1px solid rgba(241, 98, 107, 0.3)',
                            color: '#c53030',
                            padding: '1rem',
                            borderRadius: '12px',
                            marginBottom: '2rem',
                            fontSize: '0.95rem'
                        }}>
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1.5rem',
                        textAlign: 'left'
                    }}>
                        <div>
                            <label htmlFor="email" style={{
                                display: 'block',
                                fontSize: '0.875rem',
                                fontWeight: 500,
                                marginBottom: '0.5rem',
                                color: '#113e53',
                                opacity: 0.8
                            }}>
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                                style={{
                                    width: '100%',
                                    padding: '0.875rem 1rem',
                                    fontSize: '1rem',
                                    border: '1px solid rgba(17, 62, 83, 0.2)',
                                    borderRadius: '12px',
                                    background: 'rgba(255, 255, 255, 0.5)',
                                    color: '#113e53',
                                    outline: 'none',
                                    transition: 'all 0.2s'
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = 'rgba(17, 62, 83, 0.4)';
                                    e.target.style.background = 'rgba(255, 255, 255, 0.8)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = 'rgba(17, 62, 83, 0.2)';
                                    e.target.style.background = 'rgba(255, 255, 255, 0.5)';
                                }}
                            />
                        </div>

                        <div>
                            <label htmlFor="password" style={{
                                display: 'block',
                                fontSize: '0.875rem',
                                fontWeight: 500,
                                marginBottom: '0.5rem',
                                color: '#113e53',
                                opacity: 0.8
                            }}>
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                style={{
                                    width: '100%',
                                    padding: '0.875rem 1rem',
                                    fontSize: '1rem',
                                    border: '1px solid rgba(17, 62, 83, 0.2)',
                                    borderRadius: '12px',
                                    background: 'rgba(255, 255, 255, 0.5)',
                                    color: '#113e53',
                                    outline: 'none',
                                    transition: 'all 0.2s'
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = 'rgba(17, 62, 83, 0.4)';
                                    e.target.style.background = 'rgba(255, 255, 255, 0.8)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = 'rgba(17, 62, 83, 0.2)';
                                    e.target.style.background = 'rgba(255, 255, 255, 0.5)';
                                }}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn"
                            style={{
                                width: '100%',
                                padding: '1rem',
                                fontSize: '1.05rem',
                                marginTop: '0.5rem'
                            }}
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    {/* Sign Up Link */}
                    <p style={{
                        marginTop: '2rem',
                        fontSize: '0.95rem',
                        color: '#113e53',
                        opacity: 0.7
                    }}>
                        Don't have an account?{' '}
                        <Link href="/signup" style={{
                            color: '#113e53',
                            fontWeight: 500,
                            textDecoration: 'underline',
                            opacity: 1
                        }}>
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
}
