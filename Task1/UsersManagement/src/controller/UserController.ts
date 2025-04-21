import { Request, Response } from "express"
import { AppDataSource } from "../data-source"
import { User } from "../entity/User"
import * as bcrypt from 'bcrypt'
import { validationResult } from "express-validator"
import jwt from "jsonwebtoken";

const SECRET = "farheen";

const jwt = require("jsonwebtoken");

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

export const getUserByEmail = async (req: Request, res: Response) => {
    const email = String(req.params.email)
    const user = await userRepo.findOneBy({ email })
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

const saltRounds = 10

export const signup = async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { firstName, lastName, age, email, password } = req.body;
        
        const existingUser = await userRepo.findOneBy({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        const newUser = userRepo.create({
            firstName,
            lastName,
            age,
            email,
            password: hashedPassword
        });
        
        const savedUser = await userRepo.save(newUser);
        
        const { password: _, ...userWithoutPassword } = savedUser;
        res.status(201).json(userWithoutPassword);
        
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const signin = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await userRepo.findOneBy({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const { password: _, ...userWithoutPassword } = user;
        
        const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: "1h" });

        res.status(200).json({
            message: 'Signin successful', token,
            user: userWithoutPassword
        });


    } catch (error) {
        console.error('Signin error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
