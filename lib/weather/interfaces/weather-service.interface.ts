import { WeatherData, WeatherSearchParams } from "../types/weather.types";

export interface IWeatherService {
    getCurrentWeather(params: WeatherSearchParams): Promise<WeatherData>;
}

/**
 * Base weather service. Implement this class to use different weather data providers
 */
export abstract class BaseWeatherService implements IWeatherService {
    protected abstract apiKey: string;
    protected abstract baseUrl: string;

    abstract getCurrentWeather(
        params: WeatherSearchParams
    ): Promise<WeatherData>;

    /**
     * 401 error for Invalid API keys and 400 for if the location searched is not found
     * @param error
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    protected handleError(error: any): never {
        if (error.message.includes("HTTP Error: 400")) {
            throw new Error("Location not found");
        }
        if (error.message.includes("HTTP Error: 401")) {
            throw new Error("Invalid API key");
        }
        if (error.message.includes("HTTP Error: 502")) {
            throw new Error("Service unavailable. Try again later");
        }
        throw new Error(error.message || "Weather service error");
    }
}
