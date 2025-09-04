export interface TravelPreferences {
  destination: string;
  budget: string;
  currency: string;
  startDate: string;
  endDate: string;
  interests: string[];
}

export interface Activity {
  time: string;
  description: string;
  attractionName: string;
}

export interface FoodRec {
    dishName: string;
    suggestedRestaurant: string;
}

export interface Weather {
    forecast: string;
    temperature: string;
}

export interface DailyPlan {
  day: number;
  theme: string;
  activities: Activity[];
  foodToTry: FoodRec;
  weather: Weather;
}

export interface Itinerary {
  title: string;
  destination: string;
  duration: number;
  travelTips: string[];
  dailyPlans: DailyPlan[];
}

export const INTERESTS_OPTIONS = [
  "Food",
  "Adventure",
  "Sightseeing",
  "Relaxation",
  "History",
  "Art & Culture",
];

export const CURRENCY_OPTIONS = [
    { code: "USD", name: "United States Dollar" },
    { code: "EUR", name: "Euro" },
    { code: "JPY", name: "Japanese Yen" },
    { code: "GBP", name: "British Pound Sterling" },
    { code: "CAD", name: "Canadian Dollar" },
    { code: "AUD", name: "Australian Dollar" },
    { code: "CHF", name: "Swiss Franc" },
];