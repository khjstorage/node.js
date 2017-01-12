var fs = require('fs');

//Sync
console.log(1);
var data = fs.readFileSync('data.txt', {encoding:'utf-8'})
console.log(data);


//Async
console.log(2);
fs.readFile('data.txt', {encoding:'utf-8'}, function(err,data){
    console.log(3);
    console.log(data);
})
console.log(__dirname); //스크립트의 실행 디렉터리 변수