
# AI Travel Planner

Welcome to the AI Travel Planner, an intelligent and interactive application designed to create personalized travel itineraries in seconds. By leveraging the power of Google's Gemini AI, this tool crafts detailed, day-by-day vacation plans complete with activities, an interactive map, and beautiful AI-generated images of attractions.

![AI Travel Planner Screenshot](https://storage.googleapis.com/aistudio-ux-team/samples/apps/trip-planner.png)

## ✨ Features

- **🤖 AI-Powered Itinerary Generation**: Get a complete, customized travel plan based on your unique preferences.
- **📝 Customizable Preferences**: Input your destination, budget, travel dates, and specific interests (like "Food", "History", or "Adventure") to tailor your trip.
- **🗺️ Interactive Map View**: Visualize your entire trip with all attractions pinned on an interactive map, powered by Leaflet.
- **🖼️ AI-Generated Imagery**: For key attractions in your itinerary, the app generates stunning, photorealistic images using the Imagen model.
- **📅 Detailed Daily Plans**: Each day includes a creative theme, 2-3 specific activities with suggested times, local food recommendations, and a weather forecast.
- **ℹ️ Rich Activity Details**: Click on any activity to expand and view crucial information like opening hours, estimated duration, and booking advice.
- **🌓 Light & Dark Modes**: A sleek, modern UI that's easy on the eyes, with full support for both light and dark themes.
- **📱 Fully Responsive**: Enjoy a seamless experience whether you're planning on a desktop or a mobile device.
- **🔗 Shareable Content**: Easily share a text summary of your itinerary with friends and family via the Web Share API or by copying it to the clipboard.

## 🛠️ Tech Stack

This project is built with a modern, performant, and scalable technology stack:

-   **Frontend**: [React](https://react.dev/) & [TypeScript](https://www.typescriptlang.org/)
-   **AI Model**: [Google Gemini API](https://ai.google.dev/) (`@google/genai`) for itinerary generation and [Imagen](https://deepmind.google/technologies/imagen/) for image generation.
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) for a utility-first, responsive design system.
-   **Mapping**: [Leaflet](https://leafletjs.com/) for the interactive map display.

## 🚀 How It Works

The application follows a simple yet powerful workflow:

1.  **User Input**: The user fills out the `TravelForm` with their destination, budget, dates, and interests.
2.  **API Request**: The application constructs a detailed prompt from the user's preferences and sends it to the Gemini API, requesting a response in a specific JSON schema.
3.  **AI Processing**: The Gemini `gemini-2.5-flash` model processes the prompt and generates a comprehensive itinerary, which is returned as a structured JSON object.
4.  **Data Rendering**: The React frontend parses the JSON data and dynamically renders the `ItineraryDisplay` component.
5.  **Image Generation**: As the itinerary is displayed, the app makes parallel calls to the `imagen-4.0-generate-001` model to generate images for the main attraction of each day.
6.  **Interactive Display**: The final result is a rich, interactive interface where users can explore their daily plans, view attractions on a map, and see AI-generated visuals of their destination.

## 📂 Project Structure

The codebase is organized into logical, reusable components and services:

```
/
├── public/
│   └── index.html        # Main HTML entry point
├── src/
│   ├── components/       # Reusable React components
│   │   ├── App.tsx
│   │   ├── GeneratedImage.tsx
│   │   ├── Header.tsx
│   │   ├── ItineraryDisplay.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── MapView.tsx
│   │   └── TravelForm.tsx
│   ├── services/
│   │   └── geminiService.ts # Logic for interacting with the Gemini API
│   ├── types.ts          # TypeScript type definitions and constants
│   └── index.tsx         # React application entry point
├── README.md             # This file
└── metadata.json         # Application metadata
```

## ⚙️ Getting Started

To run this project locally, you will need to have Node.js and npm installed.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/ai-travel-planner.git
    cd ai-travel-planner
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of your project and add your Google Gemini API key:
    ```
    API_KEY="YOUR_GEMINI_API_KEY"
    ```

4.  **Run the development server:**
    ```bash
    npm run start
    ```
    The application will be available at `http://localhost:3000`.

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.
