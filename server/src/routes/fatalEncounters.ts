import { Router } from 'express';
import fatalService from '../services/fatalService';

const router = Router();

router.get('/', async (req: any, res: any) => {
  try {
    await fatalService.init();
    const data: any[] = fatalService.getFatalEncountersData();
    res.json(data);
  } catch (e) {
    console.log(e);
    res.sendStatus(404);
  }
});

export const fatalEncounters = router;