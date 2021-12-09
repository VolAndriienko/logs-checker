import express from 'express';
import { Express } from 'express';
import cors, { CorsOptions } from 'cors';
import indexRouter from './routes/index.route';

export default class Server {
  app!: Express;
  corsOptions: CorsOptions = {
    origin: process.env.ORIGIN || 'http://localhost:4200'
  };

  constructor() {
    this.app = express();
    this.configureApp();
    this.setRouting();
  }

  private configureApp() {
    this.app.use(cors(this.corsOptions));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    this.app.get('/', (_req, res) =>
      res.json({ message: 'Welcome to the application.' }));
  }

  private setRouting() {
    indexRouter(this.app);
  }

  public start = (port: number) => {
    return new Promise((resolve, reject) =>
      this.app
        .listen(port, () => resolve(port))
        .on('error', (err: any) => reject(err)));
  }
}
