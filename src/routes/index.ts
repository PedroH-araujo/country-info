import express from 'express';
import { getAvailableCountries } from '../controllers/countriesController';
import { getCountryInfo } from '../controllers/countryInfoController';
import { addHolidaysToCalendar } from '../controllers/calendarController';

const router = express.Router();

router.get('/countries', getAvailableCountries);
router.get('/country-info/:countryCode', getCountryInfo);
router.post('/users/:userId/calendar/holidays', addHolidaysToCalendar);

export default router;
