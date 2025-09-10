import { GoogleGenAI, Type } from "@google/genai";
import { TravelPreferences, Itinerary } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateItinerary = async (preferences: TravelPreferences): Promise<Itinerary> => {
    const { destination, budget, currency, startDate, endDate, interests } = preferences;

    const days = Math.max(1, Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)));

    const prompt = `
      You are an expert travel planner. Create a detailed, day-by-day travel itinerary based on these user preferences:
      - Destination: ${destination}
      - Trip Duration: ${days} day(s)
      - Budget: Approximately ${budget} ${currency}
      - Interests: ${interests.join(", ")}

      Your response must be a JSON object that strictly follows this schema.
      Include precise latitude and longitude coordinates for the main destination and for each individual attraction.
      For each day, provide:
      - A creative theme.
      - 2-3 specific activities with suggested times.
      - A local food dish to try and a specific, well-regarded restaurant suggestion.
      - A typical weather forecast (e.g., "Sunny and warm") and temperature range for the season.
      For each activity, also provide:
      - openingHours: Typical opening hours (e.g., "9:00 AM - 5:00 PM", or "Varies").
      - estimatedDuration: A suggested duration (e.g., "2-3 hours").
      - bookingInfo: Booking advice (e.g., "Book tickets online in advance" or "No booking required").
      Ensure attraction and restaurant names are real and well-known for the destination.
      The travel tips should be practical and helpful.
    `;
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING, description: "A catchy title for the trip." },
                        destination: { type: Type.STRING },
                        duration: { type: Type.INTEGER },
                        coordinates: {
                            type: Type.OBJECT,
                            description: "Latitude and Longitude for the destination city.",
                            properties: {
                                lat: { type: Type.NUMBER },
                                lng: { type: Type.NUMBER }
                            },
                            required: ["lat", "lng"]
                        },
                        travelTips: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                            description: "A list of practical travel tips."
                        },
                        dailyPlans: {
                            type: Type.ARRAY,
                            description: "The detailed plan for each day of the trip.",
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    day: { type: Type.INTEGER, description: "The day number (e.g., 1, 2)." },
                                    theme: { type: Type.STRING, description: "A theme for the day's activities." },
                                    weather: {
                                        type: Type.OBJECT,
                                        description: "Typical weather forecast for the day.",
                                        properties: {
                                            forecast: { type: Type.STRING },
                                            temperature: { type: Type.STRING, description: "e.g., 25°C / 77°F" }
                                        },
                                        required: ["forecast", "temperature"]
                                    },
                                    activities: {
                                        type: Type.ARRAY,
                                        items: {
                                            type: Type.OBJECT,
                                            properties: {
                                                time: { type: Type.STRING, description: "Suggested time (e.g., '9:00 AM')." },
                                                description: { type: Type.STRING, description: "Description of the activity." },
                                                attractionName: { type: Type.STRING, description: "Name of the key attraction for this activity." },
                                                coordinates: {
                                                    type: Type.OBJECT,
                                                    description: "Latitude and Longitude for the attraction.",
                                                    properties: {
                                                        lat: { type: Type.NUMBER },
                                                        lng: { type: Type.NUMBER }
                                                    },
                                                    required: ["lat", "lng"]
                                                },
                                                openingHours: { type: Type.STRING, description: "Typical opening hours (e.g., '9:00 AM - 5:00 PM')." },
                                                estimatedDuration: { type: Type.STRING, description: "Suggested duration for the activity (e.g., '2-3 hours')." },
                                                bookingInfo: { type: Type.STRING, description: "Booking advice (e.g., 'Book tickets online in advance')." },
                                            },
                                            required: ["time", "description", "attractionName", "coordinates", "openingHours", "estimatedDuration", "bookingInfo"]
                                        }
                                    },
                                    foodToTry: {
                                        type: Type.OBJECT,
                                        description: "A local dish and a suggested restaurant.",
                                        properties: {
                                            dishName: { type: Type.STRING },
                                            suggestedRestaurant: { type: Type.STRING }
                                        },
                                        required: ["dishName", "suggestedRestaurant"]
                                    }
                                },
                                required: ["day", "theme", "weather", "activities", "foodToTry"]
                            }
                        }
                    },
                    required: ["title", "destination", "duration", "coordinates", "travelTips", "dailyPlans"]
                }
            }
        });

        const jsonText = response.text.trim();
        const itineraryData = JSON.parse(jsonText);
        return itineraryData as Itinerary;
    } catch (error) {
        console.error("Error generating itinerary:", error);
        throw new Error("Failed to generate itinerary. The AI may be experiencing high demand. Please try again later.");
    }
};

export const generateImageForAttraction = async (attractionName: string, destination: string): Promise<string> => {
    const prompt = `Vibrant, photorealistic travel photograph of ${attractionName}, ${destination}. Show the landmark clearly in a beautiful, scenic context. No people in the foreground.`;
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: '16:9',
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes = response.generatedImages[0].image.imageBytes;
            return `data:image/jpeg;base64,${base64ImageBytes}`;
        } else {
            throw new Error("No image was generated.");
        }
    } catch (error) {
        console.error(`Error generating image for ${attractionName}:`, error);
        // Return a placeholder URL on failure
        return `https://picsum.photos/seed/${encodeURIComponent(attractionName)}/1280/720`;
    }
};