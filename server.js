const express = require("express");
const app = express();
const cors = require("cors");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");

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

   function checkLogin(req,res,next){
    if(req.cookies.username){
        //res.sendFile(__dirname+"/home.html")
        next()
    }else{
        res.sendFile(__dirname + "/login.html")
    }
    
   }
app.get("/", (req, res) => {
    if(req.cookies.username){
        res.sendFile(__dirname+"/home.html")
    }else{
        res.sendFile(__dirname + "/login.html");
    }
  
});

app.get("/aboutus", checkLogin, (req, res) => {
  console.log('aboutus:',req.cookies)
  res.sendFile(__dirname + "/aboutus.html");
});

app.get("/careers", (req, res) => {
  res.sendFile(__dirname + "/careers.html");
});

app.get("/products",checkLogin, (req, res) => {
  console.log('products:',req.cookies)
  res.sendFile(__dirname + "/products.html");
});

app.get("/old-insta.jpg", (req, res) => {
  res.sendFile(__dirname + "/old-insta.jpg");
});

app.get("/login", (req, res) => {
    //   res.cookie('username',req.query.username)
    //   res.cookie('password',req.query.password)
    console.log(req.query)
    var x = users.some((user) => {
        if(user.username === req.query.username && user.password === req.query.password){
            return true
        }
    })
    if(x){
        res.cookie('username',req.query.username)
        res.cookie('password',req.query.password)
        res.sendFile(__dirname+"/home.html")

    }else{
        res.sendFile(__dirname+"/error.html")
    }
  //res.sendFile(__dirname + "/login.html");

  //res.sendFile(__dirname+"/home.html")

  //res.sendFile(__dirname+"/error.html")
});

app.get('/logout',(req,res) => {
    res.clearCookie('username')
    res.clearCookie('password')
    console.log(req.cookies)
    //res.send(`logout button clicked`)
    res.sendFile(__dirname + "/login.html");
})
const port = 3500;

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
