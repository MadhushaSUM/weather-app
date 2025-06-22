"use client";

import React, { useState, useEffect } from "react";
import { ConfigProvider, theme } from "antd";
import { WeatherHeader } from "@/components/weather/WeatherHeader";
import { WeatherHero } from "@/components/weather/WeatherHero";
import { WeatherMetrics } from "@/components/weather/WeatherMetrics";
import { WeatherDetails } from "@/components/weather/WeatherDetails";
import { AiTipCard } from "@/components/weather/AiTipCard";
import { LoadingSkeleton } from "@/components/weather/LoadingSkeleton";
import { ErrorCard } from "@/components/weather/ErrorCard";
import { ThemeProvider } from "@/components/weather/ThemeProvider";
import { useCurrentWeather } from "@/hooks/weather/useCurrentWeather";
import { useAiTip } from "@/hooks/llm/useAiTip";
import { getUserLocation } from "@/lib/geolocation/geolocation";
import { WeatherSearchParams } from "@/lib/weather/types/weather.types";

/**
 * Home page of the web app
 */
export default function WeatherPage() {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [searchParams, setSearchParams] =
        useState<WeatherSearchParams | null>(null);

    const {
        data: weatherData,
        isLoading: isWeatherLoading,
        error: weatherError,
        isError: isWeatherError,
        refetch: refetchWeather,
    } = useCurrentWeather(searchParams);

    const {
        data: aiTip,
        isLoading: isAiLoading,
        error: aiError,
        isError: isAiError,
        refetch: refetchAiTip,
    } = useAiTip(weatherData || null);

    useEffect(() => {
        /**
         * Retrieves the user's current weather information based on their geolocation.
         * If the user's location cannot be determined (due to permission denial or another error),
         * defaults to retrieving weather information for Colombo.
         * @returns A promise that resolves once the search parameters for the weather query are set.
         */
        const getWeather = async () => {
            try {
                const position = await getUserLocation();
                setSearchParams({
                    query:
                        position.coords.latitude +
                        "," +
                        position.coords.longitude,
                });
            } catch (error) {
                // Permission denied or location failed
                setSearchParams({
                    query:
                        process.env.NEXT_PUBLIC_DEFAULT_LOCATION || "Colombo",
                });
                console.log(error);
            }
        };

        getWeather();
    }, []);

    // Load theme preference
    useEffect(() => {
        const savedTheme = localStorage.getItem("weather-theme");
        if (savedTheme) {
            setIsDarkMode(savedTheme === "dark");
        } else {
            // Check system preference
            const prefersDark = window.matchMedia(
                "(prefers-color-scheme: dark)"
            ).matches;
            setIsDarkMode(prefersDark);
        }
    }, []);

    /**
     * Toggles the theme between dark mode and light mode.
     * Updates the state indicator for dark mode and stores the current theme
     * preference in the local storage.
     */
    const toggleTheme = () => {
        const newTheme = !isDarkMode;
        setIsDarkMode(newTheme);
        localStorage.setItem("weather-theme", newTheme ? "dark" : "light");
    };

    /**
     * Updates the search parameters for the current location.
     */
    const handleLocationSearch = (location: string) => {
        setSearchParams({ query: location });
    };

    /**
     * This function triggers a refresh process for weather and AI tip data.
     * First calls the `refetchWeather` function to get updated weather info.
     * If the `weatherData` is available, it proceeds to call the `refetchAiTip` function
     * to fetch updated AI-generated tips related to the weather.
     */
    const handleRefresh = () => {
        refetchWeather();
        if (weatherData) {
            refetchAiTip();
        }
    };

    if (isWeatherError) {
        return (
            <ThemeProvider isDarkMode={isDarkMode}>
                <ConfigProvider
                    theme={{
                        algorithm: isDarkMode
                            ? theme.darkAlgorithm
                            : theme.defaultAlgorithm,
                    }}
                >
                    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
                        <div className="container mx-auto px-4 py-6">
                            <WeatherHeader
                                onLocationSearch={handleLocationSearch}
                                onRefresh={handleRefresh}
                                onThemeToggle={toggleTheme}
                                isDarkMode={isDarkMode}
                                isLoading={isWeatherLoading}
                            />
                            <div className="mt-8">
                                <ErrorCard
                                    error={weatherError}
                                    onRetry={handleRefresh}
                                    type="weather"
                                />
                            </div>
                        </div>
                    </div>
                </ConfigProvider>
            </ThemeProvider>
        );
    }

    return (
        <ThemeProvider isDarkMode={isDarkMode}>
            <ConfigProvider
                theme={{
                    algorithm: isDarkMode
                        ? theme.darkAlgorithm
                        : theme.defaultAlgorithm,
                }}
            >
                <div
                    className={`min-h-screen transition-all duration-500 ${
                        weatherData
                            ? getWeatherGradient(
                                  weatherData.current.condition.code,
                                  isDarkMode
                              )
                            : "bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900"
                    }`}
                >
                    <div className="container mx-auto px-4 py-6 max-w-7xl">
                        <WeatherHeader
                            onLocationSearch={handleLocationSearch}
                            onRefresh={handleRefresh}
                            onThemeToggle={toggleTheme}
                            isDarkMode={isDarkMode}
                            isLoading={isWeatherLoading}
                            location={weatherData?.location}
                        />

                        {isWeatherLoading ? (
                            <LoadingSkeleton />
                        ) : weatherData ? (
                            <div className="space-y-6 mt-8 flex flex-col gap-5">
                                {/* Hero Section */}
                                <WeatherHero weatherData={weatherData} />

                                {/* Main Metrics Grid */}
                                <WeatherMetrics weatherData={weatherData} />

                                {/* AI Tip Section */}
                                {(aiTip || isAiLoading || isAiError) && (
                                    <AiTipCard
                                        tip={aiTip?.suggestion || null}
                                        isLoading={isAiLoading}
                                        error={isAiError ? aiError : null}
                                        onRetry={refetchAiTip}
                                        weatherCondition={
                                            weatherData.current.condition.text
                                        }
                                    />
                                )}

                                {/* Detailed Weather Information */}
                                <WeatherDetails weatherData={weatherData} />
                            </div>
                        ) : null}
                    </div>
                </div>
            </ConfigProvider>
        </ThemeProvider>
    );
}

