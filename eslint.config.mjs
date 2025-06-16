import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

import jsdocPlugin from "eslint-plugin-jsdoc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

const config = [
    {
        ignores: ["node_modules/**", ".next/**", "out/**", "public/**"],
    },
    ...compat.extends("next/core-web-vitals", "next/typescript"),
    {
        plugins: {
            jsdoc: jsdocPlugin,
        },
        files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
        languageOptions: { globals: { browser: true } },
        rules: {
            "jsdoc/require-jsdoc": [
                "error",
                {
                    require: {
                        ClassDeclaration: true,
                        MethodDefinition: true,
                        FunctionDeclaration: true,
                        ArrowFunctionExpression: true,
                        FunctionExpression: true,
                    },
                },
            ],
        },
    },
];

export default config;
