const express = require("express");
import { AppDataSource } from "./data-source"
import {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    signup, 
    signin
} from "./controller/UserController"
import { validation, checkSignin } from "./validation";
import { protect } from "./authentication";
const app = express()
app.use(express.json())

const bodyParser = require('body-parser');
app.use(bodyParser.json());


app.get("/users", protect, getAllUsers)
app.get("/users/:id", protect, getUserById)
app.post("/users", validation, protect, createUser)
app.put("/users/:id", validation, protect, updateUser)
app.delete("/users/:id", protect, deleteUser)

app.post("/signup", validation, signup)
app.post("/signin", checkSignin, signin)

AppDataSource.initialize().then(() => {
    app.listen(50000, '127.0.0.1', () => console.log("Server running at http://localhost:50000/users"))
}).catch((error) => {
    console.error("Error during Data Source initialization:", error);
});
