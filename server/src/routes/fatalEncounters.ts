import { Router } from 'express';
import fatalService from '../services/fatalService';

const router = Router();

router.get('/', async (req: any, res: any) => {
  try {
    await fatalService.init();
    let data: any[] = fatalService.getFatalEncountersData();
    console.log(data);
    res.json(data);
  } catch (e) {
    console.log(e);
    res.sendStatus(404);
  }
});

export const fatalEncounters = router;