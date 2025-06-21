"use client";

import React, { useEffect, useState } from "react";
import { Card, Typography, Button, Spin, Alert } from "antd";
import {
    BulbOutlined,
    ReloadOutlined,
    HeartOutlined,
    CheckCircleOutlined,
    StarOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

interface AiTipCardProps {
    tip: string | null;
    isLoading: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error: any;
    onRetry: () => void;
    weatherCondition: string;
}

/**
 * AiTipCard is a React functional component that displays personalized weather insights in
 * the form of a card.
 * @component
 * @param {AiTipCardProps} props - The properties object.
 * @property {string} props.tip - The personalized weather tip to display.
 * @property {boolean} props.isLoading - Indicates whether the component is in a loading state.
 * @property {boolean} props.error - Flag indicating if an error occurred while retrieving tips.
 * @property {Function} props.onRetry - Callback function triggered when retrying after an error.
 * @property {string} props.weatherCondition - Describes the current weather condition (e.g., sunny, rainy).
 */
export const AiTipCard: React.FC<AiTipCardProps> = ({
    tip,
    isLoading,
    error,
    onRetry,
    weatherCondition,
}) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    /**
     * Generates a random motivational emoji from a predefined list of emojis.
     */
    const getMotivationalEmoji = () => {
        const emojis = ["🌟", "💪", "🚀", "✨", "🌈", "⭐", "🎯", "🌞"];
        return emojis[Math.floor(Math.random() * emojis.length)];
    };

    /**
     * Determines the appropriate emoji representation of a given weather condition.
     */
    const getWeatherEmoji = (condition: string) => {
        const lower = condition.toLowerCase();
        if (lower.includes("sun") || lower.includes("clear")) return "☀️";
        if (lower.includes("cloud")) return "☁️";
        if (lower.includes("rain")) return "🌧️";
        if (lower.includes("snow")) return "❄️";
        if (lower.includes("storm")) return "⛈️";
        return "🌤️";
    };

    if (error) {
        return (
            <Card className="!bg-white/10 !border-white/20 backdrop-blur-lg">
                <Alert
                    message="Unable to load AI tips"
                    description="Don't worry! Enjoy the weather data while we work on getting your personalized tips."
                    type="info"
                    showIcon
                    className="!bg-white/10 !border-white/20 !text-white"
                    action={
                        <Button
                            size="small"
                            type="text"
                            icon={<ReloadOutlined />}
                            onClick={onRetry}
                            className="!text-white !border-white/20"
                        >
                            Retry
                        </Button>
                    }
                />
            </Card>
        );
    }

    if (isLoading) {
        return (
            <Card className="!bg-white/10 !border-white/20 backdrop-blur-lg">
                <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                        <Spin size="large" className="mb-4" />
                        <Text className="text-white/80 block">
                            Getting personalized weather insights for you...
                        </Text>
                        <Text className="text-white/60 text-sm block mt-2">
                            Analyzing current conditions{" "}
                            {getWeatherEmoji(weatherCondition)}
                        </Text>
                    </div>
                </div>
            </Card>
        );
    }

    if (!tip) {
        return null;
    }

    return (
        <Card
            className={`!bg-gradient-to-r !from-purple-500/20 !to-pink-500/20 !border-white/30 backdrop-blur-lg transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl ${
                isVisible ? "animate-fade-in-up" : "opacity-0"
            }`}
        >
            <div className="relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 text-6xl opacity-10">
                    {getMotivationalEmoji()}
                </div>

                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full">
                            <BulbOutlined className="text-white text-lg" />
                        </div>
                        <div>
                            <Title
                                level={4}
                                className="!text-white !mb-0 flex items-center space-x-2"
                            >
                                <span>AI Weather Insights</span>
                                <StarOutlined className="text-yellow-400 animate-pulse" />
                            </Title>
                            <Text className="text-white/70 text-sm">
                                Personalized tips for{" "}
                                {weatherCondition.toLowerCase()} conditions
                            </Text>
                        </div>
                    </div>

                    <Button
                        type="text"
                        icon={<ReloadOutlined />}
                        onClick={onRetry}
                        className="!text-white/70 hover:!text-white hover:!bg-white/10"
                        size="small"
                    />
                </div>

                {/* Tip Content */}
                <div className="relative z-10">
                    <div className="bg-white/10 rounded-lg p-4 mb-4 border border-white/20">
                        <Paragraph className="!text-white !mb-0 text-base leading-relaxed">
                            {tip}
                        </Paragraph>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <CheckCircleOutlined className="text-green-400" />
                            <Text className="text-white/80 text-sm">
                                Stay safe and enjoy the weather!
                            </Text>
                        </div>

                        <div className="flex items-center space-x-2">
                            <HeartOutlined className="text-red-400 animate-pulse" />
                            <Text className="text-white/60 text-xs">
                                Made with care
                            </Text>
                        </div>
                    </div>
                </div>

                {/* Animated background elements */}
                <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full -translate-x-10 translate-y-10 animate-blob"></div>
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-r from-pink-400/20 to-yellow-400/20 rounded-full translate-x-8 -translate-y-8 animate-blob animation-delay-2000"></div>
            </div>
        </Card>
    );
};
