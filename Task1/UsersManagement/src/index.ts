const express = require("express");
import { AppDataSource } from "./data-source"
import {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
} from "./controller/UserController"

const app = express()
app.use(express.json())

const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.get("/users", getAllUsers)
app.get("/users/:id", getUserById)
app.post("/users", createUser)
app.put("/users/:id", updateUser)
app.delete("/users/:id", deleteUser)

AppDataSource.initialize().then(() => {
    app.listen(3000, () => console.log("Server running at http://localhost:3000/users"))
})
