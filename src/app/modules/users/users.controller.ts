import { RequestHandler } from 'express'
import usersService from './users.service'
const createdUser: RequestHandler = async (req, res, next) => {
  try {
    const { user } = req.body
    const result = await usersService.createUser(user)
    res.status(200).json({
      success: true,
      message: 'User created Successfully!',
      data: result,
    })
  } catch (err) {
    next(err)
  }
}
export default { createdUser }
