// Mock Authentication System for Demo Mode
// Provides authentication without Firebase

export interface MockUser {
    uid: string;
    email: string;
    displayName: string;
}

export interface MockUserProfile {
    name: string;
    email: string;
    mealTimes: {
        breakfast: string;
        lunch: string;
        dinner: string;
    };
    friends: string[];
}

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Storage keys
const USERS_KEY = 'demo_users';
const CURRENT_USER_KEY = 'demo_current_user';
const PROFILES_KEY = 'demo_profiles';

// Get all users from localStorage
const getUsers = (): Record<string, { email: string; password: string; uid: string; displayName: string }> => {
    if (typeof window === 'undefined') return {};
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : {};
};

// Save users to localStorage
const saveUsers = (users: any) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// Get current user
export const getCurrentUser = (): MockUser | null => {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem(CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
};

// Mock sign up
export const mockSignUp = async (email: string, password: string, name: string): Promise<MockUser> => {
    await delay(500); // Simulate network delay

    const users = getUsers();

    // Check if user already exists
    if (users[email]) {
        throw new Error('Email already in use');
    }

    // Create new user
    const uid = `demo_${Date.now()}`;
    const user: MockUser = {
        uid,
        email,
        displayName: name
    };

    // Save user credentials
    users[email] = {
        email,
        password,
        uid,
        displayName: name
    };
    saveUsers(users);

    // Create user profile
    const profiles = getProfiles();
    profiles[uid] = {
        name,
        email,
        mealTimes: {
            breakfast: '08:00',
            lunch: '12:30',
            dinner: '18:00'
        },
        friends: []
    };
    saveProfiles(profiles);

    // Set as current user
    if (typeof window !== 'undefined') {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    }

    return user;
};

// Mock sign in
export const mockSignIn = async (email: string, password: string): Promise<MockUser> => {
    await delay(500); // Simulate network delay

    const users = getUsers();
    const userCredentials = users[email];

    if (!userCredentials || userCredentials.password !== password) {
        throw new Error('Invalid email or password');
    }

    const user: MockUser = {
        uid: userCredentials.uid,
        email: userCredentials.email,
        displayName: userCredentials.displayName
    };

    // Set as current user
    if (typeof window !== 'undefined') {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    }

    return user;
};

// Mock sign out
export const mockSignOut = async (): Promise<void> => {
    await delay(300);
    if (typeof window !== 'undefined') {
        localStorage.removeItem(CURRENT_USER_KEY);
    }
};

// Get user profile
const getProfiles = (): Record<string, MockUserProfile> => {
    if (typeof window === 'undefined') return {};
    const profiles = localStorage.getItem(PROFILES_KEY);
    return profiles ? JSON.parse(profiles) : {};
};

// Save profiles
const saveProfiles = (profiles: any) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
};

// Get user profile by UID
export const mockGetUserProfile = async (uid: string): Promise<MockUserProfile | null> => {
    await delay(200);
    const profiles = getProfiles();
    return profiles[uid] || null;
};

// Auth state observer
export const mockOnAuthStateChanged = (callback: (user: MockUser | null) => void) => {
    // Call immediately with current user
    callback(getCurrentUser());

    // Return unsubscribe function
    return () => { };
};
