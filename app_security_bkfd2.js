var express = require('express');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var bkfd2Password = require("pbkdf2-password");
var hasher = bkfd2Password();
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
        username:'khjzzm',       password:'xqiKW7JGzqh7O0LNBy3zhb0Rm80CAg0A0Uz+Vz0u6O4Ia3gGxNYKcog7l41QkIyfP2axJxp2QtaP5vU67KHoUTJjF+GjPyHCdwy6b+HJLJ04PmKara33gXf9SRP4ox3+HhlJSjhae1GYIiPRiZwq5oKtujaO0iSdssOC/QyFBJA=', //111
        salt:'KtsfxSLrOnz1sYp95H/GMDVJCbM9w5jfsCfMjBLb51jvKolgh9R/5nKJNH38uCwLGrjvTYKxL9WeOQd+GSpMEw==', 
        dispalyName:'Kimhyunjin'
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
        if(uname === user.username){
            return hasher({password:pwd, salt:user.salt}, function(err, pass, salt, hash){
                if(hash === user.password){
                    req.session.dispalyName = user.dispalyName;
                    req.session.save(function(){
                        res.redirect('/welcome');
                    })
                } else {
                    res.send('who are you? <a href="/auth/login">login</a>');
                }
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
    hasher({password:req.body.password}, function(err, pass, salt, hash){
        var user = {
            username:req.body.username,
            password:hash,
            salt:salt,
            dispalyName:req.body.dispalyName        
        };
        users.push(user);
        //res.send(users);
        req.session.dispalyName = req.body.dispalyName;
        req.session.save(function(){
            res.redirect('/welcome');
        });
    });

});

app.listen(3003, function(){
   console.log('Connected 3003 port!!!') 
});
