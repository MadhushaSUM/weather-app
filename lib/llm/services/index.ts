import { ILLMService } from "@/lib/llm/interfaces/llm-service.interface";
import { OpenAILLMService } from "@/lib/llm/services/openai.service";

export type LLMProvider = "openai" | "gemini";

/**
 * Factory class for creating instances of LLM services based on the specified provider.
 */
export class LLMServiceFactory {
    /**
     * Creates an instance of a large language model (LLM) service based on the specified provider.
     *
     * @param provider - The LLM provider that will be used (e.g., "openai").
     * @param apiKey - The API key used for authenticating with the selected provider.
     * @return relevant ILLMService provider
     */
    static create(provider: LLMProvider, apiKey: string): ILLMService {
        switch (provider) {
            case "openai":
                return new OpenAILLMService(apiKey);
            default:
                throw new Error(`Unsupported weather provider: ${provider}`);
        }
    }
}
