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

app.use(bodyParser.urlencoded({ extended: false }));
app.use('/uploads', express.static(__dirname + '/uploads'));
app.locals.pretty = true;
app.set('views', './views_file');
app.set('view engine', 'jade');

app.get('/upload', function(req, res){
        res.render('upload');
    });

app.post('/upload', upload.single('userfile'), function(req, res){
    console.log(req.file);
    res.send('Uploaded : '+req.file.filename);
});

app.get('/topic/new', function(req, res){
    fs.readdir('data', function(err, files){
        if(err){
            console.log(err);
            res.status(500).send('Internal Server Error'); 
        }    
        res.render('new', {topics:files});
    });
});

app.get(['/topic', '/topic/:id'], function(req, res){
    var savedir = __dirname + "/data";
    if(!fs.existsSync(savedir)){
        fs.mkdir(savedir);
    }
    
    fs.readdir('data', function(err, files){
        if(err){
            console.log(err);
            res.status(500).send('Internal Server Error'); 
        }
        var id = req.params.id;
        if(id){
            fs.readFile('data/'+id, {encoding:'utf-8'}, function(err, data){
                if(err){
                    console.log(err);
                    res.status(500).send('Internal Server Error'); 
                }
                res.render('view', {topics:files, title:id, discription:data});
            })
        }else{
            res.render('view', {topics:files, title:'Welcome', discription:'hello'});
        }
    })
});

/*app.get('/topic', function(req, res){
    var savedir = __dirname + "/data";
    if(!fs.existsSync(savedir)){
        fs.mkdir(savedir);
    }
    
    fs.readdir('data', function(err, files){
        if(err){
            console.log(err);
            res.status(500).send('Internal Server Error'); 
        }
        res.render('view', {topics:files});
    })
});
app.get('/topic/:id', function(req, res){
    var savedir = __dirname + "/data";
    if(!fs.existsSync(savedir)){
        fs.mkdir(savedir);
    }
    
    var id = req.params.id;
    fs.readdir('data', function(err, files){
        if(err){
            console.log(err);
            res.status(500).send('Internal Server Error'); 
        }
        fs.readFile('data/'+id, 'utf8', function(err, data){
            if(err){
                console.log(err);
                res.status(500).send('Internal Server Error'); 
            }
                res.render('view', {topics:files, title:id, discription:data});
        })
    })
})*/

app.post('/topic', function(req,res){
    var title = req.body.title;
    var description = req.body.description;
    
    var savedir = __dirname + "/data";
    if(!fs.existsSync(savedir)){
        fs.mkdir(savedir);
    }
    
    fs.writeFile('data/'+title,description,function(err){
        if(err){
            console.log(err);
            res.status(500).send('Internal Server Error');    
        }
        res.redirect('/topic/'+title);
    });
});

app.listen(3000, function(){
    console.log('Conneted 3000 port!');
});
