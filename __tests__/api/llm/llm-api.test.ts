jest.mock("next/server", () => ({
    NextRequest: jest.fn(),
    NextResponse: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        json: jest.fn((data: any, init?: ResponseInit) => ({
            /**
             * Asynchronously returns the value of `data` in JSON format.
             */
            json: async () => data,
            status: init?.status || 200,
            ok: (init?.status || 200) >= 200 && (init?.status || 200) < 300,
        })),
    },
}));

jest.mock("@/lib/llm/services");
jest.mock("@/lib/config/env");

import { LLMServiceFactory } from "@/lib/llm/services";
import { env } from "@/lib/config/env";
import { WeatherData } from "@/lib/weather/types/weather.types";

const mockLLMServiceFactory = LLMServiceFactory as jest.Mocked<
    typeof LLMServiceFactory
>;

const mockLLMService = {
    getAISuggestion: jest.fn(),
};

const originalConsoleError = console.error;
beforeAll(() => {
    console.error = jest.fn();
});

afterAll(() => {
    console.error = originalConsoleError;
});

beforeEach(() => {
    jest.clearAllMocks();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockLLMServiceFactory.create.mockReturnValue(mockLLMService as any);
});

/**
 * Creates a mock HTTP request object.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createMockRequest = (body: any) => {
    return {
        json: jest.fn().mockResolvedValue(body),
        headers: new Map(),
        method: "POST",
        url: "http://localhost:3000/api/ai-suggestion",
    };
};

// Sample weather data for testing
const mockWeatherData: WeatherData = {
    location: {
        name: "London",
        country: "United Kingdom",
        lat: 51.52,
        lon: -0.11,
        localtime: "2025-06-22 23:14",
    },
    current: {
        temperature: 59.0,
        condition: {
            text: "Partly cloudy",
            icon: "//cdn.weatherapi.com/weather/64x64/day/116.png",
            code: 1003,
        },
        windSpeed: 6.9,
        windDirection: "SW",
        pressure: 1015.0,
        humidity: 82,
        feelsLike: 15.0,
        visibility: 10.0,
        uvIndex: 1.0,
    },
    forecast: {
        date: "2025-06-23",
        hour: [
            {
                time: "2025-06-23 00:00",
                temperature: 25.8,
                humidity: 90,
                feelsLike: 29.1,
                chance_of_rain: 100,
                chance_of_snow: 0,
                condition: {
                    text: "Light rain shower",
                    icon: "//cdn.weatherapi.com/weather/64x64/night/353.png",
                    code: 1240,
                },
            },
            {
                time: "2025-06-23 01:00",
                temperature: 25.7,
                humidity: 90,
                feelsLike: 28.9,
                chance_of_rain: 100,
                chance_of_snow: 0,
                condition: {
                    text: "Light rain shower",
                    icon: "//cdn.weatherapi.com/weather/64x64/night/353.png",
                    code: 1240,
                },
            },
            {
                time: "2025-06-23 02:00",
                temperature: 25.7,
                humidity: 90,
                feelsLike: 28.9,
                chance_of_rain: 100,
                chance_of_snow: 0,
                condition: {
                    text: "Light rain shower",
                    icon: "//cdn.weatherapi.com/weather/64x64/night/353.png",
                    code: 1240,
                },
            },
            {
                time: "2025-06-23 03:00",
                temperature: 25.7,
                humidity: 89,
                feelsLike: 28.9,
                chance_of_rain: 100,
                chance_of_snow: 0,
                condition: {
                    text: "Light rain shower",
                    icon: "//cdn.weatherapi.com/weather/64x64/night/353.png",
                    code: 1240,
                },
            },
            {
                time: "2025-06-23 04:00",
                temperature: 25.6,
                humidity: 90,
                feelsLike: 28.8,
                chance_of_rain: 100,
                chance_of_snow: 0,
                condition: {
                    text: "Light rain shower",
                    icon: "//cdn.weatherapi.com/weather/64x64/night/353.png",
                    code: 1240,
                },
            },
            {
                time: "2025-06-23 05:00",
                temperature: 25.7,
                humidity: 89,
                feelsLike: 28.9,
                chance_of_rain: 100,
                chance_of_snow: 0,
                condition: {
                    text: "Light rain shower",
                    icon: "//cdn.weatherapi.com/weather/64x64/night/353.png",
                    code: 1240,
                },
            },
            {
                time: "2025-06-23 06:00",
                temperature: 25.8,
                humidity: 89,
                feelsLike: 29.1,
                chance_of_rain: 84,
                chance_of_snow: 0,
                condition: {
                    text: "Patchy rain nearby",
                    icon: "//cdn.weatherapi.com/weather/64x64/day/176.png",
                    code: 1063,
                },
            },
            {
                time: "2025-06-23 07:00",
                temperature: 26.2,
                humidity: 88,
                feelsLike: 29.7,
                chance_of_rain: 100,
                chance_of_snow: 0,
                condition: {
                    text: "Patchy light drizzle",
                    icon: "//cdn.weatherapi.com/weather/64x64/day/263.png",
                    code: 1150,
                },
            },
            {
                time: "2025-06-23 08:00",
                temperature: 27,
                humidity: 85,
                feelsLike: 30.9,
                chance_of_rain: 100,
                chance_of_snow: 0,
                condition: {
                    text: "Light rain shower",
                    icon: "//cdn.weatherapi.com/weather/64x64/day/353.png",
                    code: 1240,
                },
            },
            {
                time: "2025-06-23 09:00",
                temperature: 27.3,
                humidity: 84,
                feelsLike: 31.4,
                chance_of_rain: 100,
                chance_of_snow: 0,
                condition: {
                    text: "Patchy light rain",
                    icon: "//cdn.weatherapi.com/weather/64x64/day/293.png",
                    code: 1180,
                },
            },
            {
                time: "2025-06-23 10:00",
                temperature: 27.6,
                humidity: 82,
                feelsLike: 31.9,
                chance_of_rain: 100,
                chance_of_snow: 0,
                condition: {
                    text: "Light rain shower",
                    icon: "//cdn.weatherapi.com/weather/64x64/day/353.png",
                    code: 1240,
                },
            },
            {
                time: "2025-06-23 11:00",
                temperature: 27.6,
                humidity: 82,
                feelsLike: 31.8,
                chance_of_rain: 100,
                chance_of_snow: 0,
                condition: {
                    text: "Patchy light drizzle",
                    icon: "//cdn.weatherapi.com/weather/64x64/day/263.png",
                    code: 1150,
                },
            },
            {
                time: "2025-06-23 12:00",
                temperature: 27.6,
                humidity: 81,
                feelsLike: 31.8,
                chance_of_rain: 100,
                chance_of_snow: 0,
                condition: {
                    text: "Patchy rain nearby",
                    icon: "//cdn.weatherapi.com/weather/64x64/day/176.png",
                    code: 1063,
                },
            },
            {
                time: "2025-06-23 13:00",
                temperature: 30,
                humidity: 84,
                feelsLike: 31.7,
                chance_of_rain: 100,
                chance_of_snow: 0,
                condition: {
                    text: "Partly cloudy",
                    icon: "//cdn.weatherapi.com/weather/64x64/day/116.png",
                    code: 1003,
                },
            },
            {
                time: "2025-06-23 14:00",
                temperature: 27.4,
                humidity: 83,
                feelsLike: 31.4,
                chance_of_rain: 100,
                chance_of_snow: 0,
                condition: {
                    text: "Light rain shower",
                    icon: "//cdn.weatherapi.com/weather/64x64/day/353.png",
                    code: 1240,
                },
            },
            {
                time: "2025-06-23 15:00",
                temperature: 27.2,
                humidity: 83,
                feelsLike: 31.1,
                chance_of_rain: 100,
                chance_of_snow: 0,
                condition: {
                    text: "Light rain shower",
                    icon: "//cdn.weatherapi.com/weather/64x64/day/353.png",
                    code: 1240,
                },
            },
            {
                time: "2025-06-23 16:00",
                temperature: 26.8,
                humidity: 85,
                feelsLike: 30.5,
                chance_of_rain: 100,
                chance_of_snow: 0,
                condition: {
                    text: "Light rain shower",
                    icon: "//cdn.weatherapi.com/weather/64x64/day/353.png",
                    code: 1240,
                },
            },
            {
                time: "2025-06-23 17:00",
                temperature: 26.7,
                humidity: 86,
                feelsLike: 30.4,
                chance_of_rain: 61,
                chance_of_snow: 0,
                condition: {
                    text: "Patchy rain nearby",
                    icon: "//cdn.weatherapi.com/weather/64x64/day/176.png",
                    code: 1063,
                },
            },
            {
                time: "2025-06-23 18:00",
                temperature: 26.4,
                humidity: 88,
                feelsLike: 30,
                chance_of_rain: 100,
                chance_of_snow: 0,
                condition: {
                    text: "Patchy rain nearby",
                    icon: "//cdn.weatherapi.com/weather/64x64/night/176.png",
                    code: 1063,
                },
            },
            {
                time: "2025-06-23 19:00",
                temperature: 26.3,
                humidity: 88,
                feelsLike: 29.9,
                chance_of_rain: 0,
                chance_of_snow: 0,
                condition: {
                    text: "Partly Cloudy ",
                    icon: "//cdn.weatherapi.com/weather/64x64/night/116.png",
                    code: 1003,
                },
            },
            {
                time: "2025-06-23 20:00",
                temperature: 26.2,
                humidity: 89,
                feelsLike: 29.7,
                chance_of_rain: 100,
                chance_of_snow: 0,
                condition: {
                    text: "Light rain shower",
                    icon: "//cdn.weatherapi.com/weather/64x64/night/353.png",
                    code: 1240,
                },
            },
            {
                time: "2025-06-23 21:00",
                temperature: 26,
                humidity: 89,
                feelsLike: 29.4,
                chance_of_rain: 75,
                chance_of_snow: 0,
                condition: {
                    text: "Patchy rain nearby",
                    icon: "//cdn.weatherapi.com/weather/64x64/night/176.png",
                    code: 1063,
                },
            },
            {
                time: "2025-06-23 22:00",
                temperature: 25.9,
                humidity: 90,
                feelsLike: 29.3,
                chance_of_rain: 100,
                chance_of_snow: 0,
                condition: {
                    text: "Light rain shower",
                    icon: "//cdn.weatherapi.com/weather/64x64/night/353.png",
                    code: 1240,
                },
            },
            {
                time: "2025-06-23 23:00",
                temperature: 25.7,
                humidity: 90,
                feelsLike: 28.9,
                chance_of_rain: 100,
                chance_of_snow: 0,
                condition: {
                    text: "Light rain shower",
                    icon: "//cdn.weatherapi.com/weather/64x64/night/353.png",
                    code: 1240,
                },
            },
        ],
    },
};

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { POST } = require("@/app/api/llm/route");

describe("/api/ai-suggestion POST", () => {
    describe("Successful requests", () => {
        it("should return AI suggestion for valid weather data", async () => {
            const mockAIResponse = {
                suggestion:
                    "It's a pleasant day with partly cloudy skies. Perfect for a walk in the park or outdoor activities. Consider bringing a light jacket as it might get cooler.",
            };

            const mockRequest = createMockRequest(mockWeatherData);

            mockLLMService.getAISuggestion.mockResolvedValue(mockAIResponse);

            const response = await POST(mockRequest);
            const responseData = await response.json();

            expect(response.status).toBe(200);
            expect(responseData).toEqual(mockAIResponse);
            expect(mockLLMServiceFactory.create).toHaveBeenCalledWith(
                env.LLM_PROVIDER,
                env.LLM_API_KEY
            );
            expect(mockLLMService.getAISuggestion).toHaveBeenCalledWith(
                mockWeatherData
            );
        });
    });

    describe("Validation errors", () => {
        it("should return 400 when weather data is missing", async () => {
            const mockRequest = createMockRequest(null);

            const response = await POST(mockRequest);
            const responseData = await response.json();

            expect(response.status).toBe(400);
            expect(responseData).toEqual({
                error: "Weather data is required",
            });
            expect(mockLLMServiceFactory.create).not.toHaveBeenCalled();
            expect(mockLLMService.getAISuggestion).not.toHaveBeenCalled();
        });

        it("should return 400 when weather data is undefined", async () => {
            const mockRequest = createMockRequest(undefined);

            const response = await POST(mockRequest);
            const responseData = await response.json();

            expect(response.status).toBe(400);
            expect(responseData).toEqual({
                error: "Weather data is required",
            });
        });
    });

    describe("LLM service factory errors", () => {
        it("should return 500 when LLMServiceFactory.create throws an error", async () => {
            const mockRequest = createMockRequest(mockWeatherData);

            mockLLMServiceFactory.create.mockImplementation(() => {
                throw new Error("Invalid LLM provider");
            });

            const response = await POST(mockRequest);
            const responseData = await response.json();

            expect(response.status).toBe(500);
            expect(responseData).toEqual({
                error: "Invalid LLM provider",
            });
            expect(mockLLMService.getAISuggestion).not.toHaveBeenCalled();
        });

        it("should return 500 when LLM API key is missing", async () => {
            const mockRequest = createMockRequest(mockWeatherData);

            mockLLMServiceFactory.create.mockImplementation(() => {
                throw new Error("LLM_API_KEY environment variable is required");
            });

            const response = await POST(mockRequest);
            const responseData = await response.json();

            expect(response.status).toBe(500);
            expect(responseData).toEqual({
                error: "LLM_API_KEY environment variable is required",
            });
        });
    });

    describe("Integration scenarios", () => {
        it("should use correct environment variables for LLM service creation", async () => {
            const mockRequest = createMockRequest(mockWeatherData);
            const mockAIResponse = { suggestion: "Test suggestion" };

            mockLLMService.getAISuggestion.mockResolvedValue(mockAIResponse);

            await POST(mockRequest);

            expect(mockLLMServiceFactory.create).toHaveBeenCalledWith(
                env.LLM_PROVIDER,
                env.LLM_API_KEY
            );
        });
    });
});
