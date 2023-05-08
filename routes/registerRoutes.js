const express = require("express");
const register = require("../models/registerModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = express.Router();

const hashFunction = (password="",rounds=5) => {
    return bcrypt.hashSync(password,rounds);
}

const checkPassword = (password="",hashedpassword="") => {
    return bcrypt.compareSync(password,hashedpassword);
}

router.post("/signup", (req,res)=>{
    const { name, userName, email, password, mobileNumber, role } = req.body;
    register.find({ email: email }).then((response)=>{
        if(response.length>0){
            return res.status(303).json({
                msg: "Account already exists",
                status: 303,
            });
        }else{
            const user = new register({
                name: name,
                userName: userName,
                email: email,
                password: hashFunction(password, 10),
                mobileNumber: mobileNumber,
                role: role,
            });
            user.save().then((response) => 
            res.status(200).json({
                success: true,
                msg: "User Created Successfully!!",
                status: 201,
            })).catch((e)=>
            res.status(406).json({
                error: e,
                msg: "Creating User Account Failure",
                status: 406
            })
            );
        }
    })
    .catch((e)=>
        response.status(201).json({
            error: e,
            msg: "User doesn't exists",
            status: 201
    })
    );
});  
  
router.post("/signin",(req,res,next)=>{
    const { email, password } = req.body;
    register.find({ email: email }).then((response)=>{
        if(response.length<1){
            return res.status(400).json({
                msg: "Account is missing",
                status: 400,
            });
        }else{
            if(!password || !checkPassword(password, response[0].password)){
                return res.status(403).json({
                    msg: "Incorrect Password",
                    status: 403
                });
            }else{
                let tokenData = {
                    email: response[0].email,
                    role: response[0].role,
                };
                let tokenOptions = {
                    expiresIn: "36hr",
                };
                const Token = jwt.sign(tokenData, process.env.SECRET_KEY, tokenOptions);
                return res.status(200).json({
                    success: true,
                    msg: "Login Successfully",
                    Token,
                    status: 200,
                });
            }
        }
    }).catch((e)=>{
        console.log(e);
    })
});

router.get('/getone/:userID', (req, res) => {
    try{
        register.findOne({_id: req.params.userID}, (err, data) => {
            if(err){
                return res.status(400).send({message: 'Error while retrieving an employee. Please check the data'})
            }

            res.status(200).send(data);
        })
    }catch(error){
        res.status(500).send({
            message: 'Internal Server Error'
        })
    }
});

router.post("/forgotpassword", (req,res,next)=>{
    const { email } = req.body;
    register.find({
        email: email,
    }).then((response)=>{
        if(response && response.length > 0){
            const userEmail = { 
                email: response[0].email, 
            };
            return res.status(200).json({
                success: true,
                data: userEmail,
                msg: "Account exists",
            });
        }else{
            return res.status(200).json({
                success: false,
                msg: "Account doesn't exists",
            })
        }
    }).catch((err)=>{
        console.log(err);
    })
});

router.post("/changepassword", (req,res,next)=>{
    const { email="", password="" } = req.body;
    try{
        register.updateOne({ email: email }, { password: hashFunction(password, 10), },
        (err,docs)=>{
            if(err){
                return res.status(400).json({
                    error: err,
                    msg: "Password couldn't be updated",
                });
            }else{
                return res.status(201).json({
                    success: true,
                    data: docs,
                    msg: "Password Updated Successfully!!!",
                })
            }
        }
        )
    }catch(err){
        console.log(err);
    }
});

module.exports = router;