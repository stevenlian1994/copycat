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
    connection.query(`SELECT * FROM users WHERE username = '${req.body.username}'`, function(err, results){
        res.json(results[0])
    })
})

app.get('/getPosts', function(req,res){
    //connection.query("SELECT posts.id, posts.content, posts.created_at, users.username, users.id as userid, users.profilePicture, COUNT(likes.users_id) as 'userLikes'  FROM posts LEFT JOIN posts_has_tags  ON posts.id = posts_has_tags.posts_id LEFT JOIN tags ON posts_has_tags.tags_id = tags.id LEFT JOIN users on posts.users_id = users.id group by posts.id LEFT JOIN likes ON  posts.id=likes.posts_id LEFT JOIN users on posts.users_id = users.id group by posts.id;", function(err, results){
    connection.query("SELECT posts.id, posts.content, posts.created_at, users.username, users.id as userid, users.profilePicture, COUNT(likes.users_id) as 'userLikes'  FROM posts LEFT JOIN likes ON  posts.id=likes.posts_id LEFT JOIN users on posts.users_id = users.id group by posts.id; ;", function(err, results){

        res.json(results)
    })
})

app.get("/getUserPosts/:userName", function(req,res){
  connection.query(`SELECT id FROM users WHERE users.username='${req.params.userName}';`,function(err, results) {
      connection.query(`SELECT * FROM posts INNER JOIN users on posts.users_id = users.id WHERE posts.users_id='${results[0]["id"]}';`,
      function(err, results){
        res.json(results)
      })
  })
})

app.get('/getFilteredPosts/:title', function(req,res){
  connection.query(`SELECT posts.id, posts.content, posts.created_at, users.username, users.profilePicture FROM posts LEFT JOIN posts_has_tags ON posts.id = posts_has_tags.posts_id LEFT OUTER JOIN users ON posts.users_id = users.id LEFT JOIN tags ON posts_has_tags.tags_id = tags.id WHERE tags.title = '${req.params.title}';`, function(err, results){
    res.json(results)
  })
})

app.get('/getUsers', function(req,res){
  connection.query(`SELECT * FROM users`, function(err, results){
      res.json(results);
  })
})

app.get('/getUser/:id', function(req,res){
  connection.query(`SELECT * FROM users WHERE id=${req.params.id}`, function(err, results){
      res.json(results);
  })
})

app.post('/createPost', function(req,res){
    connection.query(`INSERT INTO posts (content, users_id) VALUES ('${req.body.content}', '${req.body.users_id}');` , function(err, rows, fields) {
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

app.get('/addLike/:posts_id/:users_id', function(req,res){
  connection.query(`INSERT INTO likes (posts_id, users_id) VALUES ('${req.params.posts_id}', '${req.params.users_id}')`,  function(err, rows, fields){
    res.json({'hello':'there'})
  })
})

app.post("/deleteLike", function(req,res){
  connection.query(`DELETE FROM likes WHERE posts_id= '${req.body.likee}' AND users_id= '${req.body.liker}';`,  function(err, results){
    res.json(results);
  })
})

app.get("/getTags", function(req, res){
  connection.query(`SELECT * FROM tags`, function(err, results){
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
  connection.query(`DELETE FROM likes WHERE posts_id = ${req.params.postId} ;`);
  connection.query(`DELETE FROM posts WHERE posts.id = ${req.params.postId} ;`, function(err, results){
    res.json(results);
  });
})

app.post("/followUser", function(req,res){

  connection.query(`INSERT INTO followees (followees_id, followers_id) VALUES ('${req.body.followee}', '${req.body.follower}');`, function(err, results){
    res.json(results);
  });
})


app.post("/unfollowUser", function(req,res){
  connection.query(`DELETE FROM followees WHERE followees_id = '${req.body.followee}' AND followers_id = '${req.body.follower}';`, function(err, results){
    res.json(results);

  });
})


app.get("/getFolloweeId/:userId", function(req,res){
  connection.query(`SELECT * FROM followees WHERE followers_id = '${req.params.userId}';`, function(err, results){
    res.json(results);
  })
})

app.get('/getTotalTweets/:users_id', function(req,res){
  connection.query(`SELECT COUNT(users_id) as 'userNumber' FROM posts WHERE users_id='${req.params.users_id}';`, function(err, results){
    res.json(results[0].userNumber)
  })
})

app.get("/findLikes/:posts_id", function(req,res){

  connection.query(`SELECT * from likes WHERE posts_id='${req.params.posts_id}';`, function(err, results){
     res.json(results)
  })

})

app.get("/getFollowers/:userName", function(req,res){
  console.log("끼리끼리");
  connection.query(`SELECT * FROM followees JOIN users on followees.followees_id = users.id WHERE users.username = '${req.params.userName}';`, function(err, results){
    res.json(results)
  });
})


app.all("*", (req,res,next) => {
    res.sendFile(path.resolve("./public/dist/public/index.html"))
});

var server = app.listen(8000, function(){
    console.log("listening on port 8000")
})


