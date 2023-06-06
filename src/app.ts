import express, { Application } from 'express'
import userRouter from './app/modules/users/user.route'
import cors from 'cors'
import globalErrorHandler from './app/middlewares/globalErrorHandler'
const app: Application = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/api/v1/users', userRouter)
// app.get('/', (req: Request, res: Response, next: NextFunction) => {
//   next('ore Error')
// })
app.use(globalErrorHandler)
export default app
