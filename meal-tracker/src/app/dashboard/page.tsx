'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { type MealPlan } from '@/lib/mealPlanGenerator';
import { demoMealPlan } from '@/lib/mockData';
import WeekCalendar from '@/components/WeekCalendar';
import PhotoUploadModal from '@/components/PhotoUploadModal';
import { saveMealPhoto, getMealPhoto, deleteMealPhoto } from '@/lib/photoStorage';

export default function DashboardPage() {
    const { user, userProfile, loading } = useAuth();
    const router = useRouter();
    const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
    const [loadingPlan, setLoadingPlan] = useState(true);
    const [photoModalOpen, setPhotoModalOpen] = useState(false);
    const [selectedMeal, setSelectedMeal] = useState<{
        day: string;
        mealType: string;
        meal: any;
    } | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    useEffect(() => {
        const loadMealPlan = async () => {
            if (!user) return;

            try {
                // In demo mode, use the demo meal plan
                setMealPlan(demoMealPlan);
            } catch (error) {
                console.error('Error loading meal plan:', error);
            } finally {
                setLoadingPlan(false);
            }
        };

        if (user) {
            loadMealPlan();
        }
    }, [user]);

    const handlePhotoUpload = async (file: File) => {
        if (!user || !selectedMeal) return;

        try {
            await saveMealPhoto(
                user.uid,
                new Date().toISOString().split('T')[0],
                selectedMeal.day,
                selectedMeal.mealType as any,
                file
            );

            // Close modal and refresh calendar
            setPhotoModalOpen(false);
            setRefreshKey(prev => prev + 1); // Force calendar refresh
        } catch (error) {
            console.error('Photo upload failed:', error);
            alert('Failed to upload photo. Photo may be too large.');
        }
    };

    const handleDeletePhoto = () => {
        if (!user || !selectedMeal) return;

        const photo = getMealPhoto(user.uid, selectedMeal.day, selectedMeal.mealType);
        if (photo) {
            deleteMealPhoto(photo.id);
            setPhotoModalOpen(false);
            setRefreshKey(prev => prev + 1);
        }
    };

    const getCurrentPhoto = () => {
        if (!user || !selectedMeal) return null;
        const photo = getMealPhoto(user.uid, selectedMeal.day, selectedMeal.mealType);
        return photo?.photoData || null;
    };

    if (loading || loadingPlan) {
        return (
            <Layout>
                <div className="flex min-h-[60vh] items-center justify-center">
                    <div className="text-center">
                        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
                        <p className="mt-4 text-gray-600">Loading your dashboard...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    if (!user) return null;

    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const todaysMeals = mealPlan?.meals[today];

    return (
        <Layout>
            <div className="fade-in" style={{ maxWidth: '1400px', margin: '0 auto' }}>
                {/* Welcome Header */}
                <div className="mb-10">
                    <h1 style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(2rem, 5vw, 3rem)',
                        fontWeight: 400,
                        letterSpacing: '-0.02em',
                        marginBottom: '0.5rem',
                        color: '#113e53'
                    }}>
                        Welcome back, {userProfile?.name || 'User'}
                    </h1>
                    <p style={{
                        fontSize: '1.125rem',
                        opacity: 0.7,
                        fontWeight: 300,
                        color: '#113e53'
                    }}>
                        Here's your meal tracking dashboard
                    </p>
                </div>

                {/* Stats Overview */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1.5rem',
                    marginBottom: '2rem'
                }}>
                    {/* Week Stats */}
                    <div style={{
                        background: 'linear-gradient(135deg, #113e53 0%, #1a5570 100%)',
                        color: 'white',
                        padding: '1.5rem',
                        borderRadius: '16px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}>
                        <div style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '0.5rem' }}>
                            This Week
                        </div>
                        <div style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                            21
                        </div>
                        <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>
                            Meals Planned
                        </div>
                    </div>

                    {/* Photos Uploaded */}
                    <div style={{
                        background: 'linear-gradient(135deg, #8b5a3c 0%, #a66f4f 100%)',
                        color: 'white',
                        padding: '1.5rem',
                        borderRadius: '16px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}>
                        <div style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '0.5rem' }}>
                            Photos Uploaded
                        </div>
                        <div style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                            0
                        </div>
                        <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>
                            Support network
                        </div>
                    </div>

                    {/* Calendar Integration */}
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.6)',
                        border: '1px solid rgba(17, 62, 83, 0.1)',
                        padding: '1.5rem',
                        borderRadius: '16px'
                    }}>
                        <div style={{
                            fontSize: '0.875rem',
                            color: '#113e53',
                            fontWeight: 600,
                            marginBottom: '1rem'
                        }}>
                            Calendar Sync
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <button
                                style={{
                                    background: '#4285f4',
                                    color: 'white',
                                    border: 'none',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '8px',
                                    fontSize: '0.75rem',
                                    cursor: 'pointer',
                                    fontWeight: 500
                                }}
                                onClick={() => alert('Google Calendar integration coming soon!')}
                            >
                                Google Calendar
                            </button>
                            <button
                                style={{
                                    background: '#000',
                                    color: 'white',
                                    border: 'none',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '8px',
                                    fontSize: '0.75rem',
                                    cursor: 'pointer',
                                    fontWeight: 500
                                }}
                                onClick={() => alert('Apple Calendar export coming soon!')}
                            >
                                Apple Calendar
                            </button>
                        </div>
                    </div>
                </div>

                {/* Week Calendar */}
                <WeekCalendar
                    key={refreshKey}
                    meals={mealPlan?.meals || {}}
                    onPhotoUpload={(day, mealType, meal) => {
                        setSelectedMeal({ day, mealType, meal });
                        setPhotoModalOpen(true);
                    }}
                />

                {/* Photo Upload Modal */}
                {selectedMeal && (
                    <PhotoUploadModal
                        isOpen={photoModalOpen}
                        onClose={() => setPhotoModalOpen(false)}
                        onUpload={handlePhotoUpload}
                        currentPhoto={getCurrentPhoto()}
                        onDelete={handleDeletePhoto}
                        mealName={selectedMeal.meal.name}
                        day={selectedMeal.day}
                        mealType={selectedMeal.mealType}
                    />
                )}

                {/* Quick Actions */}
                <div className="mb-12">
                    <h2 style={{
                        fontSize: '1.75rem',
                        fontWeight: 600,
                        marginBottom: '1.5rem',
                        color: '#113e53',
                        fontFamily: 'var(--font-display)'
                    }}>
                        Quick Actions
                    </h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Link href="/meal-plan" style={{
                            display: 'block',
                            padding: '1.75rem',
                            textAlign: 'center',
                            background: 'rgba(255, 255, 255, 0.6)',
                            border: '1px solid rgba(17, 62, 83, 0.1)',
                            borderRadius: '16px',
                            textDecoration: 'none',
                            transition: 'all 0.3s ease',
                            color: '#113e53'
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15)';
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.6)';
                            }}>
                            <h3 style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '1.05rem' }}>
                                View Meal Plan
                            </h3>
                            <p style={{ fontSize: '0.875rem', opacity: 0.7 }}>Full week overview</p>
                        </Link>
                        <Link href="/shopping-list" style={{
                            display: 'block',
                            padding: '1.75rem',
                            textAlign: 'center',
                            background: 'rgba(255, 255, 255, 0.6)',
                            border: '1px solid rgba(17, 62, 83, 0.1)',
                            borderRadius: '16px',
                            textDecoration: 'none',
                            transition: 'all 0.3s ease',
                            color: '#113e53'
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15)';
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.6)';
                            }}>
                            <h3 style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '1.05rem' }}>
                                Shopping List
                            </h3>
                            <p style={{ fontSize: '0.875rem', opacity: 0.7 }}>Get your ingredients</p>
                        </Link>
                        <Link href="/upload-photo" style={{
                            display: 'block',
                            padding: '1.75rem',
                            textAlign: 'center',
                            background: 'rgba(255, 255, 255, 0.6)',
                            border: '1px solid rgba(17, 62, 83, 0.1)',
                            borderRadius: '16px',
                            textDecoration: 'none',
                            transition: 'all 0.3s ease',
                            color: '#113e53'
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15)';
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.6)';
                            }}>
                            <h3 style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '1.05rem' }}>
                                Upload Photo
                            </h3>
                            <p style={{ fontSize: '0.875rem', opacity: 0.7 }}>Track your meal</p>
                        </Link>
                        <Link href="/settings" style={{
                            display: 'block',
                            padding: '1.75rem',
                            textAlign: 'center',
                            background: 'rgba(255, 255, 255, 0.6)',
                            border: '1px solid rgba(17, 62, 83, 0.1)',
                            borderRadius: '16px',
                            textDecoration: 'none',
                            transition: 'all 0.3s ease',
                            color: '#113e53'
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15)';
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.6)';
                            }}>
                            <h3 style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '1.05rem' }}>
                                Settings
                            </h3>
                            <p style={{ fontSize: '0.875rem', opacity: 0.7 }}>Customize preferences</p>
                        </Link>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

