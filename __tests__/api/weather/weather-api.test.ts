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
    getCurrentWeather: jest.fn(),
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
        it("should return weather data for valid query", async () => {
            const mockWeatherData = {
                location: {
                    name: "London",
                    country: "United Kingdom",
                    lat: 51.52,
                    lon: -0.11,
                },
                current: {
                    temp_c: 20,
                    condition: {
                        text: "Partly cloudy",
                        icon: "//cdn.weatherapi.com/weather/64x64/day/116.png",
                    },
                    humidity: 65,
                    wind_kph: 15,
                },
            };

            const requestBody = { query: "London" };
            const mockRequest = createMockRequest(requestBody);

            mockValidateEnv.mockImplementation(() => {});
            mockWeatherService.getCurrentWeather.mockResolvedValue(
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
            expect(mockWeatherService.getCurrentWeather).toHaveBeenCalledWith(
                requestBody
            );
        });

        it("should handle complex query parameters", async () => {
            const mockWeatherData = {
                location: { name: "New York", country: "USA" },
                current: { temp_c: 25, condition: { text: "Sunny" } },
            };

            const requestBody = {
                query: "New York",
                units: "metric",
                lang: "en",
            };
            const mockRequest = createMockRequest(requestBody);

            mockValidateEnv.mockImplementation(() => {});
            mockWeatherService.getCurrentWeather.mockResolvedValue(
                mockWeatherData
            );

            const response = await POST(mockRequest);
            const responseData = await response.json();

            expect(response.status).toBe(200);
            expect(responseData).toEqual(mockWeatherData);
            expect(mockWeatherService.getCurrentWeather).toHaveBeenCalledWith(
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
            expect(mockWeatherService.getCurrentWeather).not.toHaveBeenCalled();
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
            expect(mockWeatherService.getCurrentWeather).not.toHaveBeenCalled();
        });
    });

    describe("Weather service errors", () => {
        it("should return 500 when weather service throws an error", async () => {
            const requestBody = { query: "London" };
            const mockRequest = createMockRequest(requestBody);

            mockValidateEnv.mockImplementation(() => {});
            mockWeatherService.getCurrentWeather.mockRejectedValue(
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
            expect(mockWeatherService.getCurrentWeather).not.toHaveBeenCalled();
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
            expect(mockWeatherService.getCurrentWeather).not.toHaveBeenCalled();
        });
    });

    describe("Integration scenarios", () => {
        it("should call weather service with correct environment variables", async () => {
            const requestBody = { query: "Tokyo" };
            const mockRequest = createMockRequest(requestBody);
            const mockWeatherData = { location: { name: "Tokyo" } };

            mockValidateEnv.mockImplementation(() => {});
            mockWeatherService.getCurrentWeather.mockResolvedValue(
                mockWeatherData
            );

            await POST(mockRequest);

            expect(mockWeatherServiceFactory.create).toHaveBeenCalledWith(
                "weatherapi", // from jest.setup.ts
                "api-key-for-testing" // from jest.setup.ts
            );
        });
    });
});
