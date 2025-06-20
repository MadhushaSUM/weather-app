"use client";

import {
    Layout,
    Card,
    AutoComplete,
    Input,
    Typography,
    Alert,
    Spin,
} from "antd";
import { useEffect, useState } from "react";
import { getUserLocation } from "@/lib/geolocation/geolocation";
import { useCurrentWeather } from "@/hooks/weather/useCurrentWeather";
import { WeatherSearchParams } from "@/lib/weather/types/weather.types";
import { useAiTip } from "@/hooks/llm/useAiTip";

const { Header, Content, Footer } = Layout;
const { Search } = Input;
const { Text, Title } = Typography;

const options = [
    { value: "Colombo" },
    { value: "Mumbai" },
    { value: "New York" },
];

/**
 * Default home page
 */
export default function Home() {
    const [searchParams, setSearchParams] =
        useState<WeatherSearchParams | null>(null);
    const [location, setLocation] = useState<string | null>(null);

    const {
        data: weatherData,
        isLoading,
        error,
        isError,
    } = useCurrentWeather(searchParams);

    const {
        data: aiTip,
        isLoading: aiLoading,
        error: aiError,
        isError: isAiError,
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
                setLocation(
                    process.env.NEXT_PUBLIC_DEFAULT_LOCATION || "Colombo"
                );
                setSearchParams({
                    query:
                        process.env.NEXT_PUBLIC_DEFAULT_LOCATION || "Colombo",
                });
                console.log(error);
            }
        };

        getWeather();
    }, []);

    /**
     * Handles selection logic by updating the location and search parameters.
     * @param {string} value - The selected value to be processed.
     */
    const handleSelect = (value: string) => {
        setLocation(value);
        setSearchParams({ query: value });
    };

    /**
     * Clears the current location and search parameters.
     */
    const handleClear = () => {
        setLocation(null);
        setSearchParams(null);
    };

    /**
     * 1. Displays a loading spinner with a message when data is being loaded (`isLoading`).
     * 2. Shows an error alert when there is a failure to fetch weather data (`isError`).
     * 3. Displays weather information if the `weatherData` is successfully fetched along with the location name.
     * 4. Returns a default message prompting the user to enter a location if no activity is detected.
     * @returns A React component representing the current state of the weather data.
     */
    const renderWeatherContent = () => {
        if (isLoading) {
            return (
                <div className="flex justify-center items-center py-8">
                    <Spin size="large" />
                    <Text className="ml-4">Loading weather data...</Text>
                </div>
            );
        }

        if (isError) {
            return (
                <Alert
                    message="Error"
                    description={
                        error?.message || "Failed to fetch weather data"
                    }
                    type="error"
                    showIcon
                    className="mt-4"
                />
            );
        }

        if (weatherData) {
            return (
                <div className="mt-6">
                    <Title level={4} className="text-center mb-4">
                        Weather in {location}
                    </Title>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <Typography>
                            <pre className="text-sm overflow-auto">
                                {JSON.stringify(weatherData, null, 2)}
                            </pre>
                        </Typography>
                    </div>
                </div>
            );
        }

        return (
            <div className="text-center py-8">
                <Text type="secondary">
                    Enter a location to get weather information
                </Text>
            </div>
        );
    };

    /**
     * Renders the AI tip section based on the current state.
     * 1. Shows a loading spinner and message when AI is in the process of generating a tip.
     * 2. Displays an error alert if there was an issue in generating the AI tip.
     * 3. Renders the AI-generated tip along with a heading if a valid tip is available.
     * @returns A React component representing the current state of the Ai tip
     */
    const renderAiTip = () => {
        if (aiLoading) {
            return (
                <div className="flex justify-center items-center py-8">
                    <Spin size="large" />
                    <Text className="ml-4">Generating AI tip...</Text>
                </div>
            )
        }

        if (isAiError) {
            return (
                <Alert
                    message="Error"
                    description={
                        aiError?.message || "Failed to generate AI tip"
                    }
                    type="error"
                    showIcon
                    className="mt-4"
                />
            );
        }

        if (aiTip) {
            return (
                <div className="mt-6">
                    <Title level={4} className="text-center mb-4">
                        AI Tip
                    </Title>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <Typography>{aiTip.suggestion}</Typography>
                    </div>
                </div>
            )
        }
    }

    return (
        <Layout>
            <Header style={{ display: "flex", alignItems: "center" }}>
                <div className="text-white w-full flex justify-center font-bold text-2xl">
                    Weather App
                </div>
            </Header>
            <Content
                style={{ padding: "48px", minHeight: "calc(100vh - 134px)" }}
            >
                <Card hoverable>
                    <div className="flex flex-col items-center">
                        <div className="sm:w-96 mb-4 flex justify-center">
                            <AutoComplete
                                className=""
                                options={options}
                                placeholder="Enter a location"
                                value={location}
                                onChange={setLocation}
                                filterOption={(inputValue, option) =>
                                    option!.value
                                        .toUpperCase()
                                        .indexOf(inputValue.toUpperCase()) !==
                                    -1
                                }
                                onSelect={handleSelect}
                                onClear={handleClear}
                            >
                                <Search
                                    enterButton
                                    allowClear
                                    onSearch={handleSelect}
                                    loading={isLoading}
                                />
                            </AutoComplete>
                        </div>
                        <div className="mt-4">
                            {renderWeatherContent()}
                            {renderAiTip()}
                        </div>
                    </div>
                </Card>
            </Content>
            <Footer style={{ textAlign: "center" }}>
                Created by Madhusha Laksitha
            </Footer>
        </Layout>
    );
}
