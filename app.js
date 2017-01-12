var express = require('express');
var app = express();

//bady-parser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

//jade
app.set('view engine', 'jade');
app.set('views', './views');
app.locals.pretty = true;

//정적인 파일이 위치할 디렉토리를 지정할 기능
app.use(express.static('public'));


app.get('/form', function(req, res){
   res.render('form', {time:Date()}) 
});

app.post('/form_receiver', function(req, res){
    var title = req.body.title;
    var description = req.body.description;
    res.send(title+','+description);
})

app.get('/form_receiver', function(req, res){
    var title = req.query.title;
    var description = req.query.description;
    res.send(title+','+description);
})

app.get('/topic', function(req, res){
    var topics = [
        'javascript is...',
        'Nodejs is...',
        'Express is...',
    ]
    var output = `
        <a href="/topic?id=0">javascript</a><br>
        <a href="/topic?id=1">Nodejs</a><br>
        <a href="/topic?id=2">Express</a><br><br>
        ${topics[req.query.id]}
    `
    res.send(output);
})

app.get('/topic2/:name', function(req, res){
    var topics = [
        'javascript is...2',
        'Nodejs is...2',
        'Express is...2',
    ]
    var output = `
        <a href="/topic2/0">javascript</a><br>
        <a href="/topic2/1">Nodejs</a><br>
        <a href="/topic2/2">Express</a><br><br>
        ${topics[req.params.name]}
    `
    res.send(output);
})

app.get('/template', function(req,res){
    res.render('temp', {time:Date(), title:'Jade'});
})

app.get('/',function(req, res){
    res.send('Hello home page~!');
});

app.get('/route', function(req, res){
    res.send('Hello Router, <img src="/seoul.jpg">')
})

app.get('/dynamic', function(req, res){
  var lis = '';
  for(var i=0; i<5; i++){
    lis = lis + '<li>coding</li>';
  }
  var time = Date();
  var output = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <title></title>
    </head>
    <body>
        Hello, Dynamic!
        <ul>
          ${lis}
        </ul>
        ${time}
    </body>
  </html>`;
  res.send(output);
});


app.listen(3000, function(){
    console.log('Conneted 3000 port!')
});