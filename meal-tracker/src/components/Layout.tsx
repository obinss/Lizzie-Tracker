'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { logOut } from '@/lib/auth';
import { useRouter, usePathname } from 'next/navigation';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = async () => {
        try {
            await logOut();
            router.push('/');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const navLinks = user
        ? [
            { href: '/dashboard', label: '🏠 Dashboard' },
            { href: '/meal-plan', label: '📅 Meal Plan' },
            { href: '/shopping-list', label: '🛒 Shopping List' },
            { href: '/upload-photo', label: '📸 Upload Photo' },
            { href: '/settings', label: '⚙️ Settings' },
        ]
        : [];

    return (
        <div className="min-h-screen flex flex-col">
            <header className="glass sticky top-0 z-50 border-b border-gray-200">
                <nav className="container mx-auto px-4 sm:px-6 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="text-2xl font-bold gradient-text">
                            🍽️ Meal Tracker
                        </Link>

                        {!loading && (
                            <div className="flex items-center gap-6">
                                {user ? (
                                    <>
                                        <div className="hidden md:flex items-center gap-4">
                                            {navLinks.map((link) => (
                                                <Link
                                                    key={link.href}
                                                    href={link.href}
                                                    className={`text-sm font-medium transition-colors hover:text-primary ${pathname === link.href
                                                            ? 'text-primary'
                                                            : 'text-gray-600'
                                                        }`}
                                                >
                                                    {link.label}
                                                </Link>
                                            ))}
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className="btn btn-outline text-sm"
                                        >
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <div className="flex items-center gap-4">
                                        <Link href="/login" className="btn btn-outline text-sm">
                                            Login
                                        </Link>
                                        <Link href="/signup" className="btn btn-primary text-sm">
                                            Sign Up
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Mobile Navigation */}
                    {user && (
                        <div className="md:hidden mt-4 flex gap-2 overflow-x-auto pb-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`text-xs font-medium px-3 py-2 rounded-full whitespace-nowrap transition-colors ${pathname === link.href
                                            ? 'bg-primary text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    )}
                </nav>
            </header>

            <main className="flex-1 container mx-auto px-4 sm:px-6 py-8">
                {children}
            </main>

            <footer className="bg-gray-50 border-t border-gray-200 py-8 mt-12">
                <div className="container mx-auto px-4 sm:px-6">
                    <div className="text-center text-gray-600 text-sm">
                        <p>© 2026 Meal Tracker. Built with ❤️ for healthy eating habits.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
