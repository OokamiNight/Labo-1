const http = require('http');
const url = require('url');

module.exports = http.createServer((req, res) => {
  var mathOps = require('./controller.js');
  const reqUrl =  url.parse(req.url, true);
  // GET endpoint
  if(reqUrl.pathname == '/api/maths' && req.method === 'GET') {
    console.log('Request type: ' + req.method + ' Endpoint: ' + req.url);
    mathOps.maths(req, res);
    
  // URL invalide
  } else {
    console.log('Request type: ' + req.method + ' Endpoint: ' + req.url);
    mathOps.invalidUrl(req, res);
  }
})