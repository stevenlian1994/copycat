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
    connection.query("SELECT posts.id, posts.content, posts.created_at, users.username,JSON_ARRAYAGG(tags.title) as tags FROM posts LEFT JOIN posts_has_tags  ON posts.id = posts_has_tags.posts_id LEFT JOIN tags ON posts_has_tags.tags_id = tags.id LEFT JOIN users on posts.users_id = users.id group by posts.id;", function(err, results){
        res.json(results)
    })
})

// app.post('/getTags', function(req,res){
//     // find all tags for post by post_id
//     // console.log('this is tags:', req.body);
//     res.json({"hello": "world"})
//     // connection.query(`INSERT INTO posts (content, users_id) VALUES ('${req.body.content}', '${req.body.users_id}');`,function(err, rows, fields){
//     //     res.json(req.body);
//     // } )
// })
// })

app.post('/createPost', function(req,res){
    connection.query(`INSERT INTO posts (content, users_id) VALUES ('${req.body.content}', '${req.body.users_id}');` , function(err, rows, fields) {
        console.log(rows.insertId);
        res.json({"id":rows.insertId, "body":req.body})
    });
} )
    

app.post('/createTags', function(req,res){
  console.log('inside server', req.body)
  console.log(typeof req.body) 
  console.log(typeof req.body[0]) 
  // string
  console.log( req.body[0]) 
  console.log('length of req.body', req.body.length)
  var x = []
  var arr = []
  var newString = ""
  for(var i = 0; i < req.body.length-1; i++){
    x.push(req.body[i])
    newString = newString.concat(`'${req.body[i]}', `)
    // newString.push(`'${req.body[i]},'`)
  }
  newString = newString.concat(`'${req.body[i]}'`)
  console.log(newString)
  console.log('this is x', x)
  console.log(typeof x)
  // for each tag check if it already exists, else create
  // for(var i = 0; i < req.body.length; i++){
    // connection.query(`INSERT INTO tags (title) VALUES ('${req.body[i]}');`, function(err, rows, fields ){
    //   // res.json({"id":rows.insertId, "body":req.body})
    //       arr.push({"id":rows.insertId})
    //       console.log('this is arr to return', arr)
    //       if(arr.length == req.body.length){
    //         res.json(arr)
    //       }
    // })
    console.log('inside forloop', newString)
    // inside query, cannot use previous variables..???
    // new connection query : 

    // INSERT INTO tags (title) SELECT title FROM tags WHERE NOT EXISTS (Select title From tags WHERE tags.id = tags.id)


    connection.query(`INSERT INTO tags (title) VALUES ('def'), ('efg')`, function(err, rows, fields){
      console.log('here are the results:', rows)
      console.log('here are the results:', fields)
      // if(i == req.body.length){
      //   console.log("return json")
        // res.json({"tags_id": rows.insertId})
      // }
    })
  // }
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

app.post('/getPostsTags', function(req,res){
  for(var i = 0; i < req.body.tag_ids.length; i++){
    connection.query(`INSERT INTO posts_has_tags (posts_id, tags_id) VALUES ('${req.body.posts_id}', '${req.body.tag_ids[i]['id']}');`,function(err, results){
      if(i == req.body.length){
        res.json('hello')
      }
    })
  }
})

app.all("*", (req,res,next) => {
    res.sendFile(path.resolve("./public/dist/public/index.html"))
});

var server = app.listen(8000, function(){
    console.log("listening on port 8000")
})


