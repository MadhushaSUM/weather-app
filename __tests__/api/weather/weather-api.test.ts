jest.mock("next/server", () => ({
    NextRequest: jest.fn(),
    NextResponse: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        json: jest.fn((data: any, init?: ResponseInit) => ({
            /**
             * Asynchronously retrieves and returns JSON data.
             */
            json: async () => data,
            status: init?.status || 200,
            ok: (init?.status || 200) >= 200 && (init?.status || 200) < 300,
        })),
    },
}));

jest.mock("@/lib/weather/services");
jest.mock("@/lib/config/env");

import { WeatherServiceFactory } from "@/lib/weather/services";
import { validateEnv } from "@/lib/config/env";

const mockWeatherServiceFactory = WeatherServiceFactory as jest.Mocked<
    typeof WeatherServiceFactory
>;
const mockValidateEnv = validateEnv as jest.MockedFunction<typeof validateEnv>;

const mockWeatherService = {
    getWeatherData: jest.fn(),
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
    mockWeatherServiceFactory.create.mockReturnValue(mockWeatherService as any);
});

/**
 * Creates a mock HTTP request object for testing purposes.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createMockRequest = (body: any) => {
    return {
        json: jest.fn().mockResolvedValue(body),
        headers: new Map(),
        method: "POST",
        url: "http://localhost:3000/api/weather",
    };
};

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { POST } = require("@/app/api/weather/route");

describe("/api/weather POST", () => {
    describe("Successful requests", () => {
        it("should return weather data with forecast for valid query", async () => {
            const mockWeatherData = {
                location: {
                    name: "London",
                    country: "United Kingdom",
                    lat: 51.52,
                    lon: -0.11,
                    localtime: "2025-06-23 14:30",
                },
                current: {
                    temperature: 20,
                    feelsLike: 18,
                    condition: {
                        text: "Partly cloudy",
                        icon: "//cdn.weatherapi.com/weather/64x64/day/116.png",
                        code: 1003,
                    },
                    humidity: 65,
                    windSpeed: 15,
                    windDirection: "SW",
                    pressure: 29.85,
                    visibility: 10,
                    uvIndex: 5,
                },
                forecast: {
                    date: "2025-06-23",
                    hour: [
                        {
                            time: "2025-06-23 15:00",
                            temperature: 21,
                            humidity: 60,
                            feelsLike: 19,
                            chance_of_rain: 10,
                            chance_of_snow: 0,
                            condition: {
                                text: "Sunny",
                                icon: "//cdn.weatherapi.com/weather/64x64/day/113.png",
                                code: 1000,
                            },
                        },
                    ],
                },
            };

            const requestBody = { query: "London" };
            const mockRequest = createMockRequest(requestBody);

            mockValidateEnv.mockImplementation(() => {});
            mockWeatherService.getWeatherData.mockResolvedValue(
                mockWeatherData
            );

            const response = await POST(mockRequest);
            const responseData = await response.json();

            expect(response.status).toBe(200);
            expect(responseData).toEqual(mockWeatherData);
            expect(mockValidateEnv).toHaveBeenCalledTimes(1);
            expect(mockWeatherServiceFactory.create).toHaveBeenCalledWith(
                "weatherapi",
                "api-key-for-testing"
            );
            expect(mockWeatherService.getWeatherData).toHaveBeenCalledWith(
                requestBody
            );
        });

        it("should handle lon, lat query parameters", async () => {
            const mockWeatherData = {
                location: {
                    name: "New York",
                    country: "USA",
                    lat: 40.7128,
                    lon: -74.006,
                    localtime: "2025-06-23 09:30",
                },
                current: {
                    temperature: 25,
                    feelsLike: 27,
                    condition: {
                        text: "Sunny",
                        icon: "//cdn.weatherapi.com/weather/64x64/day/113.png",
                        code: 1000,
                    },
                    humidity: 55,
                    windSpeed: 12,
                    windDirection: "NW",
                    pressure: 30.15,
                    visibility: 16,
                    uvIndex: 7,
                },
                forecast: {
                    date: "2025-06-23",
                    hour: [],
                },
            };

            const requestBody = {
                query: "40.71428,-74.0064",
            };
            const mockRequest = createMockRequest(requestBody);

            mockValidateEnv.mockImplementation(() => {});
            mockWeatherService.getWeatherData.mockResolvedValue(
                mockWeatherData
            );

            const response = await POST(mockRequest);
            const responseData = await response.json();

            expect(response.status).toBe(200);
            expect(responseData).toEqual(mockWeatherData);
            expect(mockWeatherService.getWeatherData).toHaveBeenCalledWith(
                requestBody
            );
        });
    });

    describe("Validation errors", () => {
        it("should return 400 when query parameter is missing", async () => {
            const requestBody = {};
            const mockRequest = createMockRequest(requestBody);

            mockValidateEnv.mockImplementation(() => {});

            const response = await POST(mockRequest);
            const responseData = await response.json();

            expect(response.status).toBe(400);
            expect(responseData).toEqual({
                error: "Query parameter is required",
            });
            expect(mockWeatherServiceFactory.create).not.toHaveBeenCalled();
            expect(mockWeatherService.getWeatherData).not.toHaveBeenCalled();
        });

        it("should return 400 when query parameter is empty string", async () => {
            const requestBody = { query: "" };
            const mockRequest = createMockRequest(requestBody);

            mockValidateEnv.mockImplementation(() => {});

            const response = await POST(mockRequest);
            const responseData = await response.json();

            expect(response.status).toBe(400);
            expect(responseData).toEqual({
                error: "Query parameter is required",
            });
        });

        it("should return 400 when query parameter is null", async () => {
            const requestBody = { query: null };
            const mockRequest = createMockRequest(requestBody);

            mockValidateEnv.mockImplementation(() => {});

            const response = await POST(mockRequest);
            const responseData = await response.json();

            expect(response.status).toBe(400);
            expect(responseData).toEqual({
                error: "Query parameter is required",
            });
        });
    });

    describe("Environment validation errors", () => {
        it("should return 500 when environment validation fails", async () => {
            const requestBody = { query: "London" };
            const mockRequest = createMockRequest(requestBody);

            mockValidateEnv.mockImplementation(() => {
                throw new Error(
                    "WEATHER_API_KEY environment variable is required"
                );
            });

            const response = await POST(mockRequest);
            const responseData = await response.json();

            expect(response.status).toBe(500);
            expect(responseData).toEqual({
                error: "WEATHER_API_KEY environment variable is required",
            });
            expect(mockWeatherServiceFactory.create).not.toHaveBeenCalled();
            expect(mockWeatherService.getWeatherData).not.toHaveBeenCalled();
        });
    });

    describe("Weather service errors", () => {
        it("should return 500 when weather service throws an error", async () => {
            const requestBody = { query: "London" };
            const mockRequest = createMockRequest(requestBody);

            mockValidateEnv.mockImplementation(() => {});
            mockWeatherService.getWeatherData.mockRejectedValue(
                new Error("Weather API is unavailable")
            );

            const response = await POST(mockRequest);
            const responseData = await response.json();

            expect(response.status).toBe(500);
            expect(responseData).toEqual({
                error: "Weather API is unavailable",
            });
            expect(console.error).toHaveBeenCalledWith(
                "Weather API Error:",
                expect.any(Error)
            );
        });

        it("should handle weather service timeout errors", async () => {
            const requestBody = { query: "London" };
            const mockRequest = createMockRequest(requestBody);

            mockValidateEnv.mockImplementation(() => {});
            mockWeatherService.getWeatherData.mockRejectedValue(
                new Error("Request timeout")
            );

            const response = await POST(mockRequest);
            const responseData = await response.json();

            expect(response.status).toBe(500);
            expect(responseData).toEqual({
                error: "Request timeout",
            });
        });
    });

    describe("Request parsing errors", () => {
        it("should return 500 when request.json() fails", async () => {
            const mockRequest = {
                json: jest.fn().mockRejectedValue(new Error("Invalid JSON")),
                headers: new Map(),
                method: "POST",
                url: "http://localhost:3000/api/weather",
            };

            mockValidateEnv.mockImplementation(() => {});

            const response = await POST(mockRequest);
            const responseData = await response.json();

            expect(response.status).toBe(500);
            expect(responseData).toEqual({
                error: "Invalid JSON",
            });
            expect(mockWeatherServiceFactory.create).not.toHaveBeenCalled();
            expect(mockWeatherService.getWeatherData).not.toHaveBeenCalled();
        });
    });

    describe("Weather service factory errors", () => {
        it("should return 500 when WeatherServiceFactory.create throws an error", async () => {
            const requestBody = { query: "London" };
            const mockRequest = createMockRequest(requestBody);

            mockValidateEnv.mockImplementation(() => {});
            mockWeatherServiceFactory.create.mockImplementation(() => {
                throw new Error("Invalid weather provider");
            });

            const response = await POST(mockRequest);
            const responseData = await response.json();

            expect(response.status).toBe(500);
            expect(responseData).toEqual({
                error: "Invalid weather provider",
            });
            expect(mockWeatherService.getWeatherData).not.toHaveBeenCalled();
        });
    });

    describe("Integration scenarios", () => {
        it("should call weather service with correct environment variables", async () => {
            const requestBody = { query: "Tokyo" };
            const mockRequest = createMockRequest(requestBody);
            const mockWeatherData = {
                location: { name: "Tokyo" },
                current: { temperature: 25 },
                forecast: { date: "2025-06-23", hour: [] },
            };

            mockValidateEnv.mockImplementation(() => {});
            mockWeatherService.getWeatherData.mockResolvedValue(
                mockWeatherData
            );

            await POST(mockRequest);

            expect(mockWeatherServiceFactory.create).toHaveBeenCalledWith(
                "weatherapi",
                "api-key-for-testing"
            );
        });
    });
});
