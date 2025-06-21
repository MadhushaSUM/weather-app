import { OpenAILLMService } from "@/lib/llm/services/openai.service";
import { WeatherData } from "@/lib/weather/types/weather.types";

jest.mock("openai", () => {
    return jest.fn().mockImplementation(() => ({
        responses: {
            create: jest.fn(),
        },
    }));
});

import OpenAI from "openai";

describe("OpenAILLMService", () => {
    const mockCreate = jest.fn();
    const dummyApiKey = "test-api-key";
    const mockWeatherData: WeatherData = {
        location: {
            name: "London",
            country: "UK",
            lat: 51.5074,
            lon: -0.1278,
        },
        current: {
            temperature: 22,
            feelsLike: 24,
            humidity: 65,
            pressure: 1012,
            windSpeed: 5.5,
            windDirection: "SW",
            visibility: 10,
            uvIndex: 4,
            condition: {
                text: "Partly cloudy",
                icon: "cloudy.png",
                code: 1003,
            },
        },
    };

    beforeEach(() => {
        jest.clearAllMocks();
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        (OpenAI as jest.Mock).mockImplementation(() => ({
            responses: {
                create: mockCreate,
            },
        }));
    });

    it("returns suggestion from OpenAI response", async () => {
        const suggestionText = "Go for a walk as it's sunny outside!";
        mockCreate.mockResolvedValueOnce({
            output_text: suggestionText,
        });

        const service = new OpenAILLMService(dummyApiKey);
        const result = await service.getAISuggestion(mockWeatherData);

        expect(OpenAI).toHaveBeenCalledWith({ apiKey: dummyApiKey });
        expect(mockCreate).toHaveBeenCalledWith(
            expect.objectContaining({
                model: "gpt-4.1",
                input: expect.stringContaining("London"),
            })
        );
        expect(result).toEqual({ suggestion: suggestionText });
    });

    it("throws an error if OpenAI API fails", async () => {
        const service = new OpenAILLMService(dummyApiKey);
        const error = new Error("API failure");
        mockCreate.mockRejectedValueOnce(error);

        await expect(service.getAISuggestion(mockWeatherData)).rejects.toThrow(
            "API failure"
        );
    });
});
