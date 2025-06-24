# WeatherWise

## Overview

WeatherWise is a project developed to get user's current location weather information.
Users can search cities and countries in the search bar to get weather information of
that location too.

## Features

1. Get geolocation from the browser and display weather information of the current location.
2. If location permissions were denied, fall back to the default location defined in the env variables.
3. Dynamic colour themes to match weather + Dark and light themes.
4. Show friendly, motivational AI suggestions to make the best out of the day for that particular weather.
5. Responsive user interface

## Getting Started

1. Create `.env.local` file in the root directory

```aiignore
WEATHER_API_KEY=
WEATHER_PROVIDER=weatherapi

LLM_API_KEY=            (optional)
LLM_PROVIDER=openai     (optional)

NEXT_PUBLIC_DEFAULT_LOCATION=Colombo
```

2. Then, run the development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Useful commands

1. Run unit tests

```aiignore
npm run test
```

2. Format all files to prettier formatting

```aiignore
npm run format
```

## Technical highlights

1. Used strategy pattern to integrate weather api and openai APIs; therefore, it is easy to switch from any service providers.
2. Queries are cached using custom hooks implemented with `tanstack queries`.
3. Implemented unit and integrated tests using Jest.
4. Added `Husky` pre-commit hook to run styling checks, TypeScript checks, linting checks, and run unit tests before each commit. Therefore, styles and conventions are preserved.
5. Followed standard version control conventions for commit messages, branch names and when merging branches.
