var express = require('express')
var app = express()

app.use(express.static( __dirname + '/public/dist/public' ));
// var mongoose = require('mongoose')
var server = app.listen(8000, function(){
    console.log("listening on port 8000")
})