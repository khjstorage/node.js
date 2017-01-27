var express = require('express');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var bodyParser = require('body-parser');

var bkfd2Password = require("pbkdf2-password");
var hasher = bkfd2Password();

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: 'eklhajnzczima',
    resave: false,
    saveUninitialized: true,
    store:new FileStore()
}));
app.use(passport.initialize());
app.use(passport.session()); //로그인 세션을 쓰겠다 앞에서 세션 미들웨어를 설정하고 써야함

app.get('/auth/logout', function(req, res){
    req.logout();
    req.session.save(function(){
        res.redirect('/welcome');
    });    
});

app.get('/welcome', function(req, res){
    if(req.user && req.user.dispalyName){
        res.send(`
        <h1>hello, ${req.user.dispalyName}</h1>
        <a href="/auth/logout">logout</a>
        `);
    }else{
        res.send(`
            <h1>Welcome login please</h1>
            <p><a href="/auth/login">Login</a></p>
            <p><a href="/auth/register">register</a></p>
        `);
    }
});

passport.serializeUser(function(user, done) {
    console.log('serializeUser', user);
    done(null, user.username); //세션에 user.usernmame을 저장 딱 한번 user.username이 deserializeUser 첫번쨰 인자로 전달
});

passport.deserializeUser(function(id, done) { //페이지가 열릴 때마다 호출
    console.log('deserializeUser', id);
    for(var i=0; i<users.length; i++){
        var user = users[i];
        if(user.username === id){
            return done(null, user); //req.user 패스포트에 의해서 추가
        }
    }
});

passport.use(new LocalStrategy(
    function(username, password, done){
        var uname = username;
        var pwd = password;
        for(var i=0; i<users.length; i++){
            var user = users[i];
            if(uname === user.username){
                return hasher({password:pwd, salt:user.salt}, function(err, pass, salt, hash){
                    if(hash === user.password){
                        console.log('LocalStrategy', user);
                        done(null, user); //  (2번째인자 user가 serializeUser user넘어감)
                    } else {
                        done(null, false);
                    }
                }); 
            }
        }
        done(null, false);
        //res.send('who are you? <a href="/auth/login">login</a>');        
    }
));

app.post(
    '/auth/login',
    passport.authenticate(
        'local',
        {
            //successRedirect: '/welcome', // 해당 코드를 주석으로 처리하면 아래의 fuction이 호출됨
            failureRedirect: '/auth/login', 
            failureFlash: false
        }
    ),  function(req, res) { // 해당 function이 호출되고 나서 session을 save해주는 로직을 해주고 처리함.
            req.session.save(function(){
                res.redirect('/welcome');
            });
        }
);



var users = [
    {
        username:'khjzzm',
        password:'xqiKW7JGzqh7O0LNBy3zhb0Rm80CAg0A0Uz+Vz0u6O4Ia3gGxNYKcog7l41QkIyfP2axJxp2QtaP5vU67KHoUTJjF+GjPyHCdwy6b+HJLJ04PmKara33gXf9SRP4ox3+HhlJSjhae1GYIiPRiZwq5oKtujaO0iSdssOC/QyFBJA=', //111
        salt:'KtsfxSLrOnz1sYp95H/GMDVJCbM9w5jfsCfMjBLb51jvKolgh9R/5nKJNH38uCwLGrjvTYKxL9WeOQd+GSpMEw==', 
        dispalyName:'Kimhyunjin'
    }
];

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
        req.login(user, function(ree){
            req.session.save(function(){
                res.redirect('/welcome');
            });
        });
    });
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

app.listen(3003, function(){
   console.log('Connected 3003 port!!!') 
});
