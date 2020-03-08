//入口文件
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const passport = require('passport');

//引入user.js
const users = require('./routes/api/users');
const profiles = require('./routes/api/profiles');

//DB config
const db = require('./config/keys.js').mongoURI;

//使用body-parser中间件
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//连接数据库connect to mongodb
mongoose.connect(db, { useNewUrlParser: true })
    .then(() => console.log('mongdb connected'))
    .catch((err) => console.log(err));

//passport初始化
app.use(passport.initialize());

require('./config/passport')(passport);

//设置路由
// app.get('/', (req, res) => {
//     res.send('hello world');
// })

//使用routes
app.use('/api/users',users);
app.use('/api/profiles',profiles);

//端口号
const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})