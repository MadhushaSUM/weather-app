import { AiResponse } from "@/lib/llm/types/llm.types";
import { WeatherData } from "@/lib/weather/types/weather.types";

export interface ILLMService {
    getAISuggestion(query: WeatherData): Promise<AiResponse>;
}

/**
 * Abstract base class representing a service to interact with an LLM (Language Learning Model) API.
 */
export abstract class BaseLLMService implements ILLMService {
    protected abstract apiKey: string;

    abstract getAISuggestion(params: WeatherData): Promise<AiResponse>;
}
