import express, { Request, Response } from 'express';
import Ticket from '../models/Ticket';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const ticketCount = await Ticket.count();
    res.render('index', {
      ticketCount,
    });
  } catch (error) {
    res.status(500).send('Greška na serveru pri dohvaćanju broja ulaznica.');
  }
});

export default router;
