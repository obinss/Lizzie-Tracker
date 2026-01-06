'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import { storage, db } from '@/lib/firebase';

export default function UploadPhotoPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [mealType, setMealType] = useState('breakfast');
    const [uploading, setUploading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile || !user) return;

        setUploading(true);
        try {
            // Upload to Firebase Storage
            const timestamp = Date.now();
            const fileRef = ref(storage, `meal-photos/${user.uid}/${timestamp}_${selectedFile.name}`);
            await uploadBytes(fileRef, selectedFile);
            const photoUrl = await getDownloadURL(fileRef);

            // Save metadata to Firestore
            await addDoc(collection(db, 'mealPhotos'), {
                userId: user.uid,
                mealType,
                photoUrl,
                uploadedAt: new Date(),
                date: new Date(),
            });

            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                setSelectedFile(null);
                setPreview(null);
            }, 2000);
        } catch (error) {
            console.error('Error uploading photo:', error);
            alert('Failed to upload photo');
        } finally {
            setUploading(false);
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
            <div className="fade-in max-w-2xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">Upload Meal Photo</h1>
                    <p className="text-gray-600 text-lg">Track your meals with photo evidence</p>
                </div>

                {success ? (
                    <div className="card text-center py-12">
                        <div className="text-6xl mb-4">✅</div>
                        <h2 className="text-2xl font-bold mb-2">Photo Uploaded!</h2>
                        <p className="text-gray-600">Great job staying on track!</p>
                    </div>
                ) : (
                    <div className="card">
                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-2">Meal Type</label>
                            <select
                                value={mealType}
                                onChange={(e) => setMealType(e.target.value)}
                                className="input"
                            >
                                <option value="breakfast">🌅 Breakfast</option>
                                <option value="lunch">☀️ Lunch</option>
                                <option value="dinner">🌙 Dinner</option>
                            </select>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-2">Photo</label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                                {preview ? (
                                    <div>
                                        <img
                                            src={preview}
                                            alt="Preview"
                                            className="max-h-64 mx-auto rounded-lg mb-4"
                                        />
                                        <button
                                            onClick={() => {
                                                setSelectedFile(null);
                                                setPreview(null);
                                            }}
                                            className="text-sm text-gray-600 hover:text-gray-800"
                                        >
                                            Change photo
                                        </button>
                                    </div>
                                ) : (
                                    <label className="cursor-pointer">
                                        <div className="text-5xl mb-3">📸</div>
                                        <p className="text-gray-600 mb-2">
                                            Click to upload or drag and drop
                                        </p>
                                        <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                    </label>
                                )}
                            </div>
                        </div>

                        {selectedFile && (
                            <button
                                onClick={handleUpload}
                                disabled={uploading}
                                className="btn btn-primary w-full py-3 text-base"
                            >
                                {uploading ? 'Uploading...' : 'Upload Photo'}
                            </button>
                        )}
                    </div>
                )}

                {/* Tips Section */}
                <div className="mt-8 card bg-gradient-to-br from-primary/5 to-secondary/5">
                    <h3 className="font-semibold mb-3">📋 Photo Tips</h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                        <li>• Take photos in good lighting</li>
                        <li>• Include the whole meal in frame</li>
                        <li>• Upload right after eating for best accountability</li>
                        <li>• Photos help you and your friends stay motivated!</li>
                    </ul>
                </div>
            </div>
        </Layout>
    );
}
