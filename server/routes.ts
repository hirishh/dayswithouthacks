import express from 'express';
import Debug from 'debug';
import Telegram from './telegram';

const debug = Debug('svr::router');

class Routes {
  public express: express.Application;

  constructor() {
    this.express = express();
    this.routes();
  }

  private routes(): void {
    // Telegram Send contact
    this.express.post('/contact', async (req, res) => {
      let error: string;
      let sent = false;
      if (!req.body) {
        error = 'Missing Body.';
      } else {
        debug('CONTACT POST', `${req.body}`);
        const textMessage = 'Porcodio nuovo messaggio da DaysWithoutHacks.LOL.\n'
        + 'Che cazzo vogliono?\n'
        + '----------------\n'
        + `Name: ${req.body.name}\n`
        + `Email: ${req.body.email}\n`
        + `Subject: ${req.body.subject}\n`
        + '----------------\n'
        + `${req.body.message}\n`
        + '----------------';
        sent = await Telegram.getInstance().sendMessage(textMessage);
      }
      res.json({ sent, error: error || null });
    });

    // Telegram Send Donation Notif
    this.express.post('/donation', async (req, res) => {
      let error: string;
      let sent = false;
      if (!req.body) {
        error = 'Missing Body.';
      } else {
        debug('DONATION POST', `${req.body}`);
        const textMessage = 'Porcodio! Porcodio! Incredibile! Donazione per DaysWithoutHacks.LOL\n'
        + '----------------\n'
        + `Satoshis: ${req.body.value}\n`
        + `Memo: ${req.body.memo}\n`
        + '----------------\n'
        + 'Evviva la Madonna Puttana!';
        sent = await Telegram.getInstance().sendMessage(textMessage);
      }
      res.json({ sent, error: error || null });
    });
  }
}

export default new Routes().express;
