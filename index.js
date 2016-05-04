var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var simplePostgres = require('./simple-postgres');


var STATIC = {
  version: '0.0.1',
  OK: {status: 'OK'},
  fail: function(msg){
    return {status: 'ERROR', reason: msg};
  }
};

simplePostgres.setUrl(process.env.DATABASE_URL);

app.set('port', (process.env.PORT || 5000));

/**
 * MIDDLEWARE CONFIG
 */
app.use(bodyParser.json({limit:1024*1024*1}));
app.use(express.static(__dirname + '/public'));



// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.post('/api/conversation', function(req, res) {
  res.send(STATIC.OK);
  simplePostgres.simpleInsert('conversation_staging', {
    email: req.body.email || 'unknown',
    data: JSON.stringify(req.body) || '{}'
  });
});


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


