export interface TravelPreferences {
  destination: string;
  budget: string;
  currency: string;
  startDate: string;
  endDate: string;
  interests: string[];
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface BookingInfo {
  text: string;
  url?: string;
}

export interface Activity {
  time: string;
  description: string;
  attractionName: string;
  coordinates: Coordinates;
  openingHours?: string;
  estimatedDuration?: string;
  bookingInfo?: BookingInfo;
  userReviewsSummary?: string;
  averageCost?: string;
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

export interface TravelTip {
  tip: string;
  explanation: string;
}

export interface PackingListItem {
  item: string;
  reason: string;
}

export interface Itinerary {
  title: string;
  destination: string;
  duration: number;
  startDate: string;
  endDate: string;
  coordinates: Coordinates;
  travelTips: TravelTip[];
  dailyPlans: DailyPlan[];
  packingList: PackingListItem[];
}

export interface SavedItinerary extends Itinerary {
  id: string;
  savedAt: string;
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
    { code: "USD", name: "United States Dollar", symbol: "$" },
    { code: "EUR", name: "Euro", symbol: "€" },
    { code: "JPY", name: "Japanese Yen", symbol: "¥" },
    { code: "GBP", name: "British Pound Sterling", symbol: "£" },
    { code: "CAD", name: "Canadian Dollar", symbol: "CA$" },
    { code: "AUD", name: "Australian Dollar", symbol: "A$" },
    { code: "CHF", name: "Swiss Franc", symbol: "CHF" },
];