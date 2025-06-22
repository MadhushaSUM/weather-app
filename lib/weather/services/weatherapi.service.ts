import { BaseWeatherService } from "../interfaces/weather-service.interface";
import { WeatherData, WeatherSearchParams } from "../types/weather.types";
import { HttpClient } from "../../http/http-client";

interface WeatherAPIResponse {
    location: {
        name: string;
        region: string;
        country: string;
        lat: number;
        lon: number;
        tz_id: string;
        localtime_epoch: number;
        localtime: string;
    };
    current: {
        last_updated_epoch: number;
        last_updated: string;
        temp_c: number;
        temp_f: number;
        is_day: number;
        condition: {
            text: string;
            icon: string;
            code: number;
        };
        wind_mph: number;
        wind_kph: number;
        wind_degree: number;
        wind_dir: string;
        pressure_mb: number;
        pressure_in: number;
        precip_mm: number;
        precip_in: number;
        humidity: number;
        cloud: number;
        feelslike_c: number;
        feelslike_f: number;
        windchill_c: number;
        windchill_f: number;
        heatindex_c: number;
        heatindex_f: number;
        dewpoint_c: number;
        dewpoint_f: number;
        vis_km: number;
        vis_miles: number;
        uv: number;
        gust_mph: number;
        gust_kph: number;
    };
}

/**
 * Implementation for WeatherAPI service provider.
 */
export class WeatherAPIService extends BaseWeatherService {
    protected apiKey: string;
    protected baseUrl: string;
    private httpClient: HttpClient;

    /**
     * Creates a WeatherAPI service
     * @param apiKey WeatherAPI API key
     */
    constructor(apiKey: string) {
        super();
        this.apiKey = apiKey;
        this.baseUrl = "http://api.weatherapi.com/v1";
        this.httpClient = new HttpClient(this.baseUrl);
    }

    /**
     * Gets current weather data for provided parameters
     * @param params WeatherSearchParams
     * @returns WeatherData
     */
    async getCurrentWeather(params: WeatherSearchParams): Promise<WeatherData> {
        try {
            const response = await this.httpClient.get<WeatherAPIResponse>(
                "/current.json",
                {
                    q: params.query,
                    key: this.apiKey,
                }
            );

            return this.transformResponse(response);
        } catch (error) {
            return this.handleError(error);
        }
    }

    /**
     * Transform data received from WeatherAPI service to WeatherData type
     * @param response
     * @returns
     */
    private transformResponse(response: WeatherAPIResponse): WeatherData {
        return {
            location: {
                name: response.location.name,
                country: response.location.country,
                lat: response.location.lat,
                lon: response.location.lon,
                localtime: response.location.localtime,
            },
            current: {
                temperature: Math.round(response.current.temp_c),
                feelsLike: Math.round(response.current.feelslike_c),
                humidity: response.current.humidity,
                pressure: response.current.pressure_in,
                windSpeed: response.current.wind_kph,
                windDirection: response.current.wind_dir,
                visibility: response.current.vis_km,
                uvIndex: response.current.uv,
                condition: {
                    text: response.current.condition.text,
                    icon: response.current.condition.icon,
                    code: response.current.condition.code,
                },
            },
        };
    }
}
