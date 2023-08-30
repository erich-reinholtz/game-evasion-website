var express = require('express');
var app = express();
var path = require('path');

var sqlite3 = require("sqlite3");

var db = new sqlite3.Database("database");


var db_init = function() {

    // db.run("DROP TABLE evasion");
    // db.run("DROP TABLE beat");
    // db.run("DROP TABLE user");


    db.run("CREATE TABLE IF NOT EXISTS evasion (id TEXT, score INT)", function (err) {
        if (err !== null) {
            console.log("[SERVER] ERROR: \n" + err);
        } else {
            // console.log("[SERVER] DATABASE: Connected to Game 1");
        }
    });

    db.run("CREATE TABLE IF NOT EXISTS beat (id TEXT, score INT)", function (err) {
        if (err !== null) {
            console.log("[SERVER] ERROR: \n" + err);
        } else {
            // console.log("[SERVER] DATABASE: Connected to Game 2");
        }
    });

    db.run("CREATE TABLE IF NOT EXISTS user (id TEXT)");
    db.run("INSERT into user values('player_name')");

};


// viewed at http://localhost:8080
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json()); // maybe add a limit of 1 mb here?


// fetching user
app.get('/user', function(req, resp) {

    var name = "undefined";

    db.each("SELECT id from user", function(err, row){

        name = row.id;

    }, function(err, row) {

        const data = {"name" : name};
        resp.json(data);

    });

});

//// GAME 1
// getting evasion score
app.post('/ev-req', function(req, resp) {

    db.run('INSERT into evasion values("'+ req.body.name +'", ' + req.body.points + ')');

    // db.run('DELETE from user');
    db.run('INSERT into user values("' + req.body.name + '")');


});

// sending evasion scores
app.get('/ev-res', function(req, resp) {

    var list = [];

    db.each("SELECT id,score from evasion ORDER BY score DESC", function(err, row){
        list.push(row);
        
    }, function(err, row) { 

        const data = {"list" : list};

        resp.json(data);
        
    });
});

//// GAME 2
// getting evasion score
app.post('/beat-req', function(req, resp) {

    db.run('INSERT into beat values("'+ req.body.name +'", ' + req.body.points + ')');

    // db.run('DELETE from user');
    db.run('INSERT into user values("' + req.body.name + '")');


});

// sending evasion scores
app.get('/beat-res', function(req, resp) {

    var list = [];

    db.each("SELECT id,score from beat ORDER BY score DESC", function(err, row){
        list.push(row);
        
    }, function(err, row) { 

        const data = {"list" : list};

        resp.json(data);
        
    });
});

app.listen(8080, function(){
    console.log("Running on port 8080");

    db.serialize(db_init);
});