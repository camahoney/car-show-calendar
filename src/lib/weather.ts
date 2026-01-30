import { cache } from "react";

const API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";

export interface WeatherData {
    current: {
        temp: number;
        weather: { main: string; description: string; icon: string }[];
        humidity: number;
        wind_speed: number;
    };
    daily: {
        dt: number;
        temp: { day: number; min: number; max: number };
        weather: { main: string; description: string; icon: string }[];
        pop: number; // Probability of precipitation
    }[];
}

// Cache the weather fetch for 1 hour to save API calls
export const getWeather = cache(async (lat: number, lon: number): Promise<WeatherData | null> => {
    if (!API_KEY) {
        console.warn("OPENWEATHER_API_KEY is missing");
        return null;
    }

    try {
        // Using One Call API 3.0 (or 2.5 if 3.0 not enabled, usually requires subscription)
        // Fallback to 5-day forecast if One Call fails or for simpler tiers
        // For this implementation, we'll try the standard 'forecast' and 'weather' endpoints 
        // effectively simulating "daily" for the purpose of the badge to avoid One Call paid tier issues if user is on free.
        // Actually, Free tier often gives 5 day / 3 hour forecast.

        const res = await fetch(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${API_KEY}`, {
            next: { revalidate: 3600 } // Revalidate every hour
        });

        if (!res.ok) {
            throw new Error("Failed to fetch weather data");
        }

        const data = await res.json();

        // Transform 5-day/3-hour forecast into a simpler daily structure
        // This is an approximation since the free tier doesn't give daily summaries directly
        const dailyMap = new Map();

        data.list.forEach((item: any) => {
            const date = new Date(item.dt * 1000).toDateString();
            if (!dailyMap.has(date)) {
                dailyMap.set(date, {
                    dt: item.dt,
                    temp: { day: item.main.temp, min: item.main.temp_min, max: item.main.temp_max },
                    weather: item.weather,
                    pop: item.pop
                });
            } else {
                // Update min/max
                const existing = dailyMap.get(date);
                existing.temp.min = Math.min(existing.temp.min, item.main.temp_min);
                existing.temp.max = Math.max(existing.temp.max, item.main.temp_max);
                // Take the weather icon from mid-day (approx) or worst case? Let's take the first one for now.
            }
        });

        return {
            current: {
                temp: data.list[0].main.temp,
                weather: data.list[0].weather,
                humidity: data.list[0].main.humidity,
                wind_speed: data.list[0].wind.speed
            },
            daily: Array.from(dailyMap.values())
        };

    } catch (error) {
        console.error("Weather fetch error:", error);
        return null;
    }
});

export function isPerfectWeather(temp: number, weatherMain: string): boolean {
    // "Perfect" = 65-85F and Clear/Clouds (no Rain/Snow)
    return temp >= 60 && temp <= 85 && !["Rain", "Snow", "Thunderstorm", "Drizzle"].includes(weatherMain);
}
