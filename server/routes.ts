import express from 'express';
import Debug from 'debug';
import Telegram from './telegram';

const router = express.Router();
const debug = Debug('svr::router');

class Routes {
  public express: express.Application;

  constructor() {
    this.express = express();
    this.routes();
  }

  private routes(): void {
    // Telegram
    this.express.post('/contact', async (req, res) => {
      let error;
      let sent = false;
      if (!req.body.message) {
        error = 'Missing Message.';
      } else {
        debug('CONTACT POST', `${req.body.message}`);
        sent = await Telegram.getInstance().sendMessage(req.body.message);
      }
      res.json({ sent, error: error || null });
    });
  }
}

export default new Routes().express;
