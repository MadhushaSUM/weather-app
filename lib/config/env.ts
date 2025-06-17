import { WeatherProvider } from "../weather/services";

export const env = {
    WEATHER_API_KEY: process.env.WEATHER_API_KEY || "",
    WEATHER_PROVIDER:
        (process.env.WEATHER_PROVIDER as WeatherProvider) || "weatherapi",
    NODE_ENV: process.env.NODE_ENV || "development",
} as const;

/**
 * Ensure env variavbles have WEATHER_API_KEY. Otherwise this validatin will fail
 */
export function validateEnv() {
    if (!env.WEATHER_API_KEY) {
        throw new Error("WEATHER_API_KEY environment variable is required");
    }
}
