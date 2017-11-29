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
const bodyParser = require('body-parser');
const cors = require('cors');

//Database Connection
mongoose.Promise = global.Promise;
mongoose.connect(config.uri, (err) => {

    if(err){
        console.log('Could Not connect to database: ', err);
    }else {
        console.log('Connected to database: ' + config.db);
    }

});


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



app.get('*', (req, res) => {
    res.sendfile(path.join(__dirname + '/client/dist/index.html'));
});

app.listen(8080,() => {
    console.log('Listening on port 8080');
});