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
    database: 'copycat'
})

connection.connect(function(err) {
    if (err) throw err
    console.log('You are now connected to database..')
});

app.post('/loginUser', function(req,res){
    console.log("inside server, username:", req.body)
    connection.query(`SELECT * FROM users WHERE username = '${req.body.username}'`, function(err, results){
        console.log(results[0])
        res.json(results[0])
    })
})

app.get('/getPosts', function(req,res){
    connection.query("SELECT posts.id, posts.content, posts.created_at, users.username FROM posts LEFT OUTER JOIN users ON posts.users_id = users.id", function(err, results){
        res.json(results)
    })
app.post('/getTags', function(req,res){
    // find all tags for post by post_id
    // console.log('this is tags:', req.body);
    res.json({"hello": "world"})
    // connection.query(`INSERT INTO posts (content, users_id) VALUES ('${req.body.content}', '${req.body.users_id}');`,function(err, rows, fields){
    //     res.json(req.body);
    // } )


    
})


})
app.post('/createPost', function(req,res){
    connection.query(`INSERT INTO posts (content, users_id) VALUES ('${req.body.content}', '${req.body.users_id}');`,function(err, rows, fields){
        res.json(req.body);
    } )
    // res.json({'no object':'to send back yet'})
})
app.post('/createTag', function(req,res){
    connection.query(`INSERT INTO tags (title) VALUES ('${req.body.content} ');` )
    res.json({'no object':'to send back yet'})
})
app.post('/createUser', function(req,res){
    connection.query(`INSERT INTO users (username, password, firstName, lastName) VALUES ('${req.body.username}', 
    '${req.body.password}' , '${req.body.firstName}', '${req.body.lastName}');`)
    var x =connection.query(`SELECT * FROM users WHERE username = '${req.body.username}'`, function(err, rows, fields){
        if (err) throw err;
        for (var i in rows) {
            res.json(rows[i])
        }
    })
})


app.all("*", (req,res,next) => {
    res.sendFile(path.resolve("./public/dist/public/index.html"))
});

var server = app.listen(8000, function(){
    console.log("listening on port 8000")
})

