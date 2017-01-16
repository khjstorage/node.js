var express = require('express');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var md5 = require('md5')
var salt = '#F$%gf4g4312';
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
        password:'450dd90d26b7f8c3084d2be02fda28c9',
        //salt:'',
        dispalyName:'Kimhyunjin'
    },
    {
        username:'kim',
        password:'897366bbd3209f23fb7e4d692be17b7f',
        //salt:'',
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
        if(uname === user.username && md5(pwd+salt) === user.password){
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
        password:md5(req.body.password+salt),
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
