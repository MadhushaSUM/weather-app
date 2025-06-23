export interface WeatherData {
    location: {
        name: string;
        country: string;
        lat: number;
        lon: number;
        localtime: string;
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
    forecast?: WeatherForecast;
}

export interface WeatherForecast {
    date: string;
    hour: {
        time: string;
        temperature: number;
        humidity: number;
        feelsLike: number;
        chance_of_rain: number;
        chance_of_snow: number;
        condition: {
            text: string;
            icon: string;
            code: number;
        };
    }[];
}

export interface WeatherSearchParams {
    query: string;
}
