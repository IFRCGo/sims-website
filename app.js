var express = require('express');
var path = require('path');
var exphbs  = require('express-handlebars');
var localConfig = require('./config');

var app = express();
var hbs = exphbs.create({
  defaultLayout: 'main',
  helpers: {
    json: function(context) {
			return JSON.stringify(context);
		}
  }
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, 'public')));
app.use('/docs', express.static(path.join(localConfig.application.dboxpath,localConfig.application.prjfolder)));

app.use(function(req,res,next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var FolderParse = require('./routes/folderParse.js');
var folderparse = new FolderParse();

app.get('/files',function(req,res,next) {
		folderparse.retrieveFiles(function(err,data){
			res.send(data);
		})
})


app.get('/',function(req,res) {
    res.render('home', {
      opts:localConfig.application,
    });
})


app.listen(localConfig.application.port, function(){
  console.log('Listening on port '+localConfig.application.port);
});
