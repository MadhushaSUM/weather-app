import { WeatherServiceFactory } from "@/lib/weather/services";
import { mockHttpClient } from "@/__tests__/setup/mocks/http-client.mock";
import { mockWeatherAPIResponse } from "@/__tests__/setup/mocks/weather-data.mock";

jest.mock("@/lib/http/http-client", () => ({
    HttpClient: jest.fn().mockImplementation(() => mockHttpClient),
}));

describe("WeatherServiceFactory integration", () => {
    const apiKey = "fake-api-key";

    it("creates WeatherAPIService and fetches data", async () => {
        const mockData = mockWeatherAPIResponse;

        mockHttpClient.get.mockResolvedValue(mockData);

        const service = WeatherServiceFactory.create("weatherapi", apiKey);
        const result = await service.getCurrentWeather({ query: "Colombo" });

        expect(result.location.name).toBe("Colombo");
        expect(result.current.condition.text).toBe("Patchy rain nearby");
    });
});
