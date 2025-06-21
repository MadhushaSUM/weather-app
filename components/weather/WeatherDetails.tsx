"use client";

import React from "react";
import { Card, Typography, Row, Col, Progress } from "antd";
import {
    Compass,
    Activity,
    CloudRain,
    Thermometer,
    Wind,
    Eye,
    Sun,
    Cloud,
} from "lucide-react";
import { WeatherData } from "@/lib/weather/types/weather.types";

const { Title, Text } = Typography;

interface WeatherDetailsProps {
    weatherData: WeatherData;
}

interface DetailItemProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    description?: string;
    color?: string;
}

/**
 * A functional React component that displays a detailed item with an icon, label, value, and optional description.
 */
const DetailItem: React.FC<DetailItemProps> = ({
    icon,
    label,
    value,
    description,
    color = "text-blue-400",
}) => (
    <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-200">
        <div className={`${color} flex-shrink-0`}>{icon}</div>
        <div className="flex-1">
            <Text className="text-white/80 text-sm block">{label}</Text>
            <Text className="text-white font-semibold text-base">{value}</Text>
            {description && (
                <Text className="text-white/60 text-xs block">
                    {description}
                </Text>
            )}
        </div>
    </div>
);

/**
 * A React functional component that displays detailed weather information based on the provided weather data.
 */
