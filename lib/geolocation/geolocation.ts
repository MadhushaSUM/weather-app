/**
 * Gets the user's current geographical location as a `Promise`.
 * uses the browser's Geolocation API. Timeout 5000 ms.
 * If the user's browser does not support API, promise will reject with an error.
 *
 * @returns {Promise<GeolocationPosition>} A promise that resolves with the `GeolocationPosition`
 * @throws {Error} When geolocation is not supported by the browser.
 */
export const getUserLocation = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            return reject(new Error("Geolocation not supported"));
        }

        navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 5000,
        });
    });
};
