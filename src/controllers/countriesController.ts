// src/controllers/countriesController.ts

import { Request, Response } from 'express';
import axios from 'axios';
import { AvailableCountry } from '../interfaces';

export const getAvailableCountries = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const response = await axios.get<AvailableCountry[]>('https://date.nager.at/api/v3/AvailableCountries');

    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error getting available countries' });
  }
};
