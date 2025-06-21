"use client";

import React from "react";
import { Card, Row, Col } from "antd";

/**
 * LoadingSkeleton is a React functional component that renders a skeleton UI placeholder
 * Animated pulsing effects are applied to simulate a loading appearance using CSS keyframes.
 */
export const LoadingSkeleton: React.FC = () => {
    return (
        <div className="space-y-6 mt-8">
            {/* Hero Section Skeleton */}
            <Card className="!bg-white/10 !border-white/20 backdrop-blur-lg">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center space-x-6 mb-6 lg:mb-0">
                        <div className="w-24 h-24 bg-white/20 rounded-full animate-pulse"></div>
                        <div className="space-y-2">
                            <div className="w-32 h-16 bg-white/20 rounded animate-pulse"></div>
                            <div className="w-24 h-4 bg-white/15 rounded animate-pulse"></div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="w-40 h-8 bg-white/20 rounded animate-pulse"></div>
                        <div className="w-32 h-6 bg-white/15 rounded animate-pulse"></div>
                        <div className="w-48 h-4 bg-white/10 rounded animate-pulse"></div>
                    </div>
                </div>
            </Card>

            {/* Metrics Grid Skeleton */}
            <div className="space-y-4">
                <div className="w-48 h-8 bg-white/20 rounded animate-pulse"></div>
                <Row gutter={[16, 16]}>
                    {[...Array(6)].map((_, index) => (
                        <Col xs={24} sm={12} lg={6} key={index}>
                            <Card className="!bg-white/10 !border-white/20 backdrop-blur-lg">
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-white/20 rounded-lg animate-pulse"></div>
                                        <div className="space-y-2">
                                            <div className="w-20 h-4 bg-white/15 rounded animate-pulse"></div>
                                            <div className="w-16 h-3 bg-white/10 rounded animate-pulse"></div>
                                        </div>
                                    </div>
                                    <div className="flex items-baseline space-x-2">
                                        <div className="w-16 h-8 bg-white/20 rounded animate-pulse"></div>
                                        <div className="w-8 h-6 bg-white/15 rounded animate-pulse"></div>
                                    </div>
                                    <div className="w-full h-2 bg-white/10 rounded animate-pulse"></div>
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>

            {/* AI Tip Skeleton */}
            <Card className="!bg-white/10 !border-white/20 backdrop-blur-lg">
                <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-white/20 rounded-full animate-pulse"></div>
                        <div className="space-y-2">
                            <div className="w-32 h-6 bg-white/20 rounded animate-pulse"></div>
                            <div className="w-48 h-4 bg-white/15 rounded animate-pulse"></div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="w-full h-4 bg-white/15 rounded animate-pulse"></div>
                        <div className="w-3/4 h-4 bg-white/15 rounded animate-pulse"></div>
                        <div className="w-1/2 h-4 bg-white/15 rounded animate-pulse"></div>
                    </div>
                </div>
            </Card>

            {/* Details Grid Skeleton */}
            <div className="space-y-4">
                <div className="w-64 h-8 bg-white/20 rounded animate-pulse"></div>
                <Row gutter={[16, 16]}>
                    {[...Array(4)].map((_, index) => (
                        <Col xs={24} lg={12} key={index}>
                            <Card className="!bg-white/10 !border-white/20 backdrop-blur-lg">
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-5 h-5 bg-white/20 rounded animate-pulse"></div>
                                        <div className="w-32 h-6 bg-white/20 rounded animate-pulse"></div>
                                    </div>
                                    <div className="space-y-3">
                                        {[...Array(2)].map((_, itemIndex) => (
                                            <div
                                                key={itemIndex}
                                                className="flex items-center space-x-3"
                                            >
                                                <div className="w-5 h-5 bg-white/15 rounded animate-pulse"></div>
                                                <div className="flex-1 space-y-2">
                                                    <div className="w-24 h-4 bg-white/15 rounded animate-pulse"></div>
                                                    <div className="w-16 h-5 bg-white/20 rounded animate-pulse"></div>
                                                    <div className="w-32 h-3 bg-white/10 rounded animate-pulse"></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="w-full h-2 bg-white/10 rounded animate-pulse"></div>
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>

            {/* Pulsing animation styles */}
            <style jsx>{`
                @keyframes pulse {
                    0%,
                    100% {
                        opacity: 1;
                    }
                    50% {
                        opacity: 0.5;
                    }
                }
                .animate-pulse {
                    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
            `}</style>
        </div>
    );
};
