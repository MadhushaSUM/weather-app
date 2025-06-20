export interface WeatherData {
    location: {
        name: string;
        country: string;
        lat: number;
        lon: number;
    };
    current: {
        temperature: number;
        feelsLike: number;
        humidity: number;
        pressure: number;
        windSpeed: number;
        windDirection: string;
        visibility: number;
        uvIndex: number;
        condition: {
            text: string;
            icon: string;
            code: number;
        };
    };
    forecast?: WeatherForecast[];
}

export interface WeatherForecast {
    date: string;
    maxTemp: number;
    minTemp: number;
    condition: {
        text: string;
        icon: string;
        code: number;
    };
    chanceOfRain: number;
}

export interface WeatherSearchParams {
    query: string;
}
