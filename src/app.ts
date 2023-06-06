import express, { Application } from 'express';
import { UserRoute } from './app/modules/user/user.route';
import cors from 'cors';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
const app: Application = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/v1/users', UserRoute);
//Testing
// app.get('/', async (req: Request, res: Response, next: NextFunction) => {
//   throw new Error('Testing error logger')
// })
app.get('/', async (req, res) => {
  res.send('server is running');
});
app.use(globalErrorHandler);
export default app;
