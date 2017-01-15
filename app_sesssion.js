var express = require('express');
var session = require('express-session');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
    secret: 'eklhajnzczima',
    resave: false,
    saveUninitialized: true
}));

app.get('/count', function(req, res){
    if(req.session.count ){
        req.session.count++;
    }else{
        req.session.count = 1;
    }
    res.send('count : ' + req.session.count); 
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

app.get('/auth/logout', function(req, res){
    delete req.session.dispalyName;
    res.redirect('/welcome'); 
});

app.get('/welcome', function(req, res){
    if(req.session.dispalyName){
        res.send(`
        <h1>hello, ${req.session.dispalyName}</h1>
        <a href="/auth/logout">logout</a>
        `);
    }else{
        res.send(`
            <h1>Welcome login please</h1>
            <a href="/auth/login">Login</a>
        `);
    }
    res.send(req.session);
});

app.post('/auth/login', function(req, res){
    var user = {
        username:'khjzzm',
        password:'111',
        dispalyName:'Kimhyunjin'
    };
    var uname = req.body.username;
    var pwd = req.body.password;
    if(uname === user.username && pwd === user.password){
        req.session.dispalyName = user.dispalyName;
        res.redirect('/welcome');
    }else{
        res.send('who are you? <a href="/auth/login">login</a>');
    }
    
    res.send(uname); 
});

app.listen(3003, function(){
   console.log('Connected 3003 port!!!') 
});
