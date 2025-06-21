import { BaseLLMService } from "@/lib/llm/interfaces/llm-service.interface";
import OpenAI from "openai";
import { WeatherData } from "@/lib/weather/types/weather.types";
import { AiResponse } from "@/lib/llm/types/llm.types";

/**
 * OpenAILLMService is a service class that interacts with OpenAI APIs to fetch AI-generated suggestions
 * based on the provided weather data. extends BaseLLMService.
 */
export class OpenAILLMService extends BaseLLMService {
    protected apiKey: string;
    protected client: OpenAI;

    /**
     * Constructor for creating an instance of the class with the specified API key.
     * @param apiKey - The API key used for authentication with the OpenAI client.
     */
    constructor(apiKey: string) {
        super();
        this.apiKey = apiKey;
        this.client = new OpenAI({
            apiKey: apiKey,
        });
    }

    /**
     * Generates a productivity suggestion or tip based on the given weather data.
     *
     * @param {WeatherData} params - The weather-related data used to determine the suggestion.
     * @returns {Promise<AiResponse>} A promise that resolves to an object containing the AI-generated suggestion.
     */
    async getAISuggestion(params: WeatherData): Promise<AiResponse> {
        try {
            const response = await this.client.responses.create({
                model: "gpt-4.1",
                instructions:
                    "You are a friendly, supportive partner who helps people to get motivated and be productive by giving tips by looking at weather data. But keep your suggestions short",
                input: `${JSON.stringify(params, null, 2)} for a this type of weather give me a tip or a suggestion to improve my productivity`,
            });

            return {
                suggestion: response.output_text,
            };
        } catch (error) {
            throw error;
        }
    }
}
