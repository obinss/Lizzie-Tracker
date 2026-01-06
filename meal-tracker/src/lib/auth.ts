import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    User,
    UserCredential,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

export interface UserProfile {
    uid: string;
    email: string;
    name: string;
    createdAt: Date;
    friends: string[];
}

export const signUp = async (
    email: string,
    password: string,
    name: string
): Promise<UserCredential> => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // Create user profile in Firestore
    await setDoc(doc(db, 'users', userCredential.user.uid), {
        uid: userCredential.user.uid,
        email,
        name,
        createdAt: new Date(),
        friends: [],
    });

    // Create default settings
    await setDoc(doc(db, 'users', userCredential.user.uid, 'settings', 'preferences'), {
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

    return userCredential;
};

export const signIn = async (
    email: string,
    password: string
): Promise<UserCredential> => {
    return signInWithEmailAndPassword(auth, email, password);
};

export const logOut = async (): Promise<void> => {
    return signOut(auth);
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return docSnap.data() as UserProfile;
    }
    return null;
};

export const onAuthChange = (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
};
