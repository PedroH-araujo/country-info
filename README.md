
# Country Info API

Country Info API is a RESTful API built with Express and TypeScript. It integrates with external APIs to retrieve country details, available countries, and to add holiday events to a user’s calendar. This document provides instructions on installation, usage, endpoints, error handling, and testing.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Endpoints](#endpoints)
  - [Get Available Countries](#get-available-countries)
  - [Get Country Information](#get-country-information)
  - [Add Holidays to Calendar](#add-holidays-to-calendar)
- [Security](#security)
- [Testing](#testing)
- [License](#license)

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/PedroH-araujo/country-info.git
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the server:**

   ```bash
   npm run dev
   ```

   The server will run on port `3000` by default. You can change the port by setting the `PORT` environment variable.

## Usage

The API is available at `http://localhost:3000/api`. You can use any HTTP client (e.g., cURL, Postman) to interact with the endpoints.

## Endpoints

### Get Available Countries

- **Endpoint:** `GET /api/countries`
- **Description:** Retrieves a list of available countries.
- **Response Example:**

  ```json
  [
    {
      "code": "US",
      "name": "United States of America"
    },
    {
      "code": "BR",
      "name": "Brazil"
    }
  ]
  ```

### Get Country Information

- **Endpoint:** `GET /api/country-info/:countryCode`
- **Description:** Retrieves detailed information for a specific country.
- **URL Parameter:**
  - `countryCode`: The country code (e.g., `US`, `BR`).
- **Response Example:**

  ```json
  {
    "borderCountries": ["CA", "MX"],
    "populationHistory": [
      {
        "year": 2020,
        "population": 330000000
      }
    ],
    "flagUrl": "https://example.com/flag.png"
  }
  ```

- **Error Response Example (404):**

  ```json
  {
    "message": "Request GET https://date.nager.at/api/v3/CountryInfo/US with data {"test":"data"} failed with status 404"
  }
  ```

### Add Holidays to Calendar

- **Endpoint:** `POST /api/users/:userId/calendar/holidays`
- **Description:** Adds holiday events to a user's calendar.
- **URL Parameter:**
  - `userId`: The user's identifier.
- **Request Body Example:**

  ```json
  {
    "holidays": [
      {
        "name": "Independence Day",
        "date": "2025-07-04"
      }
    ]
  }
  ```

- **Response Example:**

  ```json
  {
    "success": true,
    "message": "Holidays added to calendar."
  }
  ```

## Security

The API uses:

- **Helmet:** to secure HTTP headers.
- **CORS:** to manage cross-origin resource sharing.

These middlewares are configured to provide a secure environment. You can adjust the settings in the server configuration files if needed.

## Testing

Tests are written using [Jest](https://jestjs.io/) and [Supertest](https://github.com/visionmedia/supertest).

- **To run tests:**

  ```bash
  npm run test
  ```

Make sure to properly configure your test environment and mock external API calls when needed.

## License

This project is licensed under the MIT License.
