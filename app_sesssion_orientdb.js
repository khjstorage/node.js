var express = require('express');
var session = require('express-session');
var OrientoStore = require('connect-oriento')(session);
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: 'eklhajnzczima',
    resave: false,
    saveUninitialized: true,
    store: new OrientoStore({
        server:'host=localhost&port=2424&username=root&password=910509&db=o2'
    })
}));

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
    req.session.save(function(){
        res.redirect('/welcome');    
    });
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
        req.session.save(function(){
            res.redirect('/welcome');    
        });
    }else{
        res.send('who are you? <a href="/auth/login">login</a>');
    }
});

app.listen(3003, function(){
   console.log('Connected 3003 port!!!') 
});