export const WeatherDetails: React.FC<WeatherDetailsProps> = ({
    weatherData,
}) => {
    const { current } = weatherData;

    /**
     * Retrieves the full name of a wind direction based on its abbreviation.
     */
    const getWindDirection = (direction: string) => {
        const directions: { [key: string]: string } = {
            N: "North",
            NE: "Northeast",
            E: "East",
            SE: "Southeast",
            S: "South",
            SW: "Southwest",
            W: "West",
            NW: "Northwest",
            NNE: "North-Northeast",
            ENE: "East-Northeast",
            ESE: "East-Southeast",
            SSE: "South-Southeast",
            SSW: "South-Southwest",
            WSW: "West-Southwest",
            WNW: "West-Northwest",
            NNW: "North-Northwest",
        };
        return directions[direction] || direction;
    };

    /**
     * Determines the pressure status based on the given pressure value.
     * @returns {string} - Returns "High pressure" if the pressure is greater than 30.2,
     *                     "Low pressure" if the pressure is less than 29.8,
     *                     and "Normal pressure" if the pressure is within the range 29.8 to 30.2.
     */
    const getPressureStatus = (pressure: number) => {
        if (pressure > 30.2) return "High pressure";
        if (pressure < 29.8) return "Low pressure";
        return "Normal pressure";
    };

    /**
     * Calculates the comfort level based on temperature and humidity.
     * @returns {string} The comfort level categorized as "Cool", "Comfortable", "Warm", or "Hot".
     */
    const getComfortLevel = (temp: number, humidity: number) => {
        const heatIndex = temp + 0.5 * (humidity - 40);
        if (heatIndex < 15) return "Cool";
        if (heatIndex < 25) return "Comfortable";
        if (heatIndex < 30) return "Warm";
        return "Hot";
    };

    return (
        <div className="space-y-6">
            <Title level={3} className="!text-white !mb-4">
                Detailed Weather Information
            </Title>

            <Row gutter={[16, 16]}>
                {/* Temperature Details */}
                <Col xs={24} lg={12}>
                    <Card
                        title={
                            <div className="flex items-center space-x-2 text-white">
                                <Thermometer
                                    className="text-orange-400"
                                    size={20}
                                />
                                <span>Temperature Details</span>
                            </div>
                        }
                        className="!bg-white/10 !border-white/20 backdrop-blur-lg h-full"
                        styles={{
                            header: {
                                backgroundColor: "transparent",
                                borderBottom: "1px solid rgba(255,255,255,0.2)",
                            },
                        }}
                    >
                        <div className="space-y-4">
                            <DetailItem
                                icon={<Thermometer size={20} />}
                                label="Current Temperature"
                                value={`${Math.round(current.temperature)}°C`}
                                color="text-red-400"
                            />
                            <DetailItem
                                icon={<Activity size={20} />}
                                label="Feels Like"
                                value={`${Math.round(current.feelsLike)}°C`}
                                description={getComfortLevel(
                                    current.temperature,
                                    current.humidity
                                )}
                                color="text-orange-400"
                            />
                            <div className="mt-4">
                                <Text className="text-white/80 text-sm block mb-2">
                                    Temperature Comfort
                                </Text>
                                <Progress
                                    percent={Math.min(
                                        ((current.temperature + 10) / 50) * 100,
                                        100
                                    )}
                                    strokeColor={{
                                        "0%": "#108ee9",
                                        "50%": "#87d068",
                                        "100%": "#ff4d4f",
                                    }}
                                    showInfo={false}
                                />
                            </div>
                        </div>
                    </Card>
                </Col>

                {/* Wind Details */}
                <Col xs={24} lg={12}>
                    <Card
                        title={
                            <div className="flex items-center space-x-2 text-white">
                                <Wind className="text-green-400" size={20} />
                                <span>Wind Information</span>
                            </div>
                        }
                        className="!bg-white/10 !border-white/20 backdrop-blur-lg h-full"
                        styles={{
                            header: {
                                backgroundColor: "transparent",
                                borderBottom: "1px solid rgba(255,255,255,0.2)",
                            },
                        }}
                    >
                        <div className="space-y-4">
                            <DetailItem
                                icon={<Wind size={20} />}
                                label="Wind Speed"
                                value={`${current.windSpeed} km/h`}
                                color="text-green-400"
                            />
                            <DetailItem
                                icon={<Compass size={20} />}
                                label="Direction"
                                value={current.windDirection}
                                description={getWindDirection(
                                    current.windDirection
                                )}
                                color="text-blue-400"
                            />
                            <div className="mt-4">
                                <Text className="text-white/80 text-sm block mb-2">
                                    Wind Intensity
                                </Text>
                                <Progress
                                    percent={Math.min(
                                        (current.windSpeed / 50) * 100,
                                        100
                                    )}
                                    strokeColor="#52c41a"
                                    showInfo={false}
                                />
                            </div>
                        </div>
                    </Card>
                </Col>

                {/* Atmospheric Conditions */}
                <Col xs={24} lg={12}>
                    <Card
                        title={
                            <div className="flex items-center space-x-2 text-white">
                                <Cloud className="text-purple-400" size={20} />
                                <span>Atmospheric Conditions</span>
                            </div>
                        }
                        className="!bg-white/10 !border-white/20 backdrop-blur-lg h-full"
                        styles={{
                            header: {
                                backgroundColor: "transparent",
                                borderBottom: "1px solid rgba(255,255,255,0.2)",
                            },
                        }}
                    >
                        <div className="space-y-4">
                            <DetailItem
                                icon={<CloudRain size={20} />}
                                label="Humidity"
                                value={`${current.humidity}%`}
                                description={
                                    current.humidity > 70
                                        ? "High humidity"
                                        : current.humidity < 30
                                          ? "Low humidity"
                                          : "Comfortable"
                                }
                                color="text-blue-400"
                            />
                            <DetailItem
                                icon={<Activity size={20} />}
                                label="Atmospheric Pressure"
                                value={`${current.pressure} inHg`}
                                description={getPressureStatus(
                                    current.pressure
                                )}
                                color="text-indigo-400"
                            />
                            <div className="mt-4">
                                <Text className="text-white/80 text-sm block mb-2">
                                    Humidity Level
                                </Text>
                                <Progress
                                    percent={current.humidity}
                                    strokeColor={
                                        current.humidity > 70
                                            ? "#ff4d4f"
                                            : current.humidity < 30
                                              ? "#faad14"
                                              : "#52c41a"
                                    }
                                    showInfo={false}
                                />
                            </div>
                        </div>
                    </Card>
                </Col>

                {/* Visibility & UV */}
                <Col xs={24} lg={12}>
                    <Card
                        title={
                            <div className="flex items-center space-x-2 text-white">
                                <Sun className="text-yellow-400" size={20} />
                                <span>Visibility & UV</span>
                            </div>
                        }
                        className="!bg-white/10 !border-white/20 backdrop-blur-lg h-full"
                        styles={{
                            header: {
                                backgroundColor: "transparent",
                                borderBottom: "1px solid rgba(255,255,255,0.2)",
                            },
                        }}
                    >
                        <div className="space-y-4">
                            <DetailItem
                                icon={<Eye size={20} />}
                                label="Visibility"
                                value={`${current.visibility} km`}
                                description={
                                    current.visibility >= 10
                                        ? "Excellent"
                                        : current.visibility >= 5
                                          ? "Good"
                                          : "Limited"
                                }
                                color="text-purple-400"
                            />
                            <DetailItem
                                icon={<Sun size={20} />}
                                label="UV Index"
                                value={current.uvIndex.toString()}
                                description={
                                    current.uvIndex <= 2
                                        ? "Low - Minimal protection needed"
                                        : current.uvIndex <= 5
                                          ? "Moderate - Seek shade during midday"
                                          : current.uvIndex <= 7
                                            ? "High - Protection essential"
                                            : current.uvIndex <= 10
                                              ? "Very High - Extra protection required"
                                              : "Extreme - Avoid being outside"
                                }
                                color="text-yellow-400"
                            />
                            <div className="mt-4">
                                <Text className="text-white/80 text-sm block mb-2">
                                    UV Protection Needed
                                </Text>
                                <Progress
                                    percent={(current.uvIndex / 12) * 100}
                                    strokeColor={
                                        current.uvIndex <= 2
                                            ? "#52c41a"
                                            : current.uvIndex <= 5
                                              ? "#faad14"
                                              : current.uvIndex <= 7
                                                ? "#fa8c16"
                                                : current.uvIndex <= 10
                                                  ? "#ff4d4f"
                                                  : "#a0d911"
                                    }
                                    showInfo={false}
                                />
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* Weather Summary */}
            <Card className="!bg-white/10 !border-white/20 backdrop-blur-lg">
                <div className="text-center">
                    <Title level={4} className="!text-white !mb-3">
                        Current Weather Summary
                    </Title>
                    <Text className="text-white/80 text-lg">
                        {current.condition.text} with{" "}
                        {Math.round(current.temperature)}°C temperature.
                        {current.humidity > 70
                            ? " High humidity may make it feel warmer."
                            : ""}
                        {current.windSpeed > 20
                            ? " Windy conditions present."
                            : ""}
                        {current.uvIndex > 7
                            ? " High UV levels - sun protection recommended."
                            : ""}
                    </Text>
                </div>
            </Card>
        </div>
    );
};