import MealIcon from '@/components/MealIcon';

interface MealCardProps {
    meal: {
        id: string;
        name: string;
        category: string;
        prepTime: number;
        cookTime: number;
        image: string;
    };
    type: string;
}

function MealCard({ meal, type }: MealCardProps) {
    return (
        <div style={{
            background: 'rgba(255, 255, 255, 0.6)',
            border: '1px solid rgba(17, 62, 83, 0.1)',
            borderRadius: '16px',
            padding: '1.5rem',
            transition: 'all 0.3s ease'
        }}>
            <div style={{ marginBottom: '1rem' }}>
                <h3 style={{
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    color: '#113e53',
                    marginBottom: '0.25rem'
                }}>
                    {type}
                </h3>
            </div>
            <div style={{
                fontSize: '3rem',
                marginBottom: '1rem',
                display: 'flex',
                justifyContent: 'center',
                color: '#113e53'
            }}>
                <MealIcon iconName={meal.image} size={48} />
            </div>
            <h4 style={{ fontWeight: 600, marginBottom: '0.75rem', color: '#113e53' }}>
                {meal.name}
            </h4>
            <div style={{ fontSize: '0.875rem', color: '#113e53', opacity: 0.7, marginBottom: '1rem' }}>
                {meal.prepTime + meal.cookTime} minutes
            </div>
            <Link
                href={`/meal-plan`}
                className="btn"
                style={{
                    width: '100%',
                    display: 'block',
                    textAlign: 'center',
                    padding: '0.625rem',
                    fontSize: '0.875rem'
                }}
            >
                View Recipe
            </Link>
        </div>
    );
}
