import Debug from 'debug';
import _ from 'lodash';
import axios from 'axios';

const debug = Debug('cov::Telegram');

const url = 'https://api.telegram.org/bot';

export default class Telegram {
  private static instance: Telegram;

  private readonly token: string;

  private readonly chatId: string;

  private readonly ready: boolean = false;

  private constructor() {
    this.token = process.env.TELEGRAM_BOT_TOKEN || '';
    this.chatId = process.env.TELEGRAM_CHAT_ID || '';

    if (_.isEmpty(this.token) || _.isEmpty(this.chatId)) {
      debug('WARNING: Telegram Bot not initialized. Missing token or chatId.');
      debug('Telegram token:', this.token);
      debug('Telegram chat_id:', this.chatId);
    } else {
      debug('Telegram Bot initialized. OK.');
      this.ready = true;
    }
  }

  public static getInstance(): Telegram {
    if (!Telegram.instance) {
      Telegram.instance = new Telegram();
    }
    return Telegram.instance;
  }

  public sendMessage = async (text: string): Promise<boolean> => {
    if (!this.ready) {
      debug('Telegram Bot not initialized.');
      return false;
    }
    const res = await axios.post(`${url}${this.token}/sendMessage`,
      {
        /* eslint-disable @typescript-eslint/camelcase */
        chat_id: this.chatId,
        text,
      });
    return res.status === 200;
  }
}
