'use client';

import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Camera } from 'lucide-react';
import { useState, useEffect } from 'react';
import MealIcon from './MealIcon';
import { getMealPhoto, type MealPhoto } from '@/lib/photoStorage';
import { useAuth } from '@/contexts/AuthContext';

interface Meal {
    id: string;
    name: string;
    image: string;
    prepTime: number;
    cookTime: number;
}

interface DayMeals {
    breakfast: Meal;
    lunch: Meal;
    dinner: Meal;
}

interface WeekCalendarProps {
    meals: { [day: string]: DayMeals };
    onPhotoUpload?: (day: string, mealType: string, meal: Meal) => void;
}

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function WeekCalendar({ meals, onPhotoUpload }: WeekCalendarProps) {
    const [weekOffset, setWeekOffset] = useState(0);
    const [mealPhotos, setMealPhotos] = useState<{ [key: string]: MealPhoto | null }>({});
    const { user } = useAuth();

    // Get current date
    const today = new Date();
    const currentDayIndex = (today.getDay() + 6) % 7; // Convert Sunday=0 to Monday=0

    // Get dates for current week
    const getWeekDates = () => {
        const dates = [];
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - currentDayIndex + (weekOffset * 7));

        for (let i = 0; i < 7; i++) {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            dates.push(date);
        }
        return dates;
    };

    const weekDates = getWeekDates();

    const isToday = (dayIndex: number) => {
        return weekOffset === 0 && dayIndex === currentDayIndex;
    };

    // Load photos when component mounts or user changes
    useEffect(() => {
        if (!user?.uid) return;

        const photos: { [key: string]: MealPhoto | null } = {};
        DAYS.forEach((day) => {
            ['breakfast', 'lunch', 'dinner'].forEach((mealType) => {
                const key = `${day}_${mealType}`;
                photos[key] = getMealPhoto(user.uid, day, mealType);
            });
        });
        setMealPhotos(photos);
    }, [user]);

    return (
        <div style={{
            background: 'rgba(255, 255, 255, 0.4)',
            borderRadius: '24px',
            padding: '2rem',
            marginTop: '2rem'
        }}>
            {/* Calendar Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '2rem'
            }}>
                <h2 style={{
                    fontSize: '1.5rem',
                    fontWeight: 600,
                    color: '#113e53',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    <CalendarIcon size={24} />
                    Weekly Meal Plan
                </h2>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <button
                        onClick={() => setWeekOffset(weekOffset - 1)}
                        style={{
                            background: 'rgba(17, 62, 83, 0.1)',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '0.5rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center'
                        }}
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <span style={{ color: '#113e53', fontWeight: 500 }}>
                        {weekDates[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} -{' '}
                        {weekDates[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                    <button
                        onClick={() => setWeekOffset(weekOffset + 1)}
                        style={{
                            background: 'rgba(17, 62, 83, 0.1)',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '0.5rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center'
                        }}
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            {/* Calendar Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gap: '1rem',
                overflowX: 'auto'
            }}>
                {/* Day Headers */}
                {DAY_LABELS.map((label, index) => (
                    <div key={label} style={{
                        textAlign: 'center',
                        padding: '0.75rem',
                        background: isToday(index) ? '#113e53' : 'rgba(17, 62, 83, 0.1)',
                        color: isToday(index) ? 'white' : '#113e53',
                        borderRadius: '12px',
                        fontWeight: 600,
                        fontSize: '0.875rem'
                    }}>
                        <div>{label}</div>
                        <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>
                            {weekDates[index].getDate()}
                        </div>
                    </div>
                ))}

                {/* Meal Rows */}
                {DAYS.map((day, dayIndex) => {
                    const dayMeals = meals[day];
                    if (!dayMeals) return null;

                    return (
                        <div key={day} style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.5rem'
                        }}>
                            {/* Breakfast */}
                            <MealCard
                                meal={dayMeals.breakfast}
                                mealType="breakfast"
                                day={day}
                                isToday={isToday(dayIndex)}
                                photo={mealPhotos[`${day}_breakfast`]}
                                onPhotoUpload={onPhotoUpload}
                            />

                            {/* Lunch */}
                            <MealCard
                                meal={dayMeals.lunch}
                                mealType="lunch"
                                day={day}
                                isToday={isToday(dayIndex)}
                                photo={mealPhotos[`${day}_lunch`]}
                                onPhotoUpload={onPhotoUpload}
                            />

                            {/* Dinner */}
                            <MealCard
                                meal={dayMeals.dinner}
                                mealType="dinner"
                                day={day}
                                isToday={isToday(dayIndex)}
                                photo={mealPhotos[`${day}_dinner`]}
                                onPhotoUpload={onPhotoUpload}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// Individual meal card component
interface MealCardProps {
    meal: Meal;
    mealType: string;
    day: string;
    isToday: boolean;
    photo?: MealPhoto | null;
    onPhotoUpload?: (day: string, mealType: string, meal: Meal) => void;
}

function MealCard({ meal, mealType, day, isToday, photo, onPhotoUpload }: MealCardProps) {
    return (
        <div style={{
            background: isToday ? 'rgba(17, 62, 83, 0.05)' : 'white',
            border: isToday ? '2px solid #113e53' : '1px solid rgba(17, 62, 83, 0.1)',
            borderRadius: '12px',
            padding: '0.75rem',
            transition: 'all 0.2s ease',
            cursor: 'pointer',
            position: 'relative',
            minHeight: '80px'
        }}
            onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
            }}
            onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
            }}
        >
            {/* Photo thumbnail if available */}
            {photo && (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    borderRadius: '12px',
                    overflow: 'hidden',
                    opacity: 0.3
                }}>
                    <img
                        src={photo.photoData}
                        alt={meal.name}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                        }}
                    />
                </div>
            )}

            {/* Content */}
            <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '0.5rem'
                }}>
                    <MealIcon iconName={meal.image} size={20} />
                    <div style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: '#113e53',
                        flex: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                    }}>
                        {meal.name}
                    </div>
                </div>
                <div style={{
                    fontSize: '0.625rem',
                    color: '#113e53',
                    opacity: 0.7
                }}>
                    {meal.prepTime + meal.cookTime}m
                </div>
            </div>

            {/* Photo upload button */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onPhotoUpload?.(day, mealType, meal);
                }}
                style={{
                    position: 'absolute',
                    bottom: '0.5rem',
                    right: '0.5rem',
                    background: photo ? 'rgba(255, 255, 255, 0.9)' : 'rgba(17, 62, 83, 0.1)',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '0.25rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    transition: 'all 0.2s',
                    zIndex: 2
                }}
                onMouseOver={(e) => {
                    e.currentTarget.style.background = photo ? 'white' : 'rgba(17, 62, 83, 0.2)';
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.background = photo ? 'rgba(255, 255, 255, 0.9)' : 'rgba(17, 62, 83, 0.1)';
                }}
            >
                <Camera size={14} />
            </button>
        </div>
    );
}
