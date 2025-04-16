const express = require("express");
import { AppDataSource } from "./data-source"
import {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
} from "./controller/UserController"
import { checkEmail, checkfirstName, checkLastName } from "./validation";
import { validationResult } from 'express-validator';

const app = express()
app.use(express.json())

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

app.get("/users", validate, getAllUsers)
app.get("/users/:id", getUserById)
app.post("/users", checkEmail, checkfirstName, checkLastName, validate, createUser)
app.put("/users/:id", checkEmail, checkfirstName, checkLastName, validate, updateUser)
app.delete("/users/:id", deleteUser)

AppDataSource.initialize().then(() => {
    app.listen(50000, '127.0.0.1', () => console.log("Server running at http://localhost:50000/users"))
}).catch((error) => {
    console.error("Error during Data Source initialization:", error);
});
