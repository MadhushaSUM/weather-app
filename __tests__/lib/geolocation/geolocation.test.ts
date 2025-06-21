import { getUserLocation } from "@/lib/geolocation/geolocation";

describe("getUserLocation", () => {
    const mockGeolocation = {
        getCurrentPosition: jest.fn(),
    };

    beforeAll(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        global.navigator.geolocation = mockGeolocation;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("resolves with a position when geolocation succeeds", async () => {
        const mockPosition = {
            coords: {
                latitude: 51.1,
                longitude: 45.3,
                accuracy: 100,
            },
            timestamp: Date.now(),
        };

        mockGeolocation.getCurrentPosition.mockImplementationOnce((success) =>
            success(mockPosition)
        );

        await expect(getUserLocation()).resolves.toEqual(mockPosition);
    });

    it("rejects with an error when geolocation fails", async () => {
        const mockError = new Error("User denied Geolocation");

        mockGeolocation.getCurrentPosition.mockImplementationOnce((_, error) =>
            error(mockError)
        );

        await expect(getUserLocation()).rejects.toThrow(
            "User denied Geolocation"
        );
    });

    it("rejects if geolocation is not supported", async () => {
        // Temporarily delete navigator.geolocation
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete global.navigator.geolocation;

        await expect(getUserLocation()).rejects.toThrow(
            "Geolocation not supported"
        );
    });
});
