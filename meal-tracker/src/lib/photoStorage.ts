// Photo storage utilities for meal photos using localStorage

export interface MealPhoto {
    id: string;
    userId: string;
    date: string; // ISO date string
    day: string; // monday, tuesday, etc.
    mealType: 'breakfast' | 'lunch' | 'dinner';
    photoData: string; // base64 encoded image
    timestamp: number;
}

const STORAGE_KEY = 'demo_meal_photos';
const MAX_PHOTOS = 50; // Limit to prevent localStorage overflow

/**
 * Compress and resize image to reduce storage size
 */
const resizeImage = (file: File, maxWidth: number = 800): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0, width, height);

                // Convert to base64 with compression
                resolve(canvas.toDataURL('image/jpeg', 0.7));
            };
            img.onerror = reject;
            img.src = e.target?.result as string;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

/**
 * Get all photos from localStorage
 */
export const getAllPhotos = (): MealPhoto[] => {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error reading photos:', error);
        return [];
    }
};

/**
 * Save photo to localStorage
 */
export const saveMealPhoto = async (
    userId: string,
    date: string,
    day: string,
    mealType: 'breakfast' | 'lunch' | 'dinner',
    file: File
): Promise<MealPhoto> => {
    try {
        // Resize and compress image
        const photoData = await resizeImage(file);

        // Get existing photos
        const photos = getAllPhotos();

        // Check if we're at max capacity
        if (photos.length >= MAX_PHOTOS) {
            throw new Error(`Maximum of ${MAX_PHOTOS} photos reached. Please delete some photos first.`);
        }

        // Create new photo record
        const newPhoto: MealPhoto = {
            id: `${userId}_${day}_${mealType}_${Date.now()}`,
            userId,
            date,
            day,
            mealType,
            photoData,
            timestamp: Date.now()
        };

        // Remove any existing photo for this meal
        const filteredPhotos = photos.filter(
            p => !(p.userId === userId && p.day === day && p.mealType === mealType)
        );

        // Add new photo and save
        filteredPhotos.push(newPhoto);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredPhotos));

        return newPhoto;
    } catch (error) {
        console.error('Error saving photo:', error);
        throw error;
    }
};

/**
 * Get photo for specific meal
 */
export const getMealPhoto = (
    userId: string,
    day: string,
    mealType: string
): MealPhoto | null => {
    const photos = getAllPhotos();
    return photos.find(
        p => p.userId === userId && p.day === day && p.mealType === mealType
    ) || null;
};

/**
 * Delete specific photo
 */
export const deleteMealPhoto = (photoId: string): void => {
    try {
        const photos = getAllPhotos();
        const filtered = photos.filter(p => p.id !== photoId);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
        console.error('Error deleting photo:', error);
    }
};

/**
 * Get storage usage info
 */
export const getStorageInfo = () => {
    const photos = getAllPhotos();
    const dataSize = localStorage.getItem(STORAGE_KEY)?.length || 0;

    return {
        photoCount: photos.length,
        maxPhotos: MAX_PHOTOS,
        sizeKB: Math.round(dataSize / 1024),
        percentUsed: Math.round((photos.length / MAX_PHOTOS) * 100)
    };
};
