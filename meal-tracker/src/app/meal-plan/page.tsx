'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { MealPlan } from '@/lib/mealPlanGenerator';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function MealPlanPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
    const [loadingPlan, setLoadingPlan] = useState(true);
    const [selectedMeal, setSelectedMeal] = useState<any>(null);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    useEffect(() => {
        const loadMealPlan = async () => {
            if (!user) return;

            try {
                const q = query(
                    collection(db, 'mealPlans'),
                    where('userId', '==', user.uid)
                );
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const doc = querySnapshot.docs[0];
                    setMealPlan({ id: doc.id, ...doc.data() } as MealPlan);
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
                        <p className="mt-4 text-gray-600">Loading meal plan...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="fade-in">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">Your Weekly Meal Plan</h1>
                    <p className="text-gray-600 text-lg">Plan your meals for the entire week</p>
                </div>

                <div className="space-y-6">
                    {DAYS.map((day) => {
                        const dayKey = day.toLowerCase();
                        const dayMeals = mealPlan?.meals[dayKey];

                        return (
                            <div key={day} className="card">
                                <h2 className="text-2xl font-bold mb-4 gradient-text">{day}</h2>
                                <div className="grid md:grid-cols-3 gap-4">
                                    {dayMeals && (
                                        <>
                                            <MealCell
                                                meal={dayMeals.breakfast}
                                                type="Breakfast"
                                                emoji="🌅"
                                                onClick={() => setSelectedMeal(dayMeals.breakfast)}
                                            />
                                            <MealCell
                                                meal={dayMeals.lunch}
                                                type="Lunch"
                                                emoji="☀️"
                                                onClick={() => setSelectedMeal(dayMeals.lunch)}
                                            />
                                            <MealCell
                                                meal={dayMeals.dinner}
                                                type="Dinner"
                                                emoji="🌙"
                                                onClick={() => setSelectedMeal(dayMeals.dinner)}
                                            />
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Recipe Modal */}
                {selectedMeal && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                        onClick={() => setSelectedMeal(null)}
                    >
                        <div
                            className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <div className="text-6xl mb-4">{selectedMeal.image}</div>
                                    <h2 className="text-3xl font-bold">{selectedMeal.name}</h2>
                                    <p className="text-gray-600 mt-2">
                                        ⏱️ Prep: {selectedMeal.prepTime}min | Cook: {selectedMeal.cookTime}min
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSelectedMeal(null)}
                                    className="text-gray-400 hover:text-gray-600 text-2xl"
                                >
                                    ×
                                </button>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-xl font-semibold mb-3">Ingredients</h3>
                                <ul className="space-y-2">
                                    {selectedMeal.ingredients.map((ing: any, idx: number) => (
                                        <li key={idx} className="flex items-start">
                                            <span className="text-primary mr-2">•</span>
                                            <span>{ing.quantity} {ing.item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold mb-3">Instructions</h3>
                                <p className="text-gray-700 whitespace-pre-line">{selectedMeal.instructions}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}

interface MealCellProps {
    meal: any;
    type: string;
    emoji: string;
    onClick: () => void;
}

function MealCell({ meal, type, emoji, onClick }: MealCellProps) {
    return (
        <button
            onClick={onClick}
            className="card text-left w-full hover:shadow-xl transition-all hover:scale-105"
        >
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">{type}</span>
                <span className="text-xl">{emoji}</span>
            </div>
            <div className="text-3xl mb-2">{meal.image}</div>
            <h4 className="font-semibold text-sm">{meal.name}</h4>
            <p className="text-xs text-gray-500 mt-1">Click for recipe</p>
        </button>
    );
}
