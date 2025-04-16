import { body, ExpressValidator, query, validationResult } from 'express-validator'
import { AppDataSource } from "./data-source"
import { User } from "./entity/User"

const userRepo = AppDataSource.getRepository(User)

export const checkEmail = [
  body('email')
  .isEmail()
  .custom(async value => {
    const user = await userRepo.findOneBy({email: value})
    if (user) {
      throw new Error('E-mail already in use');
    }
    if (/^\d/.test(value))
    {
      throw new Error('Email cannot start with a number!');
    }
    if (/[A-Z]/.test(value))
    {
      throw new Error('Email cannot contain capital letters!');
    }
    if (/\s/.test(value))
    {
      throw new Error('Email cannot contain spaces!');
    }
  }),
]

export const checkfirstName = [
  body('firstName')
  .isLength({ min: 3 }).withMessage('First name must be at least 3 characters long')
  .notEmpty().withMessage('First name is required')
  .custom(async value => {
    if (/\s/.test(value)) {
      throw new Error('First name cannot contain spaces');
  }
  else if (/\d/.test(value))
    {
      throw new Error('Name cannot contain numbers!');
    }
})
]

export const checkLastName = [
  body('lastName')
  .custom(async value => {
    if (/\d/.test(value))
    {
      throw new Error('Name cannot contain numbers!');
    }
  })
]