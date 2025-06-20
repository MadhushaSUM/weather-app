import { useQuery } from "@tanstack/react-query";
import {
    WeatherData,
    WeatherSearchParams,
} from "@/lib/weather/types/weather.types";

/**
 * Fetches weather data from the specified API endpoint based on the provided parameters.
 * @param {WeatherSearchParams} params - An object containing the search parameters for the weather query, such as location or coordinates.
 * @return {Promise<WeatherData>} A promise that resolves to the weather data object returned from the API.
 * @throws {Error} Throws an error if the API response is not successful.
 */
async function fetchWeather(params: WeatherSearchParams): Promise<WeatherData> {
    const response = await fetch("/api/weather", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
            errorData.error || `HTTP error! status: ${response.status}`
        );
    }

    return response.json();
}

/**
 * A custom hook to fetch weather data using provided search parameters.
 * @param {WeatherSearchParams|null} params - An object containing parameters for the weather search query. If null, the query will not execute.
 * @return {object} - Returns the query object with data, error, isLoading, and other query-related properties.
 */
export function useCurrentWeather(params: WeatherSearchParams | null) {
    return useQuery({
        queryKey: ["weather", params?.query],
        /**
         * Declare fetchWeather function as hook's queryFn
         */
        queryFn: () => fetchWeather(params!),
        enabled: !!params?.query,
        staleTime: 5 * 60 * 1000,
        retry: 2,
        /**
         * Calculates a delay duration in milliseconds based on the retry attempt index.
         * The delay increases exponentially with each attempt but is capped at a maximum value.
         */
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    });
}
