import { Request, Response } from 'express';
import axios from 'axios';
import { CountryInfoResponse, FlagResponse, PopulationResponse } from '../interfaces';

export const getCountryInfo = async (req: Request, res: Response): Promise<void> => {
  const { countryCode } = req.params;

  try {
    const countryInfoPromise = axios.get<CountryInfoResponse>(`https://date.nager.at/api/v3/CountryInfo/${countryCode}`);
    
    const flagPromise = axios.post<FlagResponse>('https://countriesnow.space/api/v0.1/countries/flag/images', {
      iso2: countryCode
    });

    const [{ data: countryInfoRes }, { data: flagRes }] = await Promise.all([
      countryInfoPromise,
      flagPromise
    ]);

    const populationPromise = axios.post<PopulationResponse>('https://countriesnow.space/api/v0.1/countries/population', {
      country: countryInfoRes.commonName
    });
    
    const { data: populationRes } = await populationPromise;

    const borderCountries = countryInfoRes.borders || [];
    const populationHistory = populationRes; 
    const flagUrl = flagRes.data?.flag || null;

    res.json({
      borderCountries,
      populationHistory,
      flagUrl,
    });
  } catch (error: unknown) {
    console.error(error);

    let statusCode = 500;
    let errorMessage = 'Unknown error occurred';

    if (axios.isAxiosError(error)) {
      statusCode = error.response?.status || 500;

      if (statusCode === 404 && error.config) {
        const method = error.config.method?.toUpperCase() || 'REQUEST';
        const url = error.config.url || '';
        const data = error.config.data ? JSON.stringify(error.config.data).replace(/\\/g, '') : '';
        errorMessage = data ? `Request ${method} ${url} with data ${data} failed with status 404` : `Request ${method} ${url} failed with status 404`;
      } else {
        errorMessage =
          (error.response?.data &&
            (error.response.data as { message?: string }).message) ||
          error.message;
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    res.status(statusCode).json({ message: errorMessage });
  }
};
