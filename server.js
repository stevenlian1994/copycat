var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var path = require('path')
app.use(express.static( __dirname + '/public/dist/public' ));
app.use(bodyParser.json());
var mysql = require('mysql')
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password:'root',
    database: 'twitter1'
})

connection.connect(function(err) {
    if (err) throw err
    console.log('You are now connected...')
});

// app.get('/', function(req, res){
//     console.log('connected to index route');
//     // connection.query("SELECT * FROM posts", function(err, results){
//     //     // console.log(results[0].content)
//     //     // res.send(results[0].content)
//     //     // res.json({results})
//     // })
//     var dict = new {};
//     dict[1] = "hello";
//     console.log(dict)
//     var x = JSON.parse(dict)
//     console.log(x)
//     // res.json({"hello":"world"})
// })
app.get('/posts', function(req,res){
    connection.query("SELECT * FROM posts", function(err, results){
        res.json(results)
    })
})

// app.post('/createProduct', function(req,res){
//     console.log('inside server', req.body)
//     var product = new Product(req.body)
//     product.save(function(err){
//         if(err){
//             console.log('something went wrong', err.errors);
//             res.json(err)
//         } else {
//             console.log('successfully added asdf', product)
//             res.json(product)
//         }
//     })
// })


app.all("*", (req,res,next) => {
    res.sendFile(path.resolve("./public/dist/public/index.html"))
});

var server = app.listen(8000, function(){
    console.log("listening on port 8000")
})