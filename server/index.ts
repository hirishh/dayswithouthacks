import express, { Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';
import api from './routes';

const configureApi = (app: Express) => {
  app.use(helmet());

  if (process.env.NODE_ENV === 'development') {
    app.use(cors());
    app.use(express.static('public'));
  }

  // LND ( proxy -> hirishApi)
  app.use('/api/lnd', createProxyMiddleware({
    target: 'http://localhost:3080',
    changeOrigin: true,
    ws: true,
    logLevel: 'debug',
    onProxyReq: (proxyReq) => {
      proxyReq.setHeader('Connection', 'keep-alive');
    },
  }));

  app.use(express.json());
  app.use('/api', api);

};

export default configureApi;