/**
 * Generates a gradient class string based on the weather condition code and theme mode (dark or light).
 */
function getWeatherGradient(
    conditionCode: number,
    isDarkMode: boolean
): string {
    const baseClasses = "bg-gradient-to-br transition-all duration-1000";

    if (isDarkMode) {
        // Dark mode gradients
        if (conditionCode >= 1000 && conditionCode <= 1003) {
            // Clear/Partly Cloudy
            return `${baseClasses} from-slate-900 via-blue-900 to-indigo-900`;
        } else if (conditionCode >= 1006 && conditionCode <= 1030) {
            // Cloudy/Overcast
            return `${baseClasses} from-gray-900 via-slate-800 to-gray-700`;
        } else if (conditionCode >= 1180 && conditionCode <= 1201) {
            // Rain
            return `${baseClasses} from-slate-900 via-blue-800 to-cyan-800`;
        } else if (conditionCode >= 1210 && conditionCode <= 1237) {
            // Snow
            return `${baseClasses} from-slate-900 via-blue-900 to-slate-700`;
        } else if (conditionCode >= 1273 && conditionCode <= 1282) {
            // Thunderstorm
            return `${baseClasses} from-gray-900 via-purple-900 to-indigo-900`;
        }
        return `${baseClasses} from-gray-900 via-blue-900 to-purple-900`;
    } else {
        // Light mode gradients
        if (conditionCode >= 1000 && conditionCode <= 1003) {
            // Clear/Partly Cloudy
            return `${baseClasses} from-blue-400 via-cyan-400 to-blue-500`;
        } else if (conditionCode >= 1006 && conditionCode <= 1030) {
            // Cloudy/Overcast
            return `${baseClasses} from-gray-400 via-slate-500 to-gray-600`;
        } else if (conditionCode >= 1180 && conditionCode <= 1201) {
            // Rain
            return `${baseClasses} from-blue-500 via-indigo-500 to-purple-600`;
        } else if (conditionCode >= 1210 && conditionCode <= 1237) {
            // Snow
            return `${baseClasses} from-blue-200 via-cyan-300 to-blue-400`;
        } else if (conditionCode >= 1273 && conditionCode <= 1282) {
            // Thunderstorm
            return `${baseClasses} from-gray-600 via-purple-600 to-indigo-700`;
        }
        return `${baseClasses} from-blue-400 via-purple-500 to-pink-500`;
    }
}
