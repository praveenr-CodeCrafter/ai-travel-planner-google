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
      - Trip Duration: ${days} day(s), from ${startDate} to ${endDate}
      - Budget: Approximately ${budget} ${currency}
      - Interests: ${interests.join(", ")}

      Your response must be a JSON object that strictly follows this schema.
      The 'startDate' and 'endDate' fields in the JSON response must be '${startDate}' and '${endDate}' respectively.
      Include precise latitude and longitude coordinates for the main destination and for each individual attraction.
      For each day, provide:
      - A creative theme.
      - 2-3 specific activities with suggested times.
      - A local food dish to try and a specific, well-regarded restaurant suggestion.
      - A typical weather forecast (e.g., "Sunny and warm") and temperature range for the season.
      For each activity, also provide:
      - openingHours: Typical opening hours (e.g., "9:00 AM - 5:00 PM", or "Varies").
      - estimatedDuration: A suggested duration (e.g., "2-3 hours").
      - bookingInfo: Practical booking information. State whether tickets need to be booked in advance, if reservations are recommended, or if no booking is needed. Be specific, for example: "Book tickets online a week in advance to save 15%" or "Reservations essential, especially for weekend dinners."
      - userReviewsSummary: A brief, one-sentence summary of user reviews (e.g., "Highly rated for its breathtaking views and historical significance."). If review information is not readily available, return "N/A".
      - averageCost: The estimated cost per person (e.g., "$25 USD", "Free entry"). If cost information is not readily available, return "N/A".
      Ensure attraction and restaurant names are real and well-known for the destination.
      For each travel tip, provide both the tip itself and a brief, practical explanation or justification. For example, if the tip is 'Learn basic phrases', the explanation might be 'Locals appreciate the effort. Key phrases are "Hello", "Thank you", and "Goodbye" in the local language.'
      Finally, create a 'packingList'. Suggest 5-7 essential items to pack based on the destination, weather, and planned activities. For each item, provide a brief 'reason' explaining why it's recommended.
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
                        startDate: { type: Type.STRING, description: "The start date of the trip in YYYY-MM-DD format." },
                        endDate: { type: Type.STRING, description: "The end date of the trip in YYYY-MM-DD format." },
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
                            description: "A list of practical travel tips, each with a brief explanation.",
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    tip: { type: Type.STRING, description: "A concise travel tip." },
                                    explanation: { type: Type.STRING, description: "A brief explanation or justification for the tip, providing examples or context." }
                                },
                                required: ["tip", "explanation"]
                            }
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
                                                bookingInfo: { type: Type.STRING, description: "Practical booking advice, such as whether tickets need to be booked in advance or if reservations are recommended." },
                                                userReviewsSummary: { type: Type.STRING, description: "A one-sentence summary of user reviews. 'N/A' if not available." },
                                                averageCost: { type: Type.STRING, description: "The estimated cost per person. 'N/A' if not available." },
                                            },
                                            required: ["time", "description", "attractionName", "coordinates", "openingHours", "estimatedDuration", "bookingInfo", "userReviewsSummary", "averageCost"]
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
                        },
                        packingList: {
                            type: Type.ARRAY,
                            description: "A list of suggested items to pack, each with a brief reason.",
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    item: { type: Type.STRING, description: "The name of the packing item (e.g., 'Rain Jacket')." },
                                    reason: { type: Type.STRING, description: "A brief justification for packing the item." }
                                },
                                required: ["item", "reason"]
                            }
                        }
                    },
                    required: ["title", "destination", "duration", "startDate", "endDate", "coordinates", "travelTips", "dailyPlans", "packingList"]
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

export const validateDestination = async (destination: string): Promise<boolean> => {
    const prompt = `Is "${destination}" a real, well-known city, region, or country that a person can travel to? Respond with only "yes" or "no".`;
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                maxOutputTokens: 5,
                temperature: 0,
                thinkingConfig: { thinkingBudget: 0 }
            }
        });

        const resultText = response.text.trim().toLowerCase();
        return resultText.startsWith('yes');
    } catch (error) {
        console.error("Error validating destination:", error);
        // Fail open: assume it's valid if the check fails to avoid blocking users due to API issues.
        return true; 
    }
};

export const getAttractionDetails = async (attractionName: string, destination: string): Promise<{ description: string; sources: Array<{uri: string, title: string}> }> => {
    const prompt = `Provide a concise, one-paragraph summary for the attraction "${attractionName}" located in ${destination}.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                tools: [{googleSearch: {}}],
            },
        });

        const description = response.text;
        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];
        
        const sources = groundingChunks
            .map((chunk: any) => chunk.web)
            .filter((web: any) => web && web.uri && web.title)
            .reduce((acc: any[], current: any) => {
                if (!acc.find(item => item.uri === current.uri)) {
                    acc.push(current);
                }
                return acc;
            }, []);

        return {
            description,
            sources,
        };
    } catch (error) {
        console.error(`Error fetching details for ${attractionName}:`, error);
        throw new Error("Failed to fetch attraction details.");
    }
};

export const generateImageForAttraction = async (attractionName: string, destination: string): Promise<string> => {
    const photoStyles = [
        "golden hour light, cinematic, professional travel photography",
        "wide-angle lens perspective, capturing the expansive view with leading lines",
        "vibrant, saturated colors under a clear blue sky, high contrast",
        "moody atmosphere on a misty morning, cinematic lighting",
        "focusing on intricate architectural details with sharp focus and textured surfaces",
    ];

    const randomStyle = photoStyles[Math.floor(Math.random() * photoStyles.length)];

    const prompt = `Vibrant, photorealistic travel photograph of ${attractionName}, ${destination}. Show the landmark clearly in a beautiful, scenic context. No people in the foreground. Style: ${randomStyle}.`;
    
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