'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function SettingsPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [settings, setSettings] = useState({
        mealTimes: {
            breakfast: '08:00',
            lunch: '12:00',
            dinner: '18:00',
        },
        preparationTime: {
            breakfast: 15,
            lunch: 30,
            dinner: 45,
        },
        notificationsEnabled: true,
    });
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    useEffect(() => {
        const loadSettings = async () => {
            if (!user) return;

            try {
                const docRef = doc(db, 'users', user.uid, 'settings', 'preferences');
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setSettings(docSnap.data() as any);
                }
            } catch (error) {
                console.error('Error loading settings:', error);
            }
        };

        if (user) {
            loadSettings();
        }
    }, [user]);

    const handleSave = async () => {
        if (!user) return;

        setSaving(true);
        try {
            const docRef = doc(db, 'users', user.uid, 'settings', 'preferences');
            await updateDoc(docRef, settings);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 2000);
        } catch (error) {
            console.error('Error saving settings:', error);
            alert('Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex min-h-[60vh] items-center justify-center">
                    <div className="text-center">
                        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="fade-in max-w-3xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">Settings</h1>
                    <p className="text-gray-600 text-lg">Customize your meal tracking preferences</p>
                </div>

                {success && (
                    <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                        ✅ Settings saved successfully!
                    </div>
                )}

                <div className="space-y-6">
                    {/* Meal Times */}
                    <div className="card">
                        <h2 className="text-2xl font-bold mb-4">⏰ Meal Times</h2>
                        <p className="text-gray-600 mb-6">Set your preferred meal times for reminders</p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Breakfast Time</label>
                                <input
                                    type="time"
                                    value={settings.mealTimes.breakfast}
                                    onChange={(e) =>
                                        setSettings({
                                            ...settings,
                                            mealTimes: { ...settings.mealTimes, breakfast: e.target.value },
                                        })
                                    }
                                    className="input"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Lunch Time</label>
                                <input
                                    type="time"
                                    value={settings.mealTimes.lunch}
                                    onChange={(e) =>
                                        setSettings({
                                            ...settings,
                                            mealTimes: { ...settings.mealTimes, lunch: e.target.value },
                                        })
                                    }
                                    className="input"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Dinner Time</label>
                                <input
                                    type="time"
                                    value={settings.mealTimes.dinner}
                                    onChange={(e) =>
                                        setSettings({
                                            ...settings,
                                            mealTimes: { ...settings.mealTimes, dinner: e.target.value },
                                        })
                                    }
                                    className="input"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Preparation Times */}
                    <div className="card">
                        <h2 className="text-2xl font-bold mb-4">👨‍🍳 Preparation Times</h2>
                        <p className="text-gray-600 mb-6">
                            How long before meal time should we remind you to start cooking?
                        </p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Breakfast Prep Time (minutes)
                                </label>
                                <input
                                    type="number"
                                    value={settings.preparationTime.breakfast}
                                    onChange={(e) =>
                                        setSettings({
                                            ...settings,
                                            preparationTime: {
                                                ...settings.preparationTime,
                                                breakfast: parseInt(e.target.value),
                                            },
                                        })
                                    }
                                    min="0"
                                    max="120"
                                    className="input"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Lunch Prep Time (minutes)
                                </label>
                                <input
                                    type="number"
                                    value={settings.preparationTime.lunch}
                                    onChange={(e) =>
                                        setSettings({
                                            ...settings,
                                            preparationTime: {
                                                ...settings.preparationTime,
                                                lunch: parseInt(e.target.value),
                                            },
                                        })
                                    }
                                    min="0"
                                    max="120"
                                    className="input"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Dinner Prep Time (minutes)
                                </label>
                                <input
                                    type="number"
                                    value={settings.preparationTime.dinner}
                                    onChange={(e) =>
                                        setSettings({
                                            ...settings,
                                            preparationTime: {
                                                ...settings.preparationTime,
                                                dinner: parseInt(e.target.value),
                                            },
                                        })
                                    }
                                    min="0"
                                    max="120"
                                    className="input"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Notifications */}
                    <div className="card">
                        <h2 className="text-2xl font-bold mb-4">🔔 Notifications</h2>
                        <p className="text-gray-600 mb-6">Manage your notification preferences</p>

                        <label className="flex items-center space-x-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.notificationsEnabled}
                                onChange={(e) =>
                                    setSettings({ ...settings, notificationsEnabled: e.target.checked })
                                }
                                className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <span>Enable meal reminders and notifications</span>
                        </label>
                    </div>

                    {/* Save Button */}
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="btn btn-primary w-full py-3 text-lg"
                    >
                        {saving ? 'Saving...' : 'Save Settings'}
                    </button>
                </div>
            </div>
        </Layout>
    );
}
