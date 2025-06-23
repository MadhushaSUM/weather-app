import { WeatherServiceFactory } from "@/lib/weather/services";
import { mockHttpClient } from "@/__tests__/setup/mocks/http-client.mock";
import {
    mockForecastAPIResponse,
    mockWeatherAPIResponse,
} from "@/__tests__/setup/mocks/weather-data.mock";

jest.mock("@/lib/http/http-client", () => ({
    HttpClient: jest.fn().mockImplementation(() => mockHttpClient),
}));

describe("WeatherServiceFactory integration", () => {
    const apiKey = "fake-api-key";

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("creates WeatherAPIService and fetches combined weather data", async () => {
        mockHttpClient.get
            .mockResolvedValueOnce(mockWeatherAPIResponse)
            .mockResolvedValueOnce(mockForecastAPIResponse);

        const service = WeatherServiceFactory.create("weatherapi", apiKey);
        const result = await service.getWeatherData({ query: "Colombo" });

        expect(mockHttpClient.get).toHaveBeenCalledTimes(2);
        expect(mockHttpClient.get).toHaveBeenNthCalledWith(1, "/current.json", {
            q: "Colombo",
            key: apiKey,
        });
        expect(mockHttpClient.get).toHaveBeenNthCalledWith(
            2,
            "/forecast.json",
            {
                q: "Colombo",
                key: apiKey,
            }
        );

        expect(result.location.name).toBe("Colombo");
        expect(result.location.country).toBe("Sri Lanka");
        expect(result.current.condition.text).toBe("Patchy rain nearby");
        expect(result.current.temperature).toBe(29); // Rounded from 29.3
        expect(result.current.humidity).toBe(89);

        expect(result.forecast).toBeDefined();
        expect(result.forecast?.date).toBe("2025-06-19");
        expect(result.forecast?.hour).toHaveLength(2);
        expect(result.forecast?.hour[0].temperature).toBe(28.5);
        expect(result.forecast?.hour[0].chance_of_rain).toBe(30);
        expect(result.forecast?.hour[1].condition.text).toBe("Light rain");
    });

    it("creates service with correct configuration", () => {
        const service = WeatherServiceFactory.create("weatherapi", apiKey);

        expect(service).toBeDefined();
        expect(typeof service.getWeatherData).toBe("function");
    });

    it("handles different query formats", async () => {
        mockHttpClient.get
            .mockResolvedValueOnce(mockWeatherAPIResponse)
            .mockResolvedValueOnce(mockForecastAPIResponse);

        const service = WeatherServiceFactory.create("weatherapi", apiKey);

        await service.getWeatherData({ query: "6.9319,79.8478" });

        expect(mockHttpClient.get).toHaveBeenNthCalledWith(1, "/current.json", {
            q: "6.9319,79.8478",
            key: apiKey,
        });
        expect(mockHttpClient.get).toHaveBeenNthCalledWith(
            2,
            "/forecast.json",
            {
                q: "6.9319,79.8478",
                key: apiKey,
            }
        );
    });
});
