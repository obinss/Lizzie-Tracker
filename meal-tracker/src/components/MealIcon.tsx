// Icon renderer component to display Lucide icons dynamically
import * as Icons from 'lucide-react';

interface MealIconProps {
    iconName: string;
    size?: number;
    className?: string;
}

const iconMap: { [key: string]: any } = {
    Coffee: Icons.Coffee,
    Salad: Icons.Salad,
    Fish: Icons.Fish,
    Bowl: Icons.Cookie, // Using Cookie as bowl substitute
    Soup: Icons.Soup,
    Sandwich: Icons.Sandwich,
    Pizza: Icons.Pizza,
    Egg: Icons.Egg,
    Drumstick: Icons.Drumstick,
    Beef: Icons.Beef,
    Utensils: Icons.Utensils,
    Camera: Icons.Camera,
    Calendar: Icons.Calendar,
    Bell: Icons.Bell,
    Upload: Icons.Upload,
    ChevronLeft: Icons.ChevronLeft,
    ChevronRight: Icons.ChevronRight,
    Plus: Icons.Plus,
    X: Icons.X,
    Check: Icons.Check,
};

export default function MealIcon({ iconName, size = 24, className = '' }: MealIconProps) {
    const IconComponent = iconMap[iconName] || Icons.Utensils;

    return <IconComponent size={size} className={className} />;
}
