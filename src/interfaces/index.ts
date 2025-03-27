export interface AvailableCountry {
  countryCode: string;
  name: string;
}

export interface PopulationResponse {
  year: number;
  value: number;
}

export interface CountryInfoResponse {
  commonName: string;
  officialName: string;
  countryCode: string;
  region: string;
  borders: CountryInfoResponse[]
}

export interface FlagResponse {
  error: boolean;
  msg: string;
  data: {
    name: string;
    flag: string;
    iso2: string;
    iso3: string;
  }
}

export interface Holiday {
  date: string;
  localName: string;
  name: string;
  countryCode: string;
  global: boolean;
  counties?: string[];
  launchYear: number;
  types: string[];
}

export interface AddHolidayRequest {
  countryCode: string;
  year: number;
  holidays?: string[];
}

export interface AddHolidayResponse {
  message: string;
  events: Holiday[];
}

export interface CustomError extends Error {
  status?: number;
}