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
     * 401 error for Invalid API keys and 404 for if the location searched is not found
     * @param error
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    protected handleError(error: any): never {
        if (error.response?.status === 401) {
            throw new Error("Invalid API key");
        }
        if (error.response?.status === 404) {
            throw new Error("Location not found");
        }
        throw new Error(error.message || "Weather service error");
    }
}
