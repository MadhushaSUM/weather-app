// eslint-disable-next-line @typescript-eslint/no-require-imports
const nextJest = require("next/jest");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { pathsToModuleNameMapper } = require("ts-jest");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { compilerOptions } = require("./tsconfig.json");

const createJestConfig = nextJest({
    dir: "./",
});

const customJestConfig = {
    setupFilesAfterEnv: ["<rootDir>/__tests__/setup/jest.setup.ts"],
    testEnvironment: "jsdom",
    collectCoverageFrom: [
        "**/*.{js,jsx,ts,tsx}",
        "!**/*.d.ts",
        "!app/**/layout.tsx",
        "!app/**/loading.tsx",
        "!app/**/not-found.tsx",
        "!app/globals.css",
    ],
    coverageThreshold: {
        global: {
            branches: 70,
            functions: 70,
            lines: 70,
            statements: 70,
        },
    },
    testMatch: ["<rootDir>/__tests__/**/*.test.{js,jsx,ts,tsx}"],

    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
        prefix: "<rootDir>/",
    }),
};

module.exports = createJestConfig(customJestConfig);
