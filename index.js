/**
 * Created by wanyingxue on 2017/10/14.
 */

const express = require('express');
const  router = express.Router();
const app = express();
const mongoose = require('mongoose');
const config = require('./config/database');
const path = require('path');
const authentication = require('./routes/authentication')(router);
const blogs = require('./routes/blogs')(router); // Import Blog Routes
const home = require('./routes/home')(router);
const search = require('./routes/search')(router);
const bodyParser = require('body-parser');
const cors = require('cors');
var multer = require("multer");
const event = require('./routes/event')(router);

//Database Connection
mongoose.Promise = global.Promise;
mongoose.connect(config.uri, (err) => {

    if(err){
        console.log('Could Not connect to database: ', err);
    }else {
        console.log('Connected to database: ' + config.db);
    }

});

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
var upload = multer({ storage: storage });

//Middleware
app.use(cors({
    origin: 'http://localhost:4200'
}));

//provide static directory for frontend
//Parse application
app.use(bodyParser.urlencoded({extended: false}))

//parse application/jason
app.use(bodyParser.json());
app.use(express.static(__dirname + '/client/dist/'));
app.use('/authentication', authentication);
app.use('/blogs', blogs); // Use Blog routes in application
app.use('/home', home);
app.use('/search', search);
app.use(express.static('uploads'));
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use('/image', express.static(__dirname + '/image'));
app.use('/event', event);
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


app.get('/upload/:fileName',function(req,res) {

    var options = {
        port: 80,
        method : 'GET',
        hostname : "localhost",
        path : "/upload/" + req.params.fileName
    };

    var req = http.request(options,function(response) {
        response.pipe(res);
    });

    req.on('error',function(err) {
        res.statusCode = 404;
        res.end("Error : file not found");
    });

    req.end();
});

app.get('/image/:fileName',function(req,res) {

    var options = {
        port: 80,
        method : 'GET',
        hostname : "localhost",
        path : "/image/" + req.params.fileName
    };

    var req = http.request(options,function(response) {
        response.pipe(res);
    });

    req.on('error',function(err) {
        res.statusCode = 404;
        res.end("Error : file not found");
    });

    req.end();
});

app.post("/upload", upload.array("uploads[]", 12), function (req, res) {
    console.log('files', req.files);
    res.send(req.files);
});

app.get('*', (req, res) => {
    res.sendfile(path.join(__dirname + '/client/dist/index.html'));
});

app.listen(8080,() => {
    console.log('Listening on port 8080');
});
