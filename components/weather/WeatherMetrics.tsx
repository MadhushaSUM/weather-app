"use client";

import React from "react";
import { Card, Progress, Typography, Row, Col } from "antd";
import { DropletIcon, Wind, Eye, Sun, Thermometer, Gauge } from "lucide-react";
import { WeatherData } from "@/lib/weather/types/weather.types";

const { Title, Text } = Typography;

interface WeatherMetricsProps {
    weatherData: WeatherData;
}

interface MetricCardProps {
    title: string;
    value: string | number;
    unit: string;
    icon: React.ReactNode;
    progress?: number;
    progressColor?: string;
    description?: string;
    trend?: "up" | "down" | "stable";
}

/**
 * MetricCard component renders a detailed card displaying a metric with supplementary information.
 */
const MetricCard: React.FC<MetricCardProps> = ({
    title,
    value,
    unit,
    icon,
    progress,
    progressColor = "#1890ff",
    description,
    trend,
}) => {
    /**
     * Determines the CSS color class based on the `trend` value.
     */
    const getTrendColor = () => {
        if (trend === "up") return "text-green-500";
        if (trend === "down") return "text-red-500";
        return "text-gray-500";
    };

    return (
        <Card className="!bg-white/10 !border-white/20 backdrop-blur-lg hover:!bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-xl h-full">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white/20 rounded-lg">{icon}</div>
                    <div>
                        <Text className="text-white/80 text-sm font-medium">
                            {title}
                        </Text>
                        {description && (
                            <Text className="text-white/60 text-xs block">
                                {description}
                            </Text>
                        )}
                    </div>
                </div>
                {trend && (
                    <div className={`text-xs ${getTrendColor()}`}>
                        {trend === "up" ? "↗" : trend === "down" ? "↘" : "→"}
                    </div>
                )}
            </div>

            <div className="flex items-baseline space-x-2 mb-3">
                <Title level={2} className="!text-white !mb-0 !font-bold">
                    {value}
                </Title>
                <Text className="text-white/70 text-lg">{unit}</Text>
            </div>

            {progress !== undefined && (
                <Progress
                    percent={progress}
                    showInfo={false}
                    strokeColor={progressColor}
                    trailColor="rgba(255, 255, 255, 0.2)"
                    className="mb-2"
                />
            )}
        </Card>
    );
};

/**
 * WeatherMetrics component that displays various weather-related metrics such as humidity, wind speed, UV index, visibility.
 */
export const WeatherMetrics: React.FC<WeatherMetricsProps> = ({
    weatherData,
}) => {
    const { current } = weatherData;

    /**
     * Evaluates the humidity level and returns an object containing a color code and a description.
     */
    const getHumidityLevel = (humidity: number) => {
        if (humidity < 30) return { color: "#ff4d4f", desc: "Low" };
        if (humidity < 60) return { color: "#52c41a", desc: "Comfortable" };
        if (humidity < 80) return { color: "#faad14", desc: "High" };
        return { color: "#ff4d4f", desc: "Very High" };
    };

    /**
     * Determines the UV level category, description, and associated color based on a given UV index value.
     */
    const getUVLevel = (uv: number) => {
        if (uv <= 2) return { color: "#52c41a", desc: "Low" };
        if (uv <= 5) return { color: "#faad14", desc: "Moderate" };
        if (uv <= 7) return { color: "#fa8c16", desc: "High" };
        if (uv <= 10) return { color: "#ff4d4f", desc: "Very High" };
        return { color: "#a0d911", desc: "Extreme" };
    };

    /**
     * Determines the wind level description based on the given wind speed.
     */
    const getWindLevel = (speed: number) => {
        if (speed < 5) return { desc: "Calm" };
        if (speed < 15) return { desc: "Light breeze" };
        if (speed < 25) return { desc: "Moderate breeze" };
        if (speed < 35) return { desc: "Strong breeze" };
        return { desc: "Strong wind" };
    };

    /**
     * Determines the description of visibility level based on a numeric value.
     */
    const getVisibilityLevel = (visibility: number) => {
        if (visibility >= 10) return { desc: "Excellent" };
        if (visibility >= 5) return { desc: "Good" };
        if (visibility >= 2) return { desc: "Moderate" };
        return { desc: "Poor" };
    };

    const humidityLevel = getHumidityLevel(current.humidity);
    const uvLevel = getUVLevel(current.uvIndex);
    const windLevel = getWindLevel(current.windSpeed);
    const visibilityLevel = getVisibilityLevel(current.visibility);

    return (
        <div className="space-y-4">
            <Title level={3} className="!text-white !mb-4">
                Weather Metrics
            </Title>

            <Row gutter={[16, 16]}>
                {/* Priority Metrics */}
                <Col xs={24} sm={12} lg={6}>
                    <MetricCard
                        title="Humidity"
                        value={current.humidity}
                        unit="%"
                        icon={
                            <DropletIcon className="text-blue-400" size={20} />
                        }
                        progress={current.humidity}
                        progressColor={humidityLevel.color}
                        description={humidityLevel.desc}
                    />
                </Col>

                <Col xs={24} sm={12} lg={6}>
                    <MetricCard
                        title="Wind Speed"
                        value={current.windSpeed}
                        unit="km/h"
                        icon={<Wind className="text-green-400" size={20} />}
                        progress={Math.min((current.windSpeed / 50) * 100, 100)}
                        progressColor="#52c41a"
                        description={`${windLevel.desc} • ${current.windDirection}`}
                    />
                </Col>

                <Col xs={24} sm={12} lg={6}>
                    <MetricCard
                        title="UV Index"
                        value={current.uvIndex}
                        unit=""
                        icon={<Sun className="text-yellow-400" size={20} />}
                        progress={(current.uvIndex / 12) * 100}
                        progressColor={uvLevel.color}
                        description={uvLevel.desc}
                    />
                </Col>

                <Col xs={24} sm={12} lg={6}>
                    <MetricCard
                        title="Visibility"
                        value={current.visibility}
                        unit="km"
                        icon={<Eye className="text-purple-400" size={20} />}
                        progress={Math.min(
                            (current.visibility / 10) * 100,
                            100
                        )}
                        progressColor="#722ed1"
                        description={visibilityLevel.desc}
                    />
                </Col>

                {/* Secondary Metrics */}
                <Col xs={24} sm={12} lg={6}>
                    <MetricCard
                        title="Feels Like"
                        value={Math.round(current.feelsLike)}
                        unit="°C"
                        icon={
                            <Thermometer
                                className="text-orange-400"
                                size={20}
                            />
                        }
                        description="Apparent temperature"
                    />
                </Col>

                <Col xs={24} sm={12} lg={6}>
                    <MetricCard
                        title="Pressure"
                        value={current.pressure}
                        unit="inHg"
                        icon={<Gauge className="text-indigo-400" size={20} />}
                        progress={((current.pressure - 28) / 3) * 100}
                        progressColor="#1890ff"
                        description="Atmospheric pressure"
                    />
                </Col>
            </Row>
        </div>
    );
};
