import { IWeatherService } from "../interfaces/weather-service.interface";
import { WeatherAPIService } from "./weatherapi.service";

export type WeatherProvider = "openweather" | "weatherapi";

/**
 * Based on the Weather provider declared in env this will provide the relevant service class
 */
export class WeatherServiceFactory {
    /**
     *
     * @param provider weather data provider declared in env
     * @param apiKey API key for the relevant provider
     * @returns relevant IWeatherService implementation
     */
    static create(provider: WeatherProvider, apiKey: string): IWeatherService {
        switch (provider) {
            case "weatherapi":
                return new WeatherAPIService(apiKey);
            default:
                throw new Error(`Unsupported weather provider: ${provider}`);
        }
    }
}
