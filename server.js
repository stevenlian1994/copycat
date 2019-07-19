var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var path = require('path')
var fs = require('fs');
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

app.post('/uploadProfilePicture', function(req,res){
  req.on('data', function(data){
    console.log('inside server,', data)
    console.log('inside server type,', typeof data)
    // update users set password='hello' WHERE id=1 ;
    connection.query(`UPDATE users SET profilePicture='${data}' WHERE id=1;`, function(err, results){
      if(err){
        console.log(err)
        console.log('we are in err')
      } else{
        console.log('we are in result')
      }
      res.json(results)
      
  })
    // res.json(data)
  })
    // console.log('inside server,', req.body)
})

app.get('/getPosts', function(req,res){
    connection.query("SELECT posts.id, posts.content, posts.created_at, users.username, users.profilePicture FROM posts LEFT JOIN posts_has_tags  ON posts.id = posts_has_tags.posts_id LEFT JOIN tags ON posts_has_tags.tags_id = tags.id LEFT JOIN users on posts.users_id = users.id group by posts.id;", function(err, results){
        res.json(results)
    })
})

app.get("/getUserPosts/:userId", function(req,res){
  // console.log("KONEEEEEE!!!!", + req.params.userId)
  connection.query(`SELECT id FROM users WHERE users.username='${req.params.userId}';`,
  function(err, results) {
      // console.log(results[0]["id"] + " Ian Cha")
      // connection.query(`SELECT * FROM posts WHERE posts.users_id='${results[0]["id"]}';`,
      connection.query(`SELECT * FROM posts INNER JOIN users on posts.users_id = users.id WHERE posts.users_id='${results[0]["id"]}';`,
      // connection.query(`SELECT * FROM posts INNER JOIN users on posts.users_id = users.id;`,

  function(err, results){
      console.log(JSON.stringify(results), "this is sparta!!!!");
      res.json(results)
  })
  }

  )

  console.log("KONEEEEEE!!!!")
})


app.get('/getUsers', function(req,res){
  console.log('inside getusersss')
  connection.query(`SELECT * FROM users`, function(err, results){
      console.log('this is our', results);
      res.json(results);
      
  })
  // console.log(results);
  // console.log("yoyoyoyoyoyoo");
})
app.get('/getUser/:id', function(req,res){
  connection.query(`SELECT * FROM users WHERE id=${req.params.id}`, function(err, results){
      console.log('this is our', results);
      res.json(results);
  })
})


app.get('/getFilteredPosts/:title', function(req,res){
  console.log(req.params.title)
  connection.query(`SELECT posts.id, posts.content, posts.created_at, users.username FROM posts LEFT JOIN posts_has_tags ON posts.id = posts_has_tags.posts_id LEFT OUTER JOIN users ON posts.users_id = users.id LEFT JOIN tags ON posts_has_tags.tags_id = tags.id WHERE tags.title = '${req.params.title}';`, function(err, results){
    console.log(results)
    res.json(results)
  })
})

app.post('/createPost', function(req,res){
  console.log("inside createPost", req.body)
    connection.query(`INSERT INTO posts (content, users_id) VALUES ('${req.body.content}', '${req.body.users_id}');` , function(err, rows, fields) {
      console.log('inside createPost', rows.insertId);
        res.json({"id":rows.insertId, "body":req.body})
    });
} )

app.post('/createTag/:postId', function(req,res){
  // insert tags if not already in db; no cb required
  connection.query(`INSERT IGNORE INTO tags (title) VALUES ('${req.body.newTag}');`, function(err, rows){
    // use get tag based on title and get the id
    connection.query(`SELECT * FROM tags WHERE title='${req.body.newTag}';`, function(err, rows){
      // sql query for creating the relationship
      connection.query(`INSERT INTO posts_has_tags (posts_id, tags_id) VALUES (${req.params.postId}, ${rows[0]['id']})`, function(err, rows, fields){
        res.json({'hello':'there'})
      })
  })
})
})

app.post('/createUser', function(req,res){
    connection.query(`INSERT INTO users (username, password, firstName, lastName, profilePicture) VALUES ('${req.body.username}', 
    '${req.body.password}' , '${req.body.firstName}', '${req.body.lastName}', '${req.body.profilePicture}');`)
    var x =connection.query(`SELECT * FROM users WHERE username = '${req.body.username}'`, function(err, rows, fields){
        if (err) throw err;
        for (var i in rows) {
            res.json(rows[i])
        }
    })
})

app.get("/getTags", function(req, res){
  connection.query(`SELECT * FROM tags`, function(err, results){
    console.log(results, "this is iuan cha");
    res.json(results);

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

app.delete("/postDelete/:postId", function(req,res){
  connection.query(`DELETE FROM posts_has_tags WHERE posts_id = ${req.params.postId} ;`);
  connection.query(`DELETE FROM posts WHERE posts.id = ${req.params.postId} ;`, function(err, results){
    res.json(results);
  });


})


app.get('/getTotalTweets/:users_id', function(req,res){
  console.log("gegeg"+ req.params.users_id)
  connection.query(`SELECT COUNT(users_id) as 'userNumber' FROM posts WHERE users_id='${req.params.users_id}';`, function(err, results){
    console.log("vvvv"+(results[0].userNumber))
    res.json(results[0].userNumber)
  })
})

app.all("*", (req,res,next) => {
    res.sendFile(path.resolve("./public/dist/public/index.html"))
});

var server = app.listen(8000, function(){
    console.log("listening on port 8000")
})

