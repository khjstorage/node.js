var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
var multer = require('multer');
//var upload = multer({ dest: 'uploads/' });
var _storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
})
var upload = multer({ storage: _storage })
var OrientDB = require('orientjs');
var server = OrientDB({
    host: 'localhost',
    port: 2424,
    username: 'root',
    password: '910509'
});
var db = server.use('o2');

app.use(bodyParser.urlencoded({ extended: false }));
app.use('/uploads', express.static(__dirname + '/uploads'));
app.locals.pretty = true;
app.set('views', './views_orientdb');
app.set('view engine', 'jade');

/*app.get('/upload', function(req, res){
        res.render('upload');
    });

app.post('/upload', upload.single('userfile'), function(req, res){
    console.log(req.file);
    res.send('Uploaded : '+req.file.filename);
});*/

app.get('/topic/add', function(req, res){
    var sql = 'SELECT FROM topic';
    db.query(sql).then(function(topics){
        res.render('add', {topics:topics});
    });  
});

app.post('/topic/add', function(req,res){
    var title = req.body.title;
    var description = req.body.description;
    var author = req.body.author;
    var sql = 'INSERT INTO topic (title, description, author) VALUES(:title, :desc, :author)';
    var param = {
        params:{
            title:title,
            desc:description,
            author:author
        }
    }
    db.query(sql, param).then(function(result){
        res.redirect('/topic/'+encodeURIComponent(result[0]['@rid']));
    });
});

app.get('/topic/:id/edit', function(req,res){
    var sql = 'SELECT FROM topic';
    var id = req.params.id;
    db.query(sql).then(function(topics){
        var sql = 'SELECT FROM topic WHERE @rid= :rid';
        db.query(sql, {params:{rid:id}}).then(function(topic){
            res.render('edit', {topics:topics, topic:topic[0]});
        });
    });  
});

app.post('/topic/:id/edit', function(req,res){
    var id = req.params.id;
    var title = req.body.title;
    var description = req.body.description;
    var author = req.body.author;
    var sql = 'UPDATE topic SET title= :t, description= :d, author= :a WHERE @rid= :rid';
    var param = {
        params:{
            t:title,
            d:description,
            a:author,
            rid:id
        }
    }    
    db.query(sql, param).then(function(topics){
        res.redirect('/topic/'+encodeURIComponent(id));
    });  
});

app.get('/topic/:id/delete', function(req,res){
    var sql = 'SELECT FROM topic';
    var id = req.params.id;
    db.query(sql).then(function(topics){
        var sql = 'SELECT FROM topic WHERE @rid= :rid';
        db.query(sql, {params:{rid:id}}).then(function(topic){
            res.render('delete', {topics:topics, topic:topic[0]});
        });
    });  
});

app.post('/topic/:id/delete', function(req,res){
    var id = req.params.id;
    var sql = 'DELETE FROM topic WHERE @rid= :rid';
    var param = {
        params:{
            rid:id
        }
    }    
    db.query(sql, param).then(function(topics){
        res.redirect('/topic/');
    });  
});

app.get(['/topic', '/topic/:id'], function(req, res){
    var sql='SELECT FROM topic';
    db.query(sql).then(function(topics){
        var id = req.params.id;
        if(id){ //id값이 있을경우 (where)
            var sql ='SELECT FROM topic WHERE @rid= :rid';
            db.query(sql, {params:{rid:id}}).then(function(topic){
                console.log(topic[0]) //배열 출력임
                res.render('view', {topics:topics, topic:topic[0]});
            });
        }else{
            res.render('view', {topics:topics});
        }
    });
});

app.listen(3000, function(){
    console.log('Conneted 3000 port!');
});
