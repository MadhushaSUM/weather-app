import { WeatherProvider, WeatherServiceFactory } from "@/lib/weather/services";
import { WeatherAPIService } from "@/lib/weather/services/weatherapi.service";

describe("WeatherServiceFactory", () => {
    const dummyApiKey = "test-api-key";

    it('returns a WeatherAPIService when provider is "weatherapi"', () => {
        const service = WeatherServiceFactory.create("weatherapi", dummyApiKey);
        expect(service).toBeInstanceOf(WeatherAPIService);
    });

    it("throws an error for unsupported provider", () => {
        expect(() =>
            WeatherServiceFactory.create(
                "someprovidername" as WeatherProvider,
                dummyApiKey
            )
        ).toThrow("Unsupported weather provider: someprovidername");
    });
});
