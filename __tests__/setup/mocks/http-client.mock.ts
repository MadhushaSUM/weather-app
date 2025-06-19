export const mockHttpClient = {
    get: jest.fn(),
};

jest.mock("@/lib/http/http-client", () => ({
    HttpClient: jest.fn().mockImplementation(() => mockHttpClient),
}));
