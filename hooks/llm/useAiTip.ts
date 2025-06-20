import { WeatherData } from "@/lib/weather/types/weather.types";
import { AiResponse } from "@/lib/llm/types/llm.types";
import { useQuery } from "@tanstack/react-query";

/**
 * Sends a POST request to the LLM API with weather data to fetch AI-generated tips.
 * @param {WeatherData} params - The weather data used as input for the AI model. should contain relevant weather info.
 * @return {Promise<AiResponse>} A promise that resolves to the AI-generated response encapsulated in an `AiResponse` object.
 * @throws {Error} If the request fails, the function will throw an error containing the response details.
 */
async function fetchAiTip(params: WeatherData): Promise<AiResponse> {
    const response = await fetch("/api/llm", {
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
 * Fetches AI-generated weather tips based on the provided weather data.
 * @param {WeatherData|null} params - The weather data used to generate AI-based tips.
 * Pass `null` to disable the query.
 * @return {object} A `useQuery` object containing the query status, data, error,
 * and other metadata for the request.
 */
export function useAiTip(params: WeatherData | null) {
    return useQuery({
        queryKey: ["weather", params],
        /**
         * Declare fetchWeather function as hook's queryFn
         */
        queryFn: () => fetchAiTip(params!),
        enabled: !!params,
        staleTime: 5 * 60 * 1000,
        retry: 2,
        /**
         * Calculates a delay duration in milliseconds based on the retry attempt index.
         * The delay increases exponentially with each attempt but is capped at a maximum value.
         */
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    });
}