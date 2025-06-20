import { NextRequest, NextResponse } from "next/server";
import { WeatherData } from "@/lib/weather/types/weather.types";
import { LLMServiceFactory } from "@/lib/llm/services";
import { env } from "@/lib/config/env";

/**
 * Call this endpoint to get AI suggestion
 * @param request The incoming HTTP request object containing weather data in JSON format.
 * @returns A promise resolving to a response object with the AI-generated suggestion
 */
export async function POST(request: NextRequest) {
    try {
        const params: WeatherData = await request.json();

        if (!params) {
            return NextResponse.json(
                { error: "Weather data is required" },
                { status: 400 }
            );
        }

        const llmService = LLMServiceFactory.create(
            env.LLM_PROVIDER,
            env.LLM_API_KEY
        );

        const aiResponse = await llmService.getAISuggestion(params);
        return NextResponse.json(aiResponse);
    } catch (error) {
        console.error("LLM API Error:", error);

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
