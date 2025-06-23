import { WeatherAPIService } from "@/lib/weather/services/weatherapi.service";
import {
    mockWeatherAPIResponse,
    mockWeatherData,
} from "@/__tests__/setup/mocks/weather-data.mock";
import { mockHttpClient } from "@/__tests__/setup/mocks/http-client.mock";

const mockForecastAPIResponse = {
    forecast: {
        forecastday: [
            {
                date: "2024-01-15",
                date_epoch: 1705276800,
                hour: [
                    {
                        time: "2024-01-15 00:00",
                        temp_c: 10.0,
                        humidity: 85,
                        feelslike_c: 8.5,
                        chance_of_rain: 20,
                        chance_of_snow: 0,
                        condition: {
                            text: "Partly cloudy",
                            icon: "//cdn.weatherapi.com/weather/64x64/night/116.png",
                            code: 1003,
                        },
                    },
                    {
                        time: "2024-01-15 01:00",
                        temp_c: 9.5,
                        humidity: 87,
                        feelslike_c: 8.0,
                        chance_of_rain: 15,
                        chance_of_snow: 0,
                        condition: {
                            text: "Clear",
                            icon: "//cdn.weatherapi.com/weather/64x64/night/113.png",
                            code: 1000,
                        },
                    },
                ],
            },
        ],
    },
};

const mockForecastData = {
    date: "2024-01-15",
    hour: [
        {
            time: "2024-01-15 00:00",
            temperature: 10.0,
            humidity: 85,
            feelsLike: 8.5,
            chance_of_rain: 20,
            chance_of_snow: 0,
            condition: {
                text: "Partly cloudy",
                icon: "//cdn.weatherapi.com/weather/64x64/night/116.png",
                code: 1003,
            },
        },
        {
            time: "2024-01-15 01:00",
            temperature: 9.5,
            humidity: 87,
            feelsLike: 8.0,
            chance_of_rain: 15,
            chance_of_snow: 0,
            condition: {
                text: "Clear",
                icon: "//cdn.weatherapi.com/weather/64x64/night/113.png",
                code: 1000,
            },
        },
    ],
};

const mockCompleteWeatherData = {
    ...mockWeatherData,
    forecast: mockForecastData,
};

jest.mock("@/lib/http/http-client", () => ({
    HttpClient: jest.fn().mockImplementation(() => mockHttpClient),
}));

describe("WeatherAPIService", () => {
    const apiKey = "test-api-key";
    let service: WeatherAPIService;

    beforeEach(() => {
        service = new WeatherAPIService(apiKey);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("getWeatherData", () => {
        it("returns combined current weather and forecast data", async () => {
            mockHttpClient.get
                .mockResolvedValueOnce(mockWeatherAPIResponse)
                .mockResolvedValueOnce(mockForecastAPIResponse);

            const result = await service.getWeatherData({ query: "London" });

            expect(mockHttpClient.get).toHaveBeenCalledTimes(2);
            expect(mockHttpClient.get).toHaveBeenNthCalledWith(
                1,
                "/current.json",
                {
                    q: "London",
                    key: apiKey,
                }
            );
            expect(mockHttpClient.get).toHaveBeenNthCalledWith(
                2,
                "/forecast.json",
                {
                    q: "London",
                    key: apiKey,
                }
            );

            expect(result).toEqual(mockCompleteWeatherData);
        });

        it("throws an error when current weather API call fails", async () => {
            mockHttpClient.get.mockRejectedValueOnce(
                new Error("Current weather API error")
            );

            await expect(
                service.getWeatherData({ query: "Paris" })
            ).rejects.toThrow("Current weather API error");

            expect(mockHttpClient.get).toHaveBeenCalledTimes(1);
        });

        it("throws an error when forecast API call fails", async () => {
            mockHttpClient.get
                .mockResolvedValueOnce(mockWeatherAPIResponse)
                .mockRejectedValueOnce(new Error("Forecast API error"));

            await expect(
                service.getWeatherData({ query: "Paris" })
            ).rejects.toThrow("Forecast API error");

            expect(mockHttpClient.get).toHaveBeenCalledTimes(2);
        });

        it("handles different query types correctly", async () => {
            mockHttpClient.get
                .mockResolvedValueOnce(mockWeatherAPIResponse)
                .mockResolvedValueOnce(mockForecastAPIResponse);

            await service.getWeatherData({ query: "40.7128,-74.0060" });

            expect(mockHttpClient.get).toHaveBeenNthCalledWith(
                1,
                "/current.json",
                {
                    q: "40.7128,-74.0060",
                    key: apiKey,
                }
            );
            expect(mockHttpClient.get).toHaveBeenNthCalledWith(
                2,
                "/forecast.json",
                {
                    q: "40.7128,-74.0060",
                    key: apiKey,
                }
            );
        });
    });

    describe("data transformation", () => {
        it("correctly transforms current weather response", async () => {
            mockHttpClient.get
                .mockResolvedValueOnce(mockWeatherAPIResponse)
                .mockResolvedValueOnce(mockForecastAPIResponse);

            const result = await service.getWeatherData({ query: "London" });

            expect(result.location).toEqual(mockWeatherData.location);
            expect(result.current).toEqual(mockWeatherData.current);
        });

        it("correctly transforms forecast response", async () => {
            mockHttpClient.get
                .mockResolvedValueOnce(mockWeatherAPIResponse)
                .mockResolvedValueOnce(mockForecastAPIResponse);

            const result = await service.getWeatherData({ query: "London" });

            expect(result.forecast).toEqual(mockForecastData);
            expect(result.forecast?.hour).toHaveLength(2);
            expect(result.forecast?.hour[0]).toHaveProperty("temperature");
            expect(result.forecast?.hour[0]).toHaveProperty("feelsLike");
            expect(result.forecast?.hour[0]).toHaveProperty("chance_of_rain");
        });
    });
});
