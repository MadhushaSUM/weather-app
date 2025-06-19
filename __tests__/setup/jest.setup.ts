import "@testing-library/jest-dom";

process.env.WEATHER_API_KEY = "api-key-for-testing";
process.env.WEATHER_PROVIDER = "weatherapi";

global.fetch = jest.fn();

const originalError = console.error;
beforeAll(() => {
    /**
     * Outputs an error message to the web console.
     * @param args - The data or messages to log as an error.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    console.error = (...args: any[]) => {
        if (
            typeof args[0] === "string" &&
            args[0].includes("Warning: ReactDOM.render is no longer supported")
        ) {
            return;
        }
        originalError.call(console, ...args);
    };
});

afterAll(() => {
    console.error = originalError;
});

afterEach(() => {
    jest.clearAllMocks();
});
