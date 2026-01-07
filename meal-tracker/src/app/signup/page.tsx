'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signUp } from '@/lib/auth';

export default function SignupPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            await signUp(email, password, name);
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Failed to create account');
            setLoading(false);
        }
    };

    const inputStyle = {
        width: '100%',
        padding: '0.875rem 1rem',
        fontSize: '1rem',
        border: '1px solid rgba(17, 62, 83, 0.2)',
        borderRadius: '12px',
        background: 'rgba(255, 255, 255, 0.5)',
        color: '#113e53',
        outline: 'none',
        transition: 'all 0.2s'
    };

    return (
        <>
            {/* Minimalist Navigation */}
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

            {/* Main Content */}
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
                    <h1 style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(2.5rem, 6vw, 4rem)',
                        fontWeight: 400,
                        letterSpacing: '-0.02em',
                        marginBottom: '0.75rem',
                        lineHeight: 1.1,
                        color: '#113e53'
                    }}>
                        Create Account
                    </h1>

                    <p style={{
                        fontSize: '1.125rem',
                        opacity: 0.7,
                        marginBottom: '3rem',
                        fontWeight: 300,
                        color: '#113e53'
                    }}>
                        Start tracking your meals today
                    </p>

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

                    <form onSubmit={handleSubmit} style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1.5rem',
                        textAlign: 'left'
                    }}>
                        <div>
                            <label htmlFor="name" style={{
                                display: 'block',
                                fontSize: '0.875rem',
                                fontWeight: 500,
                                marginBottom: '0.5rem',
                                color: '#113e53',
                                opacity: 0.8
                            }}>
                                Full Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="John Doe"
                                required
                                style={inputStyle}
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
                                style={inputStyle}
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
                                style={inputStyle}
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
                            <label htmlFor="confirmPassword" style={{
                                display: 'block',
                                fontSize: '0.875rem',
                                fontWeight: 500,
                                marginBottom: '0.5rem',
                                color: '#113e53',
                                opacity: 0.8
                            }}>
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                style={inputStyle}
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
                            {loading ? 'Creating account...' : 'Create Account'}
                        </button>
                    </form>

                    <p style={{
                        marginTop: '2rem',
                        fontSize: '0.95rem',
                        color: '#113e53',
                        opacity: 0.7
                    }}>
                        Already have an account?{' '}
                        <Link href="/login" style={{
                            color: '#113e53',
                            fontWeight: 500,
                            textDecoration: 'underline',
                            opacity: 1
                        }}>
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
}
