var express = require('express'); //获取express
var bodyparser = require('body-parser'); //获取页面的内容
var path = require('path'); //路径
var file = require('./file'); //使用文件
var session = require('express-session'); //使用服务器临时存储

//解析地址
var urlencodedParser = bodyparser.urlencoded({ extended: false });

var app = new express();

//静态资源路径
app.use(express.static(__dirname + '/public'));

app.use(session({
    secret: 'thisistodolist',
    resave: false,
    saveUninitialized: true,
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
}));

//进入主界面
app.get('/', function(req, res) {
    if (!req.session.user) {
        res.redirect('/login');
        return;
    }
    res.sendFile(__dirname + '/' + 'index.html');
});

//将数据传入主界面
app.get('/userinfo', function(req, res) {
    var user = req.session.user;
    if (!req.session.data) {
        var mypath = __dirname + '/save/users/' + user + '/data.json';
        file.exist(mypath, function(state) {
            if (state)
                file.read(__dirname + '/save/users/' + user + '/data.json', function(data) {
                    var info = JSON.parse(data);
                    info.user = user;
                    info.isdata = true;
                    res.send(info);
                });
            else {
                var info = {};
                info.user = user;
                info.isdata = false;
                res.send(info);
                console.log(user + ' 没有本地数据');
            }
        });
    } else {
        var data = req.session.data;
        data.user = user;
        data.isdata = true;
        res.send(data);
        console.log('传入临时数据');
    }
});

//进入登陆界面
app.get('/login', function(req, res) {
    res.sendFile(__dirname + '/' + 'login.html');
});

//进入注册界面
app.get('/signup', function(req, res) {
    res.sendFile(__dirname + '/' + 'signup.html');
})

//判断密码并登陆
app.post('/_login', urlencodedParser, function(req, res) {
    var mypath = __dirname + '/save/users/' + req.body.user + '/' + req.body.user + '.json';
    file.read(mypath, function(text) {
        if (text) {
            var save = JSON.parse(text);
            if (req.body.user === save['user'] && req.body.passwd === save['passwd']) {

                if (!req.session.user) {
                    req.session.user = req.body.user;
                    console.log(req.session.user + " 已登陆");
                }
                res.redirect('/'); //重定向
            } else {
                res.send('Passwd wrong!');
            }
        } else {
            res.send('No this user!');
        }
    });
});

//注册并判断是否两次输入的相同和是否用户名已被注册
app.post('/_signup', urlencodedParser, function(req, res) {
    if (req.body.passwd !== req.body.repasswd) {
        res.end('Passwds are not same');
        return;
    }
    var userinfo = {
        name: req.body.user,
        user: req.body.user,
        passwd: req.body.passwd
    }
    var mypath = __dirname + '/save/users/' + req.body.user + '/' + req.body.user + '.json';
    file.exist(mypath, function(exist) {
        if (exist) {
            res.send('User exist');
        } else {
            file.mkdir(__dirname + '/save/users/' + req.body.user);
            file.write(mypath, JSON.stringify(userinfo), function() {
                res.send('Sign up sucess');
            });
        }
    });
});

//保存数据
app.post('/save', urlencodedParser, function(req, res) {
    var mdata = req.body;
    req.session.data = mdata; //临时存储数据

    var data = req.session.data;
    var user = req.session.user;

    // var Save = setTimeout(function() {
    //     clearTimeout(Save);
    file.write(__dirname + '/save/users/' + user + '/data.json', JSON.stringify(data), function() {
        console.log('用户 ' + user + ' 信息保存成功');
    });
    // }, 5000);


    res.end();
});

app.get('/logout', function(req, res) {
    var user = req.session.user;
    if (req.session.user)
        req.session.destroy(function() {
            console.log('用户 ' + user + ' 已登出');
        }); //删除临时存储的数据
    res.redirect('/'); //回到主界面
    res.end();
});



app.listen(8888);