// Type definitions for MMS API

export type Meal = "breakfast" | "lunch" | "snacks" | "dinner";
export type Category = "registered" | "unregistered" | "guest" | "extra";
export type Day = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday" | null;

export interface User {
  id: string;
  name: string;
  roll_number?: string;
  email: string;
  last_login_at: string;
  created_at: string;
  token: string;
  attributes: string;
  tags: number;
}

export interface MessInfo {
  id: string;
  name: string;
  menu_link?: string;
  open: boolean;
}

export interface MealRegistration {
  meal_date: string;
  meal_type: Meal;
  meal_mess: string;
  category: Category;
  user_id: string;
  registered_at: string;
  cancelled_at?: string;
  availed_at?: string;
  availed_price?: number;
  monthly_reg?: string;
  metadata?: Record<string, unknown>;
}

export interface ExtraItem {
  id: string;
  name: string;
  description: string;
  rate: number;
  mess: string;
  food_tags: boolean;
}

export interface ExtraRegistration {
  id: string;
  extra: string;
  meal_date: string;
  meal_type: Meal;
  meal_mess: string;
  user_id: string;
  registered_at: string;
  availed_at?: string;
  availed_price?: number;
  is_unregistered: boolean;
  extra_name: string;
  extra_description: string;
  extra_rate: string;
  extra_food_tags: string;
}

export interface MonthlyRegistration {
  id: string;
  meal_mess: string;
  user_id: string;
  month: number;
  year: number;
}

export interface MealTiming {
  meal: Meal;
  start_time: string;
  end_time: string;
}

export interface UserPreferences {
  notify_not_registered: boolean;
  notify_malloc_happened: boolean;
  auto_reset_token_daily: boolean;
  enable_unregistered: boolean;
  nag_for_feedback: boolean;
}

export interface Bill {
  non_projected: number;
  projected: number;
}

export interface MealRating {
  rating: number;
  count: number;
}

export interface ApiResponse<T> {
  data: T;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
  };
}
