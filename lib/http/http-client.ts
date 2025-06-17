/**
 * Http client used for all API calls
 */
export class HttpClient {
    private baseURL: string;

    /**
     * Creates a HttpClient
     * @param baseURL URL to call
     */
    constructor(baseURL: string = "") {
        this.baseURL = baseURL;
    }

    /**
     * Gets the response from the called API
     * @param url resource
     * @param params parameters to send with API call
     * @returns response of type T
     */
    async get<T>(
        url: string,
        params?: Record<string, string | number>
    ): Promise<T> {
        const searchParams = new URLSearchParams();

        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    searchParams.append(key, String(value));
                }
            });
        }

        const fullUrl = `${this.baseURL}${url}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;

        const response = await fetch(fullUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(
                `HTTP Error: ${response.status} ${response.statusText}`
            );
        }

        return response.json();
    }
}
