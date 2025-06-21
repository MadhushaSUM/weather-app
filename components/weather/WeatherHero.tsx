"use client";

import React from "react";
import { Card, Typography } from "antd";
import { WeatherData } from "@/lib/weather/types/weather.types";

const { Title, Text } = Typography;

interface WeatherHeroProps {
    weatherData: WeatherData;
}

/**
 * Bigger first section in the page. It includes,
 * - An icon representing the weather condition.
 * - Description of the weather condition.
 * - Current temperature with dynamic color based on the value.
 * - Feels-like temperature.
 * - Location name and country.
 * - Current date and time.
 * - Geographic coordinates (latitude and longitude).
 */
export const WeatherHero: React.FC<WeatherHeroProps> = ({ weatherData }) => {
    const { current, location } = weatherData;

    /**
     * Returns a corresponding weather emoji based on the given weather condition code.
     */
    const getWeatherIcon = (conditionCode: number) => {
        if (conditionCode === 1000) return "☀️";
        if (conditionCode >= 1001 && conditionCode <= 1003) return "⛅";
        if (conditionCode >= 1006 && conditionCode <= 1009) return "☁️";
        if (conditionCode >= 1030 && conditionCode <= 1072) return "🌫️";
        if (conditionCode >= 1180 && conditionCode <= 1201) return "🌧️";
        if (conditionCode >= 1210 && conditionCode <= 1237) return "❄️";
        if (conditionCode >= 1240 && conditionCode <= 1264) return "🌦️";
        if (conditionCode >= 1273 && conditionCode <= 1282) return "⛈️";
        return "🌤️";
    };

    /**
     * Returns a CSS class name representing a color based on the provided temperature value.
     * The returned color class corresponds to specific temperature ranges.
     */
    const getTemperatureColor = (temp: number) => {
        if (temp >= 35) return "text-red-500";
        if (temp >= 25) return "text-orange-500";
        if (temp >= 15) return "text-yellow-500";
        if (temp >= 5) return "text-blue-500";
        return "text-cyan-500";
    };

    return (
        <Card className="!bg-white/10 !border-white/20 backdrop-blur-lg !text-white overflow-hidden">
            <div className="relative">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
                    <div className="absolute bottom-0 right-0 w-24 h-24 bg-white rounded-full translate-x-12 translate-y-12"></div>
                </div>

                {/* Main Content */}
                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    {/* Left Side - Temperature */}
                    <div className="flex items-center space-x-6 mb-6 lg:mb-0">
                        <div className="text-center">
                            <div className="text-7xl lg:text-8xl mb-2 animate-bounce-slow">
                                {getWeatherIcon(current.condition.code)}
                            </div>
                            <Text className="text-white/80 text-sm lg:text-base">
                                {current.condition.text}
                            </Text>
                        </div>

                        <div>
                            <div className="flex items-baseline space-x-2">
                                <Title
                                    level={1}
                                    className={`!mb-0 !text-6xl lg:!text-7xl font-bold ${getTemperatureColor(current.temperature)}`}
                                >
                                    {Math.round(current.temperature)}
                                </Title>
                                <span className="text-3xl lg:text-4xl text-white/80">
                                    °C
                                </span>
                            </div>
                            <Text className="text-white/70 text-lg">
                                Feels like {Math.round(current.feelsLike)}°C
                            </Text>
                        </div>
                    </div>

                    {/* Right Side - Location & Time */}
                    <div className="text-center lg:text-right">
                        <Title level={3} className="!text-white !mb-2">
                            {location.name}
                        </Title>
                        <Text className="text-white/80 text-lg block mb-2">
                            {location.country}
                        </Text>
                        <Text className="text-white/60 text-base">
                            {new Date().toLocaleDateString("en-US", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </Text>
                        <Text className="text-white/60 text-sm block">
                            {new Date().toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </Text>
                    </div>
                </div>

                {/* Coordinates */}
                <div className="mt-6 pt-4 border-t border-white/20">
                    <Text className="text-white/50 text-xs">
                        Coordinates: {location.lat.toFixed(4)}°N,{" "}
                        {location.lon.toFixed(4)}°E
                    </Text>
                </div>
            </div>
        </Card>
    );
};
