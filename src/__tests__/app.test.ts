import request from 'supertest';
import app from '../app';
import { Request, Response } from 'express';
import axios, { AxiosError } from 'axios';
import { AvailableCountry, Holiday } from '../interfaces';
import { getCountryInfo } from '../controllers/countryInfoController'; // ajuste o caminho conforme necessário

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

axios.isAxiosError = <T = any, D = any>(error: any): error is AxiosError<T, D> => Boolean(error && error.isAxiosError);
describe('Country Info App API', () => {
  describe('GET /api/countries', () => {
    it('should return available countries', async () => {
      const mockData: AvailableCountry[] = [
        { countryCode: 'US', name: 'United States' },
        { countryCode: 'BR', name: 'Brazil' },
      ];
      mockedAxios.get.mockResolvedValueOnce({ data: mockData });

      const response = await request(app).get('/api/countries');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockData);
    });

    it('deve tratar erros ao obter os países disponíveis', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('API Error'));

      const response = await request(app).get('/api/countries');
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('GET /api/country-info/:countryCode', () => {
    it('should return country information', async () => {
      const countryCode = 'US';
    
      const mockCountryInfo = {
        commonName: 'United States of America',
        borders: ['CA', 'MX'],
      };
    
      const mockFlagData = {
        data: {
          flag: 'https://example.com/flag.png',
        },
      };
    
      const mockPopulationData = [
        {
          year: 2020,
          population: 330000000,
        },
      ];
    
      mockedAxios.get.mockResolvedValueOnce({ data: mockCountryInfo });
      mockedAxios.post.mockResolvedValueOnce({ data: mockFlagData });
      mockedAxios.post.mockResolvedValueOnce({ data: mockPopulationData });
    
      const response = await request(app).get(`/api/country-info/${countryCode}`);
    
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        borderCountries: mockCountryInfo.borders,
        populationHistory: mockPopulationData,
        flagUrl: mockFlagData.data.flag,
      });
    });

    it('should return a 404 error with proper message when axios GET fails with data', async () => {
      const countryCode = 'US';
    
      const axiosError = {
        isAxiosError: true,
        response: { status: 404 },
        config: {
          method: 'get',
          url: `https://date.nager.at/api/v3/CountryInfo/${countryCode}`,
          data: { test: 'data' },
        },
        message: 'Not Found',
      };
    
      mockedAxios.get.mockRejectedValueOnce(axiosError);
      mockedAxios.post.mockResolvedValueOnce({ data: {} });
    
      const response = await request(app).get(`/api/country-info/${countryCode}`);
    
      expect(response.status).toBe(404);

      console.log('asddas', response.status);
      console.log('asddas', response.body);
      expect(response.body).toEqual({
        message:
          'Request GET https://date.nager.at/api/v3/CountryInfo/US with data {"test":"data"} failed with status 404',
      });
    });

    it('should return a 404 error with proper message when axios GET fails', async () => {
      const countryCode = 'US';
    
      const axiosError = {
        isAxiosError: true,
        response: { status: 404 },
        config: {
          method: 'get',
          url: `https://date.nager.at/api/v3/CountryInfo/${countryCode}`,
          data: null,
        },
        message: 'Not Found',
      };
    
      mockedAxios.get.mockRejectedValueOnce(axiosError);
      mockedAxios.post.mockResolvedValueOnce({ data: {} });
    
      const response = await request(app).get(`/api/country-info/${countryCode}`);
    
      expect(response.status).toBe(404);

      console.log('asddas', response.status);
      console.log('asddas', response.body);
      expect(response.body).toEqual({
        message:
          'Request GET https://date.nager.at/api/v3/CountryInfo/US failed with status 404',
      });
    });
      
  });

  describe('POST /api/users/:userId/calendar/holidays', () => {
    it('should add holidays to the user calendar with filtering', async () => {
      const userId = '123';
      const countryCode = 'US';
      const year = 2025;
      const filterHolidays = ["New Year's Day"];

      const mockHolidays: Holiday[] = [
        { date: '2025-01-01', name: "New Year's Day", localName: "New Year's Day", countryCode: 'US', global: true, launchYear: 0, types: ['Public'] },
        { date: '2025-07-04', name: 'Independence Day', localName: 'Independence Day', countryCode: 'US', global: true, launchYear: 0, types: ['Public'] },
      ];
      mockedAxios.get.mockResolvedValueOnce({ data: mockHolidays });

      const response = await request(app)
        .post(`/api/users/${userId}/calendar/holidays`)
        .send({
          countryCode,
          year,
          holidays: filterHolidays,
        });

      const expectedFilteredHolidays = [
        { date: '2025-01-01', name: "New Year's Day", localName: "New Year's Day", countryCode: 'US', global: true, launchYear: 0, types: ['Public'] },
      ];

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        message: 'Holidays added to the user calendar',
        events: expectedFilteredHolidays,
      });
    });

    it('should add holidays to the user calendar without filtering', async () => {
      const userId = '456';
      const countryCode = 'US';
      const year = 2025;
      
      const mockHolidays: Holiday[] = [
        { date: '2025-01-01', name: "New Year's Day", localName: "New Year's Day", countryCode: 'US', global: true, launchYear: 0, types: ['Public'] },
        { date: '2025-07-04', name: 'Independence Day', localName: 'Independence Day', countryCode: 'US', global: true, launchYear: 0, types: ['Public'] },
      ];
      mockedAxios.get.mockResolvedValueOnce({ data: mockHolidays });

      const response = await request(app)
        .post(`/api/users/${userId}/calendar/holidays`)
        .send({
          countryCode,
          year,
        });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        message: 'Holidays added to the user calendar',
        events: mockHolidays,
      });
    });

    it('should handle errors when adding holidays to the calendar', async () => {
      const userId = '789';
      const countryCode = 'US';
      const year = 2025;
      mockedAxios.get.mockRejectedValueOnce(new Error('API Error'));

      const response = await request(app)
      .post(`/api/users/${userId}/calendar/holidays`)
      .send({
        countryCode,
        year,
        holidays: ["Some Holiday"],
      });
      
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('message');
    });
  });
})
