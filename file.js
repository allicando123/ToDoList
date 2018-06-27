var fs = require('fs');

function write(path, text, callback) {
    fs.writeFile(path, text, function(err) {
        if (!err) {
            callback(text);
        }
    });
}

function read(path, callback) {
    fs.readFile(path, function(err, data) {
        if (!err) {
            callback(data);
        } else {
            callback(false);
        }
    });
}

function exist(path, callback) {
    fs.exists(path, function(exist) {
        callback(exist);
    });
}

function mkdir(path) {
    fs.mkdir(path);
}

exports.write = write;
exports.read = read;
exports.exist = exist;
exports.mkdir = mkdir;