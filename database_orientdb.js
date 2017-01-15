var OrientDB = require('orientjs');

var server = OrientDB({
    host: 'localhost',
    port: 2424,
    username: 'root',
    password: '910509'
});
var db = server.use('o2');

db.record.get('#22:0').then(function(record){
    console.log('Loaded record:', record);
});

var sql = 'SELECT FROM topic';
db.query(sql).then(function(results){
    console.log(results);
});

var sql = 'SELECT FROM topic WHERE @rid=:rid';
var param = {
    params:{
        rid:'#22:0'
    }
};
db.query(sql, param).then(function(results){
    console.log(results);
});

var sql = "INSERT INTO topic (title, description) VALUES(:title, :desc)"
var param = {
    params:{
        title:'Express',
        desc:'Express is framework for web'
    }
}
db.query(sql, param).then(function(results){
    console.log(results);
});

var sql = "UPDATE topic SET title= :title WHERE @rid= :rid";
db.query(sql, {params:{title:'Exptessjs', rid:'#21:0'}}).then(function(result){
    console.log(result);                                                             
});

var sql = "DELETE FROM topic WHERE @rid=:rid";
db.query(sql, {params:{rid:'#21:0'}}).then(function(result){
   console.log(result); 
});