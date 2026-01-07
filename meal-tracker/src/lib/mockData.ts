// Mock data for demo mode - Updated with icons instead of emojis
import { type MealPlan, type Recipe } from './mealPlanGenerator';

// Icon mapping for different meal types
const MEAL_ICONS = {
    breakfast: 'Coffee',
    lunch: 'Sandwich',
    dinner: 'Pizza',
    default: 'Utensils'
};

// Helper to create recipes with icons
const createRecipe = (
    id: string,
    name: string,
    icon: string,
    category: string,
    prepTime: number,
    cookTime: number
): Recipe => ({
    id,
    name,
    category,
    prepTime,
    cookTime,
    servings: 2,
    image: icon, // Icon name instead of emoji
    ingredients: [],
    instructions: ''
});

export const demoMealPlan: MealPlan = {
    id: 'demo-plan-1',
    userId: 'demo',
    weekStarting: new Date(),
    meals: {
        monday: {
            breakfast: createRecipe('b1', 'Greek Yogurt Parfait', 'Coffee', 'breakfast', 5, 0),
            lunch: createRecipe('l1', 'Chicken Caesar Salad', 'Salad', 'lunch', 10, 15),
            dinner: createRecipe('d1', 'Grilled Salmon with Vegetables', 'Fish', 'dinner', 10, 20)
        },
        tuesday: {
            breakfast: createRecipe('b2', 'Avocado Toast', 'Coffee', 'breakfast', 5, 5),
            lunch: createRecipe('l2', 'Quinoa Bowl', 'Bowl', 'lunch', 15, 20),
            dinner: createRecipe('d2', 'Chicken Stir Fry', 'Soup', 'dinner', 15, 15)
        },
        wednesday: {
            breakfast: createRecipe('b3', 'Oatmeal with Berries', 'Coffee', 'breakfast', 5, 10),
            lunch: createRecipe('l3', 'Turkey Wrap', 'Sandwich', 'lunch', 10, 0),
            dinner: createRecipe('d3', 'Pasta Primavera', 'Pizza', 'dinner', 10, 20)
        },
        thursday: {
            breakfast: createRecipe('b4', 'Smoothie Bowl', 'Coffee', 'breakfast', 10, 0),
            lunch: createRecipe('l4', 'Tuna Salad', 'Salad', 'lunch', 10, 0),
            dinner: createRecipe('d4', 'Beef Tacos', 'Pizza', 'dinner', 10, 15)
        },
        friday: {
            breakfast: createRecipe('b5', 'Eggs Benedict', 'Egg', 'breakfast', 10, 15),
            lunch: createRecipe('l5', 'Caprese Sandwich', 'Sandwich', 'lunch', 10, 0),
            dinner: createRecipe('d5', 'Grilled Chicken with Sweet Potato', 'Drumstick', 'dinner', 15, 30)
        },
        saturday: {
            breakfast: createRecipe('b6', 'Pancakes', 'Coffee', 'breakfast', 10, 15),
            lunch: createRecipe('l6', 'Buddha Bowl', 'Bowl', 'lunch', 20, 15),
            dinner: createRecipe('d6', 'Homemade Pizza', 'Pizza', 'dinner', 20, 15)
        },
        sunday: {
            breakfast: createRecipe('b7', 'French Toast', 'Coffee', 'breakfast', 10, 10),
            lunch: createRecipe('l7', 'Chicken Noodle Soup', 'Soup', 'lunch', 15, 30),
            dinner: createRecipe('d7', 'Roast Beef Dinner', 'Beef', 'dinner', 15, 60)
        }
    },
    suggestions: []
};
