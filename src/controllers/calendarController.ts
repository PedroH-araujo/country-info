import { Request, Response } from 'express';
import axios, { AxiosError } from 'axios';
import { Holiday, AddHolidayRequest, AddHolidayResponse } from '../interfaces';

const userCalendars: { [userId: string]: Holiday[] } = {};

export const addHolidaysToCalendar = async (
  req: Request<{ userId: string }, unknown, AddHolidayRequest>,
  res: Response<AddHolidayResponse & { error?: string }>
): Promise<void> => {
  const { userId } = req.params;
  const { countryCode, year, holidays } = req.body;
  
  try {
    const response = await axios.get<Holiday[]>(`https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode}`);
    let holidaysData = response.data;

    if (holidays && Array.isArray(holidays) && holidays.length > 0) {
      holidaysData = holidaysData.filter((holiday: Holiday) =>
        holidays.includes(holiday.localName) || holidays.includes(holiday.name)
      );
    }

    if (!userCalendars[userId]) {
      userCalendars[userId] = [];
    }
    userCalendars[userId] = userCalendars[userId].concat(holidaysData);

    res.status(201).json({
      message: 'Holidays added to the user calendar',
      events: holidaysData,
    });
  } catch (error: unknown) {
    let errorMessage = 'Internal server error';
    let statusCode = 500;

    if (axios.isAxiosError(error)) {
      statusCode = error.response?.status || 500;
      errorMessage = (error.response?.data && (error.response.data as { message?: string }).message) || error.message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    res.status(statusCode).json({
      message: 'Error adding holidays to the calendar',
      events: [],
      error: errorMessage,
    });
  }
};
