import { HttpClient } from "@/lib/http/http-client";

describe("HttpClient unit testing", () => {
    let httpClient: HttpClient;
    const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

    beforeEach(() => {
        httpClient = new HttpClient("https://api.example.com");
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("testing get function", () => {
        it("should be successful GET request", async () => {
            const mockData = { message: "success" };
            mockFetch.mockResolvedValueOnce({
                ok: true,
                /**
                 * Asynchronously returns mock data in JSON format.
                 * @returns A promise that resolves to the mock data object.
                 */
                json: async () => mockData,
            } as Response);

            const result = await httpClient.get("/test");

            expect(mockFetch).toHaveBeenCalledWith(
                "https://api.example.com/test",
                expect.objectContaining({
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
            );
            expect(result).toEqual(mockData);
        });

        it("should handle query parameters", async () => {
            const mockData = { message: "success" };
            mockFetch.mockResolvedValueOnce({
                ok: true,
                /**
                 * Asynchronously retrieves and returns mock data.
                 * @returns A promise that resolves to the mock data.
                 */
                json: async () => mockData,
            } as Response);

            await httpClient.get("/test", {
                param1: "value1",
                param2: "value2",
            });

            expect(mockFetch).toHaveBeenCalledWith(
                "https://api.example.com/test?param1=value1&param2=value2",
                expect.any(Object)
            );
        });

        it("should handle HTTP errors", async () => {
            mockFetch.mockResolvedValueOnce({
                ok: false,
                status: 404,
                statusText: "Not Found",
            } as Response);

            await expect(httpClient.get("/test")).rejects.toThrow(
                "HTTP Error: 404 Not Found"
            );
        });
    });
});
