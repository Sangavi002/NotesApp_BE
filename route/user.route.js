const express = require("express");
const UserModel = require("../model/user.model")
const userRouter = express.Router();
const bcryptjs = require('bcryptjs');
const jwt = require("jsonwebtoken")


userRouter.post("/register", async (req, res) => {
    const { username, password,role } = req.body;
    try {
        const existingUser = await UserModel.findOne({ username });
        if (existingUser) {
            return res.status(400).send({ "msg": "Username already exists." });
        }
        bcryptjs.hash(password, 10, async (err, hash) => {
            if (err) {
                res.status(500).send({ "msg": "Something went wrong." });
            } else {
                const user = new UserModel({ username, password: hash, role });
                await user.save();
                res.status(200).send({ "msg": "Successfully Signed In." });
            }
        })
    } catch (err) {
        res.status(500).send({ "msg": "Failed to Signed In." });
    }
});

userRouter.post("/login",async(req,res) => {
    const {username,password} = req.body;
    try{
        const user = await UserModel.findOne({username})
        if(user){
            bcryptjs.compare(password,user.password,async(err,result) => {
                if(err){
                    res.status(500).send({"msg": "Something went wrong."});
                }if(result){
                    let token = jwt.sign({id: user._id},process.env.JWT_SECRET)
                    res.status(200).send({"msg":"Logged In successfully.","Token": token,"UserId":user._id});
                }else{
                    res.status(404).send({"msg": "Wrong password."});
                }
            })
        }else{
            res.status(404).send({"msg": "Wrong crendentails."})
        }
    }catch(err){
        res.status(404).send({"msg": "Error in login."});
    }
})

module.exports = userRouter