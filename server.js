const express = require("express");
const app = express();
const cors = require("cors");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
//var session = require('express-session')
var jwt = require('jsonwebtoken');

var users = [
    {
        username:'vissu',
        password:'123'
    },
    {
        username:'rohith',
        password:'456'
    },
]

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
app.options("*", cors());
app.use(cookieParser());
// app.use(session({
//     secret: 'keyboard cat',
//     resave: false,
//     saveUninitialized: true,
//     cookie: { maxAge: 60000 }
//   }))

function checkLogin(req, res, next) {
    const token = req.cookies.token;
    if (token) {
      jwt.verify(token, 'shhhhh', (err, decoded) => {
        if (err) {
          // Token is invalid or expired, redirect to login
          return res.sendFile(__dirname + "/login.html");
        } else {
          // Token is valid, proceed to the requested route
          req.username = decoded.username; // store the username in the request object
          req.token = token; // store the token in the request object
          next(); // call the next middleware or route handler
        }
      });
    } else {
      // No token found, redirect to login
      res.sendFile(__dirname + "/login.html");
    }
  }
app.get("/", (req, res) => {
    if(req.cookies.token){
        res.sendFile(__dirname+"/home.html")
    }else{
        res.sendFile(__dirname + "/login.html");
    }
  
});

app.get("/aboutus", checkLogin, (req, res) => {
  console.log('aboutus:',req.cookies.token)
  res.sendFile(__dirname + "/aboutus.html");
});

app.get("/careers", (req, res) => {
  res.sendFile(__dirname + "/careers.html");
});

app.get("/products",checkLogin, (req, res) => {
  console.log('products:',req.cookies.token)
  res.sendFile(__dirname + "/products.html");
});

app.get("/old-insta.jpg", (req, res) => {
  res.sendFile(__dirname + "/old-insta.jpg");
});

app.get("/login", (req, res) => {
    
    //   res.cookie('username',req.query.username)
    //   res.cookie('password',req.query.password)
    console.log('login',req.query)
    var x = users.some((user) => {
        if(user.username === req.query.username && user.password === req.query.password){
            return true
        }
    })
    if(x){
        // res.cookie('username',req.query.username)
        // res.cookie('password',req.query.password)
        // req.session.username = req.query.username;
        // req.session.password = req.query.password;
        var token = jwt.sign({ username:req.query.username,password:req.query.password }, 'shhhhh');
        console.log('token',token)
        res.cookie('token', token, { httpOnly: true });


        res.sendFile(__dirname+"/home.html")

    }else{
        res.sendFile(__dirname+"/error.html")
    }
  //res.sendFile(__dirname + "/login.html");

  //res.sendFile(__dirname+"/home.html")

  //res.sendFile(__dirname+"/error.html")
});

app.get('/logout',(req,res) => {
    // res.clearCookie('username')
    // res.clearCookie('password')
    //req.session.destroy()
    res.clearCookie('token')
    console.log('logout',req.cookies.token)
    //res.send(`logout button clicked`)
    res.sendFile(__dirname + "/login.html");
})
const port = 3500;

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
