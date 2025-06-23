import { NextRequest, NextResponse } from "next/server";
import { WeatherServiceFactory } from "@/lib/weather/services";
import { env, validateEnv } from "@/lib/config/env";
import { WeatherSearchParams } from "@/lib/weather/types/weather.types";

/**
 * Call this endpoint to get weather data
 * @param request
 * @returns WeatherData type response
 */
export async function POST(request: NextRequest) {
    try {
        validateEnv();

        const params: WeatherSearchParams = await request.json();

        if (!params.query) {
            return NextResponse.json(
                { error: "Query parameter is required" },
                { status: 400 }
            );
        }

        const weatherService = WeatherServiceFactory.create(
            env.WEATHER_PROVIDER,
            env.WEATHER_API_KEY
        );

        const weatherData = await weatherService.getWeatherData(params);

        return NextResponse.json(weatherData);
    } catch (error) {
        console.error("Weather API Error:", error);

        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Internal server error",
            },
            { status: 500 }
        );
    }
}
