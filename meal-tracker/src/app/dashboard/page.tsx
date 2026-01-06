'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { generateDefaultMealPlan, getWeekStart, type MealPlan } from '@/lib/mealPlanGenerator';

export default function DashboardPage() {
    const { user, userProfile, loading } = useAuth();
    const router = useRouter();
    const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
    const [loadingPlan, setLoadingPlan] = useState(true);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    useEffect(() => {
        const loadMealPlan = async () => {
            if (!user) return;

            try {
                const weekStart = getWeekStart();
                const q = query(
                    collection(db, 'mealPlans'),
                    where('userId', '==', user.uid),
                    where('weekStarting', '==', weekStart)
                );

                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const doc = querySnapshot.docs[0];
                    setMealPlan({ id: doc.id, ...doc.data() } as MealPlan);
                } else {
                    // Generate default meal plan
                    const newPlan = generateDefaultMealPlan(user.uid, weekStart);
                    const docRef = await addDoc(collection(db, 'mealPlans'), newPlan);
                    setMealPlan({ id: docRef.id, ...newPlan });
                }
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
            <div className="fade-in">
                {/* Welcome Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">
                        Welcome back, {userProfile?.name || 'User'}! 👋
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Here&apos;s your meal tracking dashboard
                    </p>
                </div>

                {/* Quick Stats */}
                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    <div className="card bg-gradient-to-br from-primary to-primary-dark text-white">
                        <h3 className="text-sm font-medium opacity-90 mb-1">This Week</h3>
                        <p className="text-3xl font-bold">21 Meals</p>
                        <p className="text-sm opacity-75 mt-2">Planned for you</p>
                    </div>
                    <div className="card bg-gradient-to-br from-secondary to-secondary-dark text-white">
                        <h3 className="text-sm font-medium opacity-90 mb-1">Photos Uploaded</h3>
                        <p className="text-3xl font-bold">0</p>
                        <p className="text-sm opacity-75 mt-2">Keep tracking!</p>
                    </div>
                    <div className="card bg-gradient-to-br from-accent to-accent-dark text-white">
                        <h3 className="text-sm font-medium opacity-90 mb-1">Friends Tracking</h3>
                        <p className="text-3xl font-bold">{userProfile?.friends?.length || 0}</p>
                        <p className="text-sm opacity-75 mt-2">Support network</p>
                    </div>
                </div>

                {/* Today's Meals */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold mb-6">Today&apos;s Meals</h2>
                    {todaysMeals ? (
                        <div className="grid md:grid-cols-3 gap-6">
                            <MealCard meal={todaysMeals.breakfast} type="Breakfast" emoji="🌅" />
                            <MealCard meal={todaysMeals.lunch} type="Lunch" emoji="☀️" />
                            <MealCard meal={todaysMeals.dinner} type="Dinner" emoji="🌙" />
                        </div>
                    ) : (
                        <p className="text-gray-600">Loading today&apos;s meals...</p>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap- 4">
                        <Link href="/meal-plan" className="card text-center hover:shadow-xl transition-shadow">
                            <div className="text-4xl mb-3">📅</div>
                            <h3 className="font-semibold mb-1">View Meal Plan</h3>
                            <p className="text-sm text-gray-600">Full week overview</p>
                        </Link>
                        <Link href="/shopping-list" className="card text-center hover:shadow-xl transition-shadow">
                            <div className="text-4xl mb-3">🛒</div>
                            <h3 className="font-semibold mb-1">Shopping List</h3>
                            <p className="text-sm text-gray-600">Get your ingredients</p>
                        </Link>
                        <Link href="/upload-photo" className="card text-center hover:shadow-xl transition-shadow">
                            <div className="text-4xl mb-3">📸</div>
                            <h3 className="font-semibold mb-1">Upload Photo</h3>
                            <p className="text-sm text-gray-600">Track your meal</p>
                        </Link>
                        <Link href="/settings" className="card text-center hover:shadow-xl transition-shadow">
                            <div className="text-4xl mb-3">⚙️</div>
                            <h3 className="font-semibold mb-1">Settings</h3>
                            <p className="text-sm text-gray-600">Customize times</p>
                        </Link>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

interface MealCardProps {
    meal: any;
    type: string;
    emoji: string;
}

function MealCard({ meal, type, emoji }: MealCardProps) {
    return (
        <div className="card">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{type}</h3>
                <span className="text-2xl">{emoji}</span>
            </div>
            <div className="text-4xl mb-3">{meal.image}</div>
            <h4 className="font-semibold mb-2">{meal.name}</h4>
            <div className="text-sm text-gray-600 mb-4">
                ⏱️ {meal.prepTime + meal.cookTime} minutes
            </div>
            <Link
                href={`/meal-plan`}
                className="btn btn-outline w-full text-sm"
            >
                View Recipe
            </Link>
        </div>
    );
}
