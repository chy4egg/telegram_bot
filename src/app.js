
var request = require('request');

var URL = 'https://pitercss.timepad.ru/events/';

request(URL, function (err, res, body) {
    if (err) throw err;
    console.log(body);
    console.log(res.statusCode);
});
