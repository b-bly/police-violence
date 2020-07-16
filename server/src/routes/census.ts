import { Router } from 'express';
import censusService from '../services/censusService';

const router = Router();

router.get('/county', async (req: any, res: any) => {
  try {
    await censusService.init();
    const data: any[] = censusService.censusCountyData;
    res.json(data);
  } catch (e) {
    console.log(e);
    res.sendStatus(502);
  }
});

router.get('/state', async (req: any, res: any) => {
  try {
    await censusService.init();
    const data: any[] = censusService.censusStateData;
    res.json(data);
  } catch (e) {
    console.log(e);
    res.sendStatus(502);
  }
});

export const census = router;