var express = require('express');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
//var md5 = require('md5'); //md5 더이상 암호화로 안쓰임
//var salt = '#F$%gf4g4312'; //salt 값을 공통으로 쓰면 한개 풀리면 나머지도 똑같음
var sha256 = require('sha256');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: 'eklhajnzczima',
    resave: false,
    saveUninitialized: true,
    store: new FileStore()
}));

var users = [
    {
        username:'khjzzm',
        password:'863f0a4b60d4f03e39165f3e39607f9d48c34477f693759658761c8a4f8382de',
        salt:'2342@343#$$#', 
        dispalyName:'Kimhyunjin'
    },
    {
        username:'kim',
        password:'7aef168959983d39260b5d5e50545afe3b351861703da2fbb5d583b52389df39',
        salt:'!@#23fef234#',
        dispalyName:'sh'        
    }
];

app.get('/welcome', function(req, res){
    if(req.session.dispalyName){
        res.send(`
        <h1>hello, ${req.session.dispalyName}</h1>
        <a href="/auth/logout">logout</a>
        `);
    }else{
        res.send(`
            <h1>Welcome login please</h1>
            <p><a href="/auth/login">Login</a></p>
            <p><a href="/auth/register">register</a></p>
        `);
    }
    res.send(req.session);
});

app.get('/auth/login', function(req, res){
    var output = `
    <form action="/auth/login" method="post">
        <h1>login</h1>
        <p><input type="text" name="username" placeholder="username"></p>
        <p><input type="password" name="password" placeholder="password"></p>
        <p><input type="submit"></p>
    </form>
    `;
    res.send(output);
});
app.post('/auth/login', function(req, res){
    var uname = req.body.username;
    var pwd = req.body.password;
    for(var i=0; i<users.length; i++){
        var user = users[i];
        if(uname === user.username && sha256(pwd+user.salt) === user.password){
            req.session.dispalyName = user.dispalyName;
            return req.session.save(function(){
                res.redirect('/welcome');
            });
        }
    }
    res.send('who are you? <a href="/auth/login">login</a>');
});

app.get('/auth/logout', function(req, res){
    delete req.session.dispalyName;
    res.redirect('/welcome'); 
});

app.get('/auth/register', function(req, res){
    var output= `
    <form action="/auth/register" method="post">
        <h1>register</h1>
        <p><input type="text" name="username" placeholder="username"></p>
        <p><input type="password" name="password" placeholder="password"></p>
        <p><input type="text" name="dispalyName" placeholder="dispalyName"></p>
        <p><input type="submit"></p>
    </form>
    `;
    res.send(output); 
});
app.post('/auth/register', function(req, res){
    var user = {
        username:req.body.username,
        password:sha256(req.body.password),
        dispalyName:req.body.dispalyName        
    }
    users.push(user);
    req.session.dispalyName = req.body.dispalyName;
    req.session.save(function(){
        res.redirect('/welcome');
    });
});

app.listen(3003, function(){
   console.log('Connected 3003 port!!!') 
});
