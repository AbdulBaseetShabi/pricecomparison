// const http =  require('http');
const express = require('express'); 
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

var port = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function (req,res,next){
    console.log(`${req.method} ${req.path}`);
    next();
})

app.use('/static', express.static(path.join(__dirname,'www')));

function sendHTML(res, htmlFilePath){
    return res.sendFile(__dirname + '/www/' + htmlFilePath);
}

//GET
app.get('/', function (req,res) {
    sendHTML(res, 'index.html');
});

app.get('/login', function (req,res) {
    sendHTML(res, 'login.html');
});

app.get('/signup', function (req,res) {
    sendHTML(res, 'signup.html');
});

app.get('/profile', function (req,res) {
    sendHTML(res, 'profile.html');
});

app.get('/notification', function (req,res) {
    sendHTML(res, 'notification.html');
});

app.get('/saved', function (req,res) {
    sendHTML(res, 'saved.html');
});

app.get('/search', function (req,res){
    sendHTML(res, 'search.html');
})

app.listen(port, ()=>{
    console.log(`The server is running in on port ${port}`);
})

app.get('*', function(req,res){
    res.status(404).send('<h1 style="text-align:center;font-size: 200px;margin:0;margin-top:10%;">404</h1>' +
    '<p style="text-align:center;margin:0;font-size:50px;">Page not found</p>' + 
    '<p style="text-align:center;font-size: 20px;">Fix: Check your address bar to ensure you entered the right url');
});

