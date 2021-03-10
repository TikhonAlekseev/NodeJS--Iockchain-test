const express = require('express')
const exphbs  = require('express-handlebars');
const fs = require("fs");
const os = require("os");
const path = require("path");
const session = require("express-session")
const { v4: uuidv4 } = require('uuid');
const User = require(path.join(__dirname,"user.js"))
const app = express()
const varMiddleware = require('./variables')

app.use(express.static('static'))
app.use(express.json());

app.use(session({
    secret:'some secret',
    resave:false,
    saveUninitialized:false
}))
app.use(varMiddleware)
app.use(express.urlencoded({ extended: false }))

app.get('/', (req,res)=>{
    res.sendFile(path.join(__dirname,'views','index.html'))
})
app.get('/user',(req,res)=>{
    res.render('user',{
        title:"Страница пользователя",
    })
})
app.get('/register', async (req,res)=>{
        const ip = req.ip
        const currentUser = await User.findUser(ip)
        if(currentUser == -1){
            const userID = uuidv4()
            const newUser = new User(ip,userID)
            newUser.save()
            res.send(JSON.stringify( {key: userID,createdUser:false}))
        
        }else{
            res.send({createdUser:true})
        }
})
app.get('/info' , async (req , res) =>{
    const balance = await User.getBalance(req.ip)
    res.end(JSON.stringify(balance))
})

app.post('/login', async (req,res) => {
    const currentUser = await User.findUser(req.ip)
    if(currentUser.key === req.body.key){
        req.session.isAuthenticated = true
        res.send({login:true})
    }
    else{
        res.send({login:false})
    }
 })

app.post('/faucet' , async (req , res) =>{
    console.log(req.body)
    User.addAmount(req.ip,req.body.key)
    res.end()
})

const PORT = process.env.PORT || 3000

app.listen(PORT , () =>{
    console.log("Server is running")
})