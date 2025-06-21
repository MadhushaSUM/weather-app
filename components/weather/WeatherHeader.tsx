"use client";

import React, { useState } from "react";
import { Input, Button, Typography, Space, Tooltip } from "antd";
import {
    SearchOutlined,
    ReloadOutlined,
    SunOutlined,
    MoonOutlined,
    EnvironmentOutlined,
    CloudOutlined,
} from "@ant-design/icons";

const { Title } = Typography;

interface WeatherHeaderProps {
    onLocationSearch: (location: string) => void;
    onRefresh: () => void;
    onThemeToggle: () => void;
    isDarkMode: boolean;
    isLoading: boolean;
    location?: {
        name: string;
        country: string;
    };
}

/**
 * The component provides a search function for locations, displays the current location
 * and weather conditions, and includes controls for refreshing data and toggling between
 * light and dark mode.
 */
export const WeatherHeader: React.FC<WeatherHeaderProps> = ({
    onLocationSearch,
    onRefresh,
    onThemeToggle,
    isDarkMode,
    isLoading,
    location,
}) => {
    const [searchValue, setSearchValue] = useState("");

    /**
     * Handles the search function for a location search input.
     */
    const handleSearch = () => {
        if (searchValue.trim()) {
            onLocationSearch(searchValue.trim());
            setSearchValue("");
        }
    };

    /**
     * Listens for the "Enter" key press event and triggers the handleSearch
     * function when the "Enter" key is pressed.
     */
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:items-center lg:justify-between">
            {/* Logo and Title */}
            <div className="flex items-center space-x-3">
                <div className="relative">
                    <CloudOutlined className="text-3xl lg:text-4xl text-white drop-shadow-lg animate-pulse" />
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
                </div>
                <div>
                    <Title
                        level={2}
                        className="!text-white !mb-0 !font-bold drop-shadow-lg"
                    >
                        WeatherWise
                    </Title>
                    {location && (
                        <div className="flex items-center text-white/80 text-sm">
                            <EnvironmentOutlined className="mr-1" />
                            <span className="animate-fade-in">
                                {location.name}, {location.country}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Search and Controls */}
            <div className="flex flex-col space-y-3 lg:space-y-0 lg:flex-row lg:items-center lg:space-x-3">
                {/* Search Bar */}
                <div className="flex space-x-2 lg:min-w-[300px]">
                    <Input
                        placeholder="Search city or location..."
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="flex-1 !bg-white/10 !border-white/20 !text-white placeholder:!text-white/60 backdrop-blur-md"
                        size="large"
                        suffix={
                            <SearchOutlined
                                className="text-white/60 hover:text-white cursor-pointer transition-colors"
                                onClick={handleSearch}
                            />
                        }
                    />
                </div>

                {/* Action Buttons */}
                <Space size="small">
                    <Tooltip title="Refresh weather data">
                        <Button
                            type="text"
                            icon={<ReloadOutlined />}
                            onClick={onRefresh}
                            loading={isLoading}
                            className="!bg-white/10 !border-white/20 !text-white hover:!bg-white/20 backdrop-blur-md !h-10 !w-10"
                        />
                    </Tooltip>

                    <Tooltip
                        title={
                            isDarkMode
                                ? "Switch to light mode"
                                : "Switch to dark mode"
                        }
                    >
                        <Button
                            type="text"
                            icon={
                                isDarkMode ? <SunOutlined /> : <MoonOutlined />
                            }
                            onClick={onThemeToggle}
                            className="!bg-white/10 !border-white/20 !text-white hover:!bg-white/20 backdrop-blur-md !h-10 !w-10"
                        />
                    </Tooltip>
                </Space>
            </div>
        </div>
    );
};
