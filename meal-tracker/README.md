# 🍽️ Meal Tracker - Collaborative Eating Habits App

A modern web application for tracking eating habits with friends. Features meal planning, recipe management, smart shopping lists, photo verification, and collaborative tracking.

## ✨ Features

- **Smart Meal Planning**: Personalized weekly meal plans with customization options
- **Recipe Database**: Detailed recipes with ingredients, instructions, and cooking times
- **Smart Shopping Lists**: Auto-generated from meal plans with owned-item filtering
- **Photo Verification**: Upload meal photos for accountability
- **Meal Reminders**: Customizable meal and prep time notifications
- **Collaborative Tracking**: Track progress with friends

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- Firebase account (free tier is sufficient)

### 1. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable "Email/Password"
4. Create Firestore Database:
   - Go to Firestore Database
   - Create database in production mode
5. Create Storage:
   - Go to Storage
   - Get started with default settings
6. Get your Firebase config:
   - Go to Project Settings > General
   - Scroll to "Your apps" and click web icon (</>)
   - Copy the configuration object

### 2. Project Setup

```bash
# Navigate to the project directory
cd meal-tracker

# Install dependencies (if not already done)
npm install

# Copy environment example file
cp env.example .env.local

# Edit .env.local with your Firebase credentials
# NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
# NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
# etc...
```

### 3. Deploy Firebase Rules

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in this project
firebase init

# Select:
# - Firestore
# - Storage
# - Hosting

# When prompted:
# - Use existing project
# - Keep firestore.rules and storage.rules as is
# - Public directory: out
# - Configure as single-page app: Yes
# - Don't overwrite existing files

# Deploy security rules
firebase deploy --only firestore:rules,storage:rules
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Deployment

### Build and Deploy to Firebase Hosting

```bash
# Build the production bundle
npm run build

# Export static files
npm run export

# Deploy to Firebase Hosting
firebase deploy --only hosting
```

Your app will be live at `https://your-project.firebaseapp.com`

## 🏗️ Project Structure

```
meal-tracker/
├── src/
│   ├── app/              # Next.js pages
│   │   ├── dashboard/    # Dashboard page
│   │   ├── meal-plan/    # Meal planning page
│   │   ├── shopping-list/# Shopping list page
│   │   ├── upload-photo/ # Photo upload page
│   │   ├── settings/     # Settings page
│   │   ├── login/        # Login page
│   │   └── signup/       # Signup page
│   ├── components/       # Reusable components
│   ├── contexts/         # React contexts (Auth)
│   ├── lib/             # Utility functions
│   │   ├── firebase.ts  # Firebase initialization
│   │   ├── auth.ts      # Authentication functions
│   │   └── mealPlanGenerator.ts # Meal plan logic
│   └── data/            # Static data
│       └── defaultRecipes.json # Default recipes
├── firebase.json        # Firebase configuration
├── firestore.rules      # Firestore security rules
└── storage.rules        # Storage security rules
```

## 🎨 Customization

### Adding New Recipes

Edit `src/data/defaultRecipes.json` to add your own recipes:

```json
{
  "id": "unique-id",
  "name": "Recipe Name",
  "category": "breakfast|lunch|dinner",
  "prepTime": 15,
  "cookTime": 20,
  "servings": 2,
  "image": "🥗",
  "ingredients": [
    { "item": "Ingredient", "quantity": "1 cup" }
  ],
  "instructions": "Step-by-step instructions..."
}
```

### Styling

The app uses a comprehensive design system defined in `src/app/globals.css`. Customize:
- Brand colors (--primary, --secondary, --accent)
- Spacing, border radius, shadows
- Dark mode colors

## 🔒 Security

- Firestore and Storage rules ensure users can only access their own data
- Authentication required for all app features
- File upload validation (type and size limits)

## 📱 Features Guide

### Meal Planning
1. Sign up or log in
2. View your dashboard for today's meals
3. Navigate to "Meal Plan" to see the full week
4. Click any meal to view the recipe

### Shopping Lists
1. Go to "Shopping List"
2. Check off items you already have
3. View "Need to Buy" for your filtered list
4. Print the list for shopping

### Photo Tracking
1. Go to "Upload Photo"
2. Select meal type
3. Choose or take a photo
4. Upload for verification

### Settings
1. Go to "Settings"
2. Set your preferred meal times
3. Configure preparation time reminders
4. Enable/disable notifications

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React, TypeScript
- **Styling**: Tailwind CSS + Custom Design System
- **Backend**: Firebase (Authentication, Firestore, Storage, Hosting)
- **State Management**: React Context API

## 📝 Notes

- The app generates a default meal plan on first login
- Photos are stored in Firebase Storage
- All meal data syncs in real-time
- The app works offline with cached data

## 🤝 Support

For issues or questions:
1. Check Firebase console for authentication/database issues
2. Verify environment variables in `.env.local`
3. Check browser console for error messages

## 📄 License

MIT License - feel free to use this for your own projects!
