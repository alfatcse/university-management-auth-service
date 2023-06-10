import express, { Application } from 'express';
import cors from 'cors';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import routes from './app/routes';
const app: Application = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/v1', routes);
// app.use('/api/v1/users', UserRoute);
// app.use('/api/v1/academic-semesters', AcademicSemesterRoute);
//Testing
// app.get('/', async (req: Request, res: Response, next: NextFunction) => {
//   throw new Error('Testing error logger')
// })
app.get('/', async (req, res) => {
  res.send('server is running');
});
app.use(globalErrorHandler);
export default app;
