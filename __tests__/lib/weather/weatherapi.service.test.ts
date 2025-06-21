import { WeatherAPIService } from "@/lib/weather/services/weatherapi.service";
import {
    mockWeatherAPIResponse,
    mockWeatherData,
} from "@/__tests__/setup/mocks/weather-data.mock";
import { mockHttpClient } from "@/__tests__/setup/mocks/http-client.mock";

jest.mock("@/lib/http/http-client", () => ({
    HttpClient: jest.fn().mockImplementation(() => mockHttpClient),
}));

describe("WeatherAPIService", () => {
    const apiKey = "test-api-key";
    let service: WeatherAPIService;

    beforeEach(() => {
        mockHttpClient.get.mockResolvedValue(mockWeatherAPIResponse);
        service = new WeatherAPIService(apiKey);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("returns transformed weather data", async () => {
        const result = await service.getCurrentWeather({ query: "London" });

        expect(mockHttpClient.get).toHaveBeenCalledWith("/current.json", {
            q: "London",
            key: apiKey,
        });

        expect(result).toEqual(mockWeatherData);
    });

    it("throws an error when API call fails", async () => {
        mockHttpClient.get.mockRejectedValue(new Error("Network error"));

        await expect(
            service.getCurrentWeather({ query: "Paris" })
        ).rejects.toThrow("Network error");
    });
});
