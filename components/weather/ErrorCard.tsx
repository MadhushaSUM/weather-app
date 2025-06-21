"use client";

import React from "react";
import { Card, Button, Typography, Result } from "antd";
import {
    ReloadOutlined,
    CloudSyncOutlined,
    DisconnectOutlined,
    ExclamationCircleOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

interface ErrorCardProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error: any;
    onRetry: () => void;
    type: "weather" | "ai";
}

/**
 * A functional React component that displays an error card with relevant information
 * and troubleshooting tips based on the type of error encountered. The card includes
 * a retry button to allow users to attempt the operation again.
 */
export const ErrorCard: React.FC<ErrorCardProps> = ({
    error,
    onRetry,
    type,
}) => {
    /**
     * A function that provides error information based on the type of error encountered.
     * 1. If the error message involves references to 'network' or 'fetch',
     *    it returns details about a common network connection issue.
     * 2. If the error message involves references to 'location' or 'not found',
     *    it provides guidance related to location-related errors.
     * 3. For all other cases, it defaults to describing either a weather data error
     *    or an AI service error, depending on the `type` variable.
     */
    const getErrorInfo = () => {
        if (
            error?.message?.includes("network") ||
            error?.message?.includes("fetch")
        ) {
            return {
                icon: <DisconnectOutlined className="text-6xl text-white/70" />,
                title: "Network Connection Error",
                description:
                    "Please check your internet connection and try again.",
                tips: [
                    "Ensure you have a stable internet connection",
                    "Try refreshing the page",
                    "Check if your firewall is blocking the request",
                ],
            };
        }

        if (
            error?.message?.includes("location") ||
            error?.message?.includes("not found")
        ) {
            return {
                icon: <CloudSyncOutlined className="text-6xl text-white/70" />,
                title: "Location Not Found",
                description:
                    "The location you searched for could not be found.",
                tips: [
                    "Check the spelling of the location name",
                    'Try searching with city and country (e.g., "London, UK")',
                    "Use major cities or well-known locations",
                ],
            };
        }

        return {
            icon: (
                <ExclamationCircleOutlined className="text-6xl text-white/70" />
            ),
            title:
                type === "weather" ? "Weather Data Error" : "AI Service Error",
            description: "Something went wrong while fetching the data.",
            tips: [
                "This might be a temporary issue",
                "Try again in a few moments",
                "If the problem persists, contact support",
            ],
        };
    };

    const errorInfo = getErrorInfo();

    return (
        <Card className="!bg-white/10 !border-white/20 backdrop-blur-lg">
            <Result
                icon={errorInfo.icon}
                title={
                    <Title level={3} className="!text-white">
                        {errorInfo.title}
                    </Title>
                }
                subTitle={
                    <Text className="text-white/80 text-lg">
                        {errorInfo.description}
                    </Text>
                }
                extra={[
                    <Button
                        key="retry"
                        type="primary"
                        icon={<ReloadOutlined />}
                        onClick={onRetry}
                        size="large"
                        className="!bg-white/20 !border-white/30 !text-white hover:!bg-white/30"
                    >
                        Try Again
                    </Button>,
                ]}
            />

            {/* Error Tips */}
            <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
                <Title level={5} className="!text-white !mb-3">
                    💡 Troubleshooting Tips:
                </Title>
                <ul className="space-y-2">
                    {errorInfo.tips.map((tip, index) => (
                        <li
                            key={index}
                            className="text-white/70 text-sm flex items-start space-x-2"
                        >
                            <span className="text-blue-400 mt-1">•</span>
                            <span>{tip}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </Card>
    );
};
