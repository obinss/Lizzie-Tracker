import recipes from '@/data/defaultRecipes.json';

export interface Recipe {
    id: string;
    name: string;
    category: string;
    prepTime: number;
    cookTime: number;
    servings: number;
    image: string;
    ingredients: { item: string; quantity: string }[];
    instructions: string;
}

export interface MealPlan {
    id?: string;
    userId: string;
    weekStarting: Date;
    meals: {
        [day: string]: {
            breakfast: Recipe;
            lunch: Recipe;
            dinner: Recipe;
        };
    };
    suggestions: Array<{
        from: string;
        meal: string;
        suggestion: Recipe;
    }>;
}

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

/**
 * Generates a default weekly meal plan with variety
 */
export const generateDefaultMealPlan = (userId: string, weekStartDate: Date): MealPlan => {
    const breakfastRecipes = recipes.filter(r => r.category === 'breakfast');
    const lunchRecipes = recipes.filter(r => r.category === 'lunch');
    const dinnerRecipes = recipes.filter(r => r.category === 'dinner');

    const meals: MealPlan['meals'] = {};

    DAYS.forEach((day, index) => {
        meals[day] = {
            breakfast: breakfastRecipes[index % breakfastRecipes.length] as Recipe,
            lunch: lunchRecipes[index % lunchRecipes.length] as Recipe,
            dinner: dinnerRecipes[index % dinnerRecipes.length] as Recipe,
        };
    });

    return {
        userId,
        weekStarting: weekStartDate,
        meals,
        suggestions: [],
    };
};

/**
 * Generates a shopping list from a meal plan
 */
export const generateShoppingList = (mealPlan: MealPlan) => {
    const items: { [key: string]: { quantity: string; owned: boolean } } = {};

    Object.values(mealPlan.meals).forEach(day => {
        ['breakfast', 'lunch', 'dinner'].forEach(mealType => {
            const meal = day[mealType as keyof typeof day];
            meal.ingredients.forEach(ingredient => {
                const key = ingredient.item.toLowerCase();
                if (!items[key]) {
                    items[key] = {
                        quantity: ingredient.quantity,
                        owned: false,
                    };
                } else {
                    // Simple quantity combination (could be improved)
                    items[key].quantity += ', ' + ingredient.quantity;
                }
            });
        });
    });

    return Object.entries(items).map(([name, data]) => ({
        name,
        ...data,
    }));
};

/**
 * Get all recipes
 */
export const getAllRecipes = (): Recipe[] => {
    return recipes as Recipe[];
};

/**
 * Get recipe by ID
 */
export const getRecipeById = (id: string): Recipe | undefined => {
    return recipes.find(r => r.id === id) as Recipe | undefined;
};

/**
 * Get the start of the current week (Monday)
 */
export const getWeekStart = (date: Date = new Date()): Date => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    return new Date(d.setDate(diff));
};
