require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require('mongoose-encryption')

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
    email:String,
    password:String
})

const secret = process.env.SECRET_KEY;
userSchema.plugin(encrypt, { secret: secret,encryptedFields:["password"] });

const User = mongoose.model("User",userSchema);
const app = express();

app.use(express.static("public"));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){
    res.render("home");
})

app.get("/login",function(req,res){
    res.render("login");
})

app.get("/register",function(req,res){
    res.render("register");
})

app.post("/register",function(req,res){
    const user = new User({email:req.body.username,password:req.body.password});
    user.save();
    //console.log(req.body.password,req.body.username);
    res.render("secrets");
})

app.post("/login",function(req,res){
    const uname = req.body.username;
    const pass =  req.body.password;
    User.find({email:uname}).then(function(users,err){
        if(err){
            console.log(err);
        }
        if(users.length === 0){
            res.render("login");
        }
        if(users[0].password===pass){
            res.render("secrets");
        }
    })  
})


app.listen(3000,function(){
    console.log("server running");
})


