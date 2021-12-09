import { Express, Router } from 'express';
import * as index from '../controllers/index.controller';

const router = (app: Express) => {
  const indexRouter: Router = Router();
  indexRouter.get('/', index.get);

  app.use('/api', indexRouter);
};

export default router;