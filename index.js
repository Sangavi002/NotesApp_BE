const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const connection = require("./config/db");
const userRouter = require("./route/user.route")
const notesrouter = require("./route/note.route")

const cors = require("cors")

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" }))

app.use("/user",userRouter)
app.use("/content",notesrouter)

app.get("/",(req,res) => {
    res.status(200).send({"msg": "Health check"})
})

app.listen(port,async() => {
    try{
        await connection;
        console.log(`Server is running on port ${port} and db is connected`)
    }catch(err){
        console.log(err.msg)
    }
})