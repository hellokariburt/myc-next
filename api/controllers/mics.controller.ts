import express from 'express';
import { getMics, getMic, getMicTimes, getMicHost } from '../services/mis.service';

const router = express.Router();

// Parameter handling function
const parseParams = (req: any) => {
  const { borough } = req.query;
  let boroughArray = borough ? borough.split(',') : [];

  if (borough === 'all') {
    boroughArray = ['manhattan', 'queens', 'staten-island', 'bronx', 'brooklyn'];
  }

  const { day } = req.query;
  let dayArray = day ? day.split(',') : [];

  if (day === 'all') {
    dayArray = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  }

  return {
    day: dayArray,
    borough: boroughArray,
    limit: Number(req.query.limit) || 10,
    offset: Number(req.query.offset) || 0,
    start_time: req.query['start-time'] || '00:00:00',
    cost: req.query.free || 'false',
  };
};

// Route handlers
const micsController = router.get('/mics', async (req, res, next) => {
  try {
    const params = parseParams(req);
    const { mics, count } = await getMics(params);
    res.status(200).json({
      totalMics: count,
      offset: params.offset,
      limit: params.limit,
      mics,
    });
  } catch (error) {
    next(error);
  }
});

const micController = router.get('/mic', async (req, res, next) => {
  try {
    const { id } = req.query;
    const mic = await getMic(Number(id));
    res.status(200).json({ mic });
  } catch (error) {
    next(error);
  }
});

const micHostController = router.get('/micHost', async (req, res, next) => {
  try {
    const { id } = req.query;
    const mic = await getMicHost(Number(id));
    res.status(200).json({ mic });
  } catch (error) {
    next(error);
  }
});

const micTimesController = router.get('/micTimes', async (req, res, next) => {
  try {
    const params = parseParams(req);
    const { mics, count } = await getMicTimes(params);
    res.status(200).json({
      totalMics: count,
      offset: params.offset,
      limit: params.limit,
      mics,
    });
  } catch (error) {
    next(error);
  }
});

export { micController, micsController, micTimesController, micHostController };
