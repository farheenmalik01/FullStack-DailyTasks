import { Request, Response } from "express"
import { AppDataSource } from "../data-source"
import { User } from "../entity/User"

const userRepo = AppDataSource.getRepository(User)

export const getAllUsers = async (req: Request, res: Response) => {
    const users = await userRepo.find()
    res.json(users)
}

export const getUserById = async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const user = await userRepo.findOneBy({ id })
    res.json(user)
}

export const createUser = async (req: Request, res: Response) => {
    const newUser = userRepo.create(req.body)
    const savedUser = await userRepo.save(newUser)
    res.json(savedUser)
}

export const updateUser = async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const user = await userRepo.findOneBy({ id })

    userRepo.merge(user, req.body)
    const updatedUser = await userRepo.save(user)
    res.json(updatedUser)
}

export const deleteUser = async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const user = await userRepo.findOneBy({ id })

    await userRepo.remove(user)
    res.send("User deleted")
}
