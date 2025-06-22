import { LLMServiceFactory } from "@/lib/llm/services";
import { WeatherData } from "@/lib/weather/types/weather.types";
import OpenAI from "openai";

jest.mock("openai", () => {
    return jest.fn().mockImplementation(() => ({
        responses: {
            create: jest.fn().mockResolvedValue({
                output_text:
                    "Take a short walk during the cool breeze to refresh your mind.",
            }),
        },
    }));
});

describe("LLM Integration - Factory + OpenAILLMService", () => {
    const dummyApiKey = "test-api-key";

    const mockWeatherData: WeatherData = {
        location: {
            name: "New York",
            country: "USA",
            lat: 40.7128,
            lon: -74.006,
            localtime: "2025-06-22 23:14",
        },
        current: {
            temperature: 25,
            feelsLike: 27,
            humidity: 70,
            pressure: 1012,
            windSpeed: 12,
            windDirection: "NW",
            visibility: 10,
            uvIndex: 5,
            condition: {
                text: "Clear",
                icon: "sunny.png",
                code: 1000,
            },
        },
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("returns an AI suggestion using service from factory", async () => {
        const service = LLMServiceFactory.create("openai", dummyApiKey);

        const result = await service.getAISuggestion(mockWeatherData);

        expect(result).toEqual({
            suggestion:
                "Take a short walk during the cool breeze to refresh your mind.",
        });

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const openAIInstance = (OpenAI as jest.Mock).mock.results[0].value;
        expect(openAIInstance.responses.create).toHaveBeenCalledWith(
            expect.objectContaining({
                input: expect.stringContaining("New York"),
                model: "gpt-4.1",
            })
        );
    });
});
