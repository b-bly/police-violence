import { Router } from 'express';
import censusService from '../services/censusService';

const router = Router();

router.get('/county', async (req: any, res: any) => {
  console.log('get county')
  try {
    await censusService.init();
    let data: any[] = censusService.getCensusRaceDataByCounty();
    res.json(data);
  } catch (e) {
    console.log(e);
    res.sendStatus(404);
  }
});

router.get('/state', async (req: any, res: any) => {
  res.send(501);
  throw new Error('not implemented');
});

export const census = router;