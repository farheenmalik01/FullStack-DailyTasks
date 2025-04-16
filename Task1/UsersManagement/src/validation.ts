import { body, query, validationResult } from 'express-validator'
import { Request, Response } from "express"
import { AppDataSource } from "./data-source"
import { User } from "./entity/User"
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserByEmail,
} from "./controller/UserController"

const userRepo = AppDataSource.getRepository(User)

export const checkEmail = [
  body('email').isEmail().custom(async value => {
    const user = await userRepo.findOneBy({email: value})
    if (user) {
      throw new Error('E-mail already in use');
    }
  }),
]