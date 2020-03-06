//入口文件
const express = require('express');
const mongoose = require('mongoose');
const app = express();

//引入user.js
const users = require('./routes/api/users');

//DB config
const db = require('./config/keys.js').mongoURI;

//连接数据库connect to mongodb
mongoose.connect(db, { useNewUrlParser: true })
    // .then(() => console.log('mongdb connected'));
    .catch((err) => console.log(err));
// mongoose.connect(db);

// mongoose.connection.on('error', function (error) {
//     console.error('Database connection error:', error);
// });

// mongoose.connection.once('open', function () {
//     console.log('Database connected');
// });

//设置路由
app.get('/', (req, res) => {
    res.send('hello world');
})

//使用routes
app.use('/api/users',users);

//端口号
const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})