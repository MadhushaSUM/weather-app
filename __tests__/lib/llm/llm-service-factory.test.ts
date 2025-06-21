import { LLMProvider, LLMServiceFactory } from "@/lib/llm/services";
import { OpenAILLMService } from "@/lib/llm/services/openai.service";

jest.mock("@/lib/llm/services/openai.service", () => ({
    OpenAILLMService: jest.fn().mockImplementation(() => ({
        getAISuggestion: jest.fn(),
    })),
}));

describe("LLMServiceFactory", () => {
    const dummyApiKey = "test-api-key";

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('returns a OpenAILLMService when provider is "openai"', () => {
        LLMServiceFactory.create("openai", dummyApiKey);
        expect(OpenAILLMService).toHaveBeenCalledWith(dummyApiKey);
    });

    it("throws an error for unsupported provider", () => {
        expect(() =>
            LLMServiceFactory.create("deepseek" as LLMProvider, dummyApiKey)
        ).toThrow("Unsupported llm provider: deepseek");
    });
});
