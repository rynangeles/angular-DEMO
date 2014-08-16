if (!process.env.NODE_ENV) process.env.NODE_ENV='development'

var express = require('express')
    , http = require('http')
    , path = require('path')
    , reload = require('reload')
    , colors = require('colors')
    , employee = require('./server/api/employee')
    
var clientDir = path.join(__dirname, 'client')
var app = express()

app.configure(function() {
    app.set('port', process.env.PORT || 3000)
    app.use(express.favicon())
    app.use(express.logger('dev'))
    app.use(express.bodyParser()) 
    app.use(app.router) 
    app.use(express.static(clientDir)) 
})

app.configure('development', function(){
    app.use(express.errorHandler());
})

app.get('/', function(req, res) {
  res.sendfile(path.join(clientDir, 'index.html'))
})

app.get('/api/employee', employee.list) 
app.get('/api/employee/:id', employee.read)
app.post('/api/employee', employee.create)
app.put('/api/employee/:id', employee.update)
app.del('/api/employee/:id', employee.del)

var server = http.createServer(app)

reload(server, app)

server.listen(app.get('port'), function(){
    console.log("Web server listening in %s on port %d", colors.red(process.env.NODE_ENV), app.get('port'));
});


