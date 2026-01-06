'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { generateShoppingList, type MealPlan } from '@/lib/mealPlanGenerator';

export default function ShoppingListPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [shoppingList, setShoppingList] = useState<any[]>([]);
    const [loadingList, setLoadingList] = useState(true);
    const [ownedItems, setOwnedItems] = useState<Set<string>>(new Set());

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    useEffect(() => {
        const loadShoppingList = async () => {
            if (!user) return;

            try {
                const q = query(
                    collection(db, 'mealPlans'),
                    where('userId', '==', user.uid)
                );
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const doc = querySnapshot.docs[0];
                    const mealPlan = doc.data() as MealPlan;
                    const list = generateShoppingList(mealPlan);
                    setShoppingList(list);
                }
            } catch (error) {
                console.error('Error loading shopping list:', error);
            } finally {
                setLoadingList(false);
            }
        };

        if (user) {
            loadShoppingList();
        }
    }, [user]);

    const toggleOwned = (itemName: string) => {
        setOwnedItems((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(itemName)) {
                newSet.delete(itemName);
            } else {
                newSet.add(itemName);
            }
            return newSet;
        });
    };

    const filteredList = shoppingList.filter((item) => !ownedItems.has(item.name));

    if (loading || loadingList) {
        return (
            <Layout>
                <div className="flex min-h-[60vh] items-center justify-center">
                    <div className="text-center">
                        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
                        <p className="mt-4 text-gray-600">Generating shopping list...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="fade-in max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">Shopping List</h1>
                    <p className="text-gray-600 text-lg">
                        Check off items you already have
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* All Items */}
                    <div className="card">
                        <h2 className="text-2xl font-bold mb-4">All Items</h2>
                        <div className="space-y-3">
                            {shoppingList.map((item, idx) => (
                                <label
                                    key={idx}
                                    className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                                >
                                    <input
                                        type="checkbox"
                                        checked={ownedItems.has(item.name)}
                                        onChange={() => toggleOwned(item.name)}
                                        className="mt-1 h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                                    />
                                    <div className="flex-1">
                                        <p className={`font-medium capitalize ${ownedItems.has(item.name) ? 'line-through text-gray-400' : ''}`}>
                                            {item.name}
                                        </p>
                                        <p className="text-sm text-gray-500">{item.quantity}</p>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Need to Buy */}
                    <div className="card bg-gradient-to-br from-primary/5 to-secondary/5">
                        <h2 className="text-2xl font-bold mb-4 gradient-text">Need to Buy</h2>
                        {filteredList.length > 0 ? (
                            <div className="space-y-3">
                                {filteredList.map((item, idx) => (
                                    <div key={idx} className="p-3 bg-white rounded-lg shadow-sm">
                                        <p className="font-medium capitalize">{item.name}</p>
                                        <p className="text-sm text-gray-500">{item.quantity}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <div className="text-5xl mb-3">✅</div>
                                <p className="text-gray-600">You have everything!</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Summary */}
                <div className="mt-8 card bg-gradient-to-r from-primary to-secondary text-white">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div>
                            <h3 className="text-xl font-semibold mb-2">Shopping Summary</h3>
                            <p className="opacity-90">
                                {filteredList.length} items to buy • {ownedItems.size} items owned
                            </p>
                        </div>
                        <button
                            onClick={() => window.print()}
                            className="btn bg-white text-primary hover:bg-gray-100 mt-4 md:mt-0"
                        >
                            🖨️ Print List
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
