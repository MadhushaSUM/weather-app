"use client";

import React, { useMemo } from "react";
import { Card, Typography, Tooltip } from "antd";
import { DropletIcon, CloudRain, Snowflake } from "lucide-react";

const { Text } = Typography;

interface HourlyForecast {
    time: string;
    temperature: number;
    humidity: number;
    chance_of_rain: number;
    chance_of_snow: number;
    condition: {
        code: number;
        icon: string;
        text: string;
    };
}

interface WeatherForecastProps {
    forecastDate: string;
    hourlyData: HourlyForecast[];
    currentTimeISO: string; // e.g. "2025-06-23 16:02"
}

/**
 * Get emoji/icon for weather condition code
 */
const getWeatherEmoji = (code: number) => {
    if (code === 1000) return "☀️";
    if (code >= 1001 && code <= 1003) return "⛅";
    if (code >= 1006 && code <= 1009) return "☁️";
    if (code >= 1030 && code <= 1072) return "🌫️";
    if (code >= 1180 && code <= 1201) return "🌧️";
    if (code >= 1210 && code <= 1237) return "❄️";
    if (code >= 1240 && code <= 1264) return "🌦️";
    if (code >= 1273 && code <= 1282) return "⛈️";
    return "🌤️";
};

/**
 * SVG Line Chart for temperature variation inside the card
 * Expects array of temperatures, highlights current hour temp with red circle.
 */
const TempLineChart: React.FC<{
    temps: number[];
    currentIndex: number;
}> = ({ temps, currentIndex }) => {
    const maxTemp = Math.max(...temps);
    const minTemp = Math.min(...temps);
    const range = maxTemp - minTemp || 1;

    const points = temps
        .map((temp, i) => {
            const x = (i * 100) / (temps.length - 1);
            const y = 100 - ((temp - minTemp) / range) * 80 - 10; // 10 padding top/bottom
            return `${x},${y}`;
        })
        .join(" ");

    return (
        <svg
            viewBox="0 0 100 100"
            className="w-full h-16"
            preserveAspectRatio="none"
            aria-label="Temperature trend"
        >
            <polyline
                fill="none"
                stroke="#4ade80" // Tailwind green-400
                strokeWidth={2}
                points={points}
            />
            {/* Highlight current temp */}
            <circle
                cx={`${(currentIndex * 100) / (temps.length - 1)}`}
                cy={100 - ((temps[currentIndex] - minTemp) / range) * 80 - 10}
                r={4}
                fill="#f87171" // Tailwind red-400
            />
        </svg>
    );
};

/**
 * Display hourly weather forecast data
 */
export const WeatherForecast: React.FC<WeatherForecastProps> = ({
    hourlyData,
    forecastDate,
    currentTimeISO,
}) => {
    // Filter only hours after current time on the forecast date
    const filteredHours = useMemo(() => {
        const currentDateTime = new Date(currentTimeISO);
        return hourlyData.filter((hour) => {
            const hourDate = new Date(hour.time);
            // Only include hours after current time and on forecast date
            return (
                hourDate > currentDateTime && hour.time.startsWith(forecastDate)
            );
        });
    }, [hourlyData, currentTimeISO, forecastDate]);

    // For temp chart, get temps of filtered hours
    const temps = filteredHours.map((h) => h.temperature);

    return (
        <div>
            <h3 className="text-white text-2xl mb-4 font-semibold">
                Hourly Forecast
            </h3>
            <div className="flex space-x-4 overflow-x-auto scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-transparent px-1 py-2 flex flex-row gap-2">
                {filteredHours.length === 0 && (
                    <p className="text-white/60 italic">
                        No upcoming hourly data
                    </p>
                )}

                {filteredHours.map((hour, idx) => {
                    const time = new Date(hour.time).toLocaleTimeString(
                        "en-US",
                        {
                            hour: "2-digit",
                            minute: "2-digit",
                        }
                    );
                    const rainChance = hour.chance_of_rain;
                    const snowChance = hour.chance_of_snow;
                    const humidity = hour.humidity;

                    return (
                        <Card
                            key={hour.time}
                            size="small"
                            className="!bg-white/10 !border-white/20 backdrop-blur-lg min-w-[140px] flex-shrink-0"
                            bodyStyle={{ padding: "12px" }}
                        >
                            <div className="flex flex-col items-center space-y-1 text-white select-none">
                                <Text className="font-semibold">{time}</Text>
                                <div className="text-4xl">
                                    {getWeatherEmoji(hour.condition.code)}
                                </div>
                                <Text className="text-lg font-bold">
                                    {Math.round(hour.temperature)}°C
                                </Text>
                                <TempLineChart
                                    temps={temps}
                                    currentIndex={idx}
                                />

                                <div className="flex flex-col space-y-0.5 mt-2 text-xs w-full text-center">
                                    <Tooltip title="Humidity">
                                        <div className="flex items-center justify-center space-x-1">
                                            <DropletIcon
                                                className="text-blue-400"
                                                size={14}
                                            />
                                            <span>{humidity}%</span>
                                        </div>
                                    </Tooltip>
                                    <Tooltip title="Chance of Rain">
                                        <div className="flex items-center justify-center space-x-1">
                                            <CloudRain
                                                className="text-sky-400"
                                                size={14}
                                            />
                                            <span>{rainChance}%</span>
                                        </div>
                                    </Tooltip>
                                    <Tooltip title="Chance of Snow">
                                        <div className="flex items-center justify-center space-x-1">
                                            <Snowflake
                                                className="text-cyan-400"
                                                size={14}
                                            />
                                            <span>{snowChance}%</span>
                                        </div>
                                    </Tooltip>
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};
