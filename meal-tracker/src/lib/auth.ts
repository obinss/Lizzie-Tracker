import {
    mockSignUp,
    mockSignIn,
    mockSignOut,
    mockOnAuthStateChanged,
    mockGetUserProfile,
    type MockUser
} from './mockAuth';

export interface UserProfile {
    uid: string;
    email: string;
    name: string;
    createdAt: Date;
    friends: string[];
}

// Sign up a new user with mock authentication
export const signUp = async (
    email: string,
    password: string,
    name: string
) => {
    try {
        const user = await mockSignUp(email, password, name);
        return { user };
    } catch (error: any) {
        throw new Error(error.message || 'Failed to create account');
    }
};

// Sign in existing user
export const signIn = async (
    email: string,
    password: string
) => {
    try {
        const user = await mockSignIn(email, password);
        return { user };
    } catch (error: any) {
        throw new Error(error.message || 'Failed to sign in');
    }
};

// Sign out current user
export const logOut = async (): Promise<void> => {
    try {
        await mockSignOut();
    } catch (error: any) {
        throw new Error(error.message || 'Failed to sign out');
    }
};

// Listen to auth state changes
export const onAuthChange = (callback: (user: MockUser | null) => void) => {
    return mockOnAuthStateChanged(callback);
};

// Get user profile
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
    try {
        const profile = await mockGetUserProfile(uid);
        if (profile) {
            return {
                uid,
                email: profile.email,
                name: profile.name,
                createdAt: new Date(),
                friends: profile.friends
            };
        }
        return null;
    } catch (error) {
        console.error('Error getting user profile:', error);
        return null;
    }
};
