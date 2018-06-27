var file = require('./file.js');

file.read('/abc.json', function(data) {

    console.log(data);
})