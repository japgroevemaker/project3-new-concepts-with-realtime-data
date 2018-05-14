const express = require('express')
const ejs = require('ejs')
const app = express()
const fs = require("fs")
const socket = require('socket.io');
const PORT = process.env.port || 3000
var rank = 0

// view engine setup
app.set('view engine', 'ejs');

app.use(express.static('public'))

app.get("/", function(req, res) {
  // console.log(req.session.ingelogd);
  res.render("home")
  // shuffle(arr);
})

app.get("/game", function(req,res) {
  res.render("index")
})

var server = app.listen(PORT, function() {
  console.log('port 3000')
})

var io = socket(server);
io.on('connection', function(socket) {
  console.log('made socket connection', socket.id)
  socket.on("uploading", function(data){
  rank++
  var cleanData = `${data.name}.${data.score},`
  fs.appendFile('public/scoreboard.txt', cleanData, function (err) {
    if (err) throw err;
    console.log("scoreboard.txt");
  });

    console.log(data);
  })
})
