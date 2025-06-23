import { BaseWeatherService } from "../interfaces/weather-service.interface";
import {
    WeatherData,
    WeatherForecast,
    WeatherSearchParams,
} from "../types/weather.types";
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

export interface ForecastHourData {
    time_epoch: number;
    time: string;
    temp_c: number;
    temp_f: number;
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
    snow_cm: number;
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
    will_it_rain: number;
    will_it_snow: number;
    is_day: number;
    vis_km: number;
    vis_miles: number;
    chance_of_rain: number;
    chance_of_snow: number;
    gust_mph: number;
    gust_kph: number;
    uv: number; // Optional for the same reason
    air_quality?: {
        co: number;
        no2: number;
        o3: number;
        so2: number;
        pm2_5: number;
        pm10: number;
        us_epa_index: number;
        gb_defra_index: number;
    };
}

interface ForecastAPIResponse {
    forecast: {
        forecastday: Array<{
            date: string;
            date_epoch: number;
            hour: ForecastHourData[];
        }>;
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
     * Fetches and combines current weather data and forecast data based on the provided search parameters.
     */
    async getWeatherData(params: WeatherSearchParams): Promise<WeatherData> {
        const weatherData = await this.getCurrentWeather(params);
        weatherData.forecast = await this.getForecast(params);
        return weatherData;
    }

    /**
     * Gets current weather data for provided parameters
     * @param params WeatherSearchParams
     * @returns WeatherData
     */
    private async getCurrentWeather(
        params: WeatherSearchParams
    ): Promise<WeatherData> {
        try {
            const response = await this.httpClient.get<WeatherAPIResponse>(
                "/current.json",
                {
                    q: params.query,
                    key: this.apiKey,
                }
            );

            return this.transformCurrentResponse(response);
        } catch (error) {
            return this.handleError(error);
        }
    }

    /**
     * Gets weather forecast data for provided parameters
     * @param params WeatherSearchParams
     * @returns WeatherData
     */
    private async getForecast(
        params: WeatherSearchParams
    ): Promise<WeatherForecast> {
        try {
            const response = await this.httpClient.get<ForecastAPIResponse>(
                "/forecast.json",
                {
                    q: params.query,
                    key: this.apiKey,
                }
            );

            return this.transformForecastResponse(response);
        } catch (error) {
            return this.handleError(error);
        }
    }

    /**
     * Transform current weather data received from WeatherAPI service to WeatherData type
     * @param response
     * @returns
     */
    private transformCurrentResponse(
        response: WeatherAPIResponse
    ): WeatherData {
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

    /**
     * Transform forecast weather data received from WeatherAPI service to WeatherForecast type
     */
    private transformForecastResponse(
        response: ForecastAPIResponse
    ): WeatherForecast {
        const forecastDay = response.forecast.forecastday[0];

        return {
            date: forecastDay.date,
            hour: forecastDay.hour.map((hourData) => ({
                time: hourData.time,
                temperature: hourData.temp_c,
                humidity: hourData.humidity,
                feelsLike: hourData.feelslike_c,
                chance_of_rain: hourData.chance_of_rain,
                chance_of_snow: hourData.chance_of_snow,
                condition: {
                    text: hourData.condition.text,
                    icon: hourData.condition.icon,
                    code: hourData.condition.code,
                },
            })),
        };
    }
}
