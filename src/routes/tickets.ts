import express, { Request, Response } from 'express';
import Ticket from '../models/Ticket';
import { generateQRCode } from '../utils/qrcode';
import { authenticate } from '../middlewares/auth';
import checkScopes from "../middlewares/checkScopes";
import checkLoggedIn from "../middlewares/checkLoggedIn";
import dotenv from "dotenv";

const router = express.Router();
dotenv.config();

// POST /tickets/generate
// @ts-ignore
router.post('/generate', authenticate, checkScopes(['create:ticket']),async (req: Request, res: Response) => {
    const { vatin, firstName, lastName } = req.body;

    if (!vatin || !firstName || !lastName) {
        res.status(400).json({ error: 'Nedostaju podaci (vatin, firstName, lastName)' });
        return;
    }

    try {
        const ticketCount = await Ticket.count({ where: { vatin } });

        if (ticketCount >= 3) {
            res.status(400).json({ error: 'Dosegnut maksimalan broj ulaznica za ovaj OIB' });
            return;
        }

        const ticket = await Ticket.create({ vatin, firstName, lastName });

        const ticketURL = `${process.env.HOST_URL}/tickets/${ticket.id}`;
        const qrCodeImage = await generateQRCode(ticketURL);

        res.setHeader('Content-Type', 'image/png');
        res.send(qrCodeImage);
    } catch (error) {
        res.status(500).json({ error: 'Greška na serveru pri generiranju ulaznice.' });
    }
});

// GET /tickets/:id - Prikazuje detalje ulaznice, dostupno samo prijavljenim korisnicima
// @ts-ignore
router.get('/:id', checkLoggedIn, async (req: Request, res: Response) => {
    const { id } = req.params;

    const user = req.user as any;

    try {
        const ticket = await Ticket.findByPk(id);

        if (!ticket) {
            return res.status(404).json({ error: 'Ulaznica nije pronađena.' });
        }

        // Prikaz podataka o ulaznici
        res.render('ticketDetails', {
            ticket,
            user: user?.displayName || user?.name || 'Nepoznat korisnik',
        });
    } catch (error) {
        res.status(500).json({ error: 'Greška na serveru pri dohvaćanju ulaznice.' });
    }
});

export default router;
