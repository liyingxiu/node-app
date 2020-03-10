//@login && @register
const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const keys = require('../../config/keys');
const passport = require('passport')

//@route    get请求，/api/users/test
//@desc     返回请求的json数据
//@access   public
router.get('/test', (req, res) => {
    res.json({ msg: 'login works' })
})

//@route    post请求，/api/users/register
//@desc     返回请求的json数据
//@access   public
router.post('/register', (req, res) => {
    //查询数据库中是否拥有邮箱
    User.findOne({ email: req.body.email })
        .then((user) => {
            if (user) {
                return res.status(400).json('邮箱已被注册')
            } else {
                const avatar = gravatar.url(req.body.email, { s: '200', r: 'pg', d: 'mm' });
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    avatar,
                    password: req.body.password,
                    identity: req.body.identity
                })
                //10是加密方式
                bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        // hash是加密后的密码
                        if (err) throw err;
                        newUser.password = hash;
                        newUser.save()
                            .then(user => res.json(user))
                            .catch(err => console.log(err));
                    });
                });
            }
        })
})

//@route    post请求，/api/users/login
//@desc     返回token jwt passport 
//@access   public

router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    //查询数据库
    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                return res.status(404).json('用户不存在');
            }
            //密码匹配
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        const rule = {
                            id: user.id,
                            name: user.name,
                            avatar: user.avatar,
                            identity: user.identity
                        };
                        //jwt.sign('规则','加密名字','token的过期时间(是一个对象)一小时','箭头函数');
                        jwt.sign(rule, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => {
                            if (err) throw err;
                            res.json({
                                success: true,
                                token: 'Bearer ' + token
                            })
                        })
                        //   res.json({msg:'success'});
                    } else {
                        return res.status(400).json('密码错误');
                    }
                })
        })
})

//@route    GET请求，/api/users/current
//@desc     返回 current user
//@access   private(私有的必须要验证token)

// router.get('/current','验证token',(req,res)=>{})
router.get('/current',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        res.json({
            id: req.user.id,
            name: req.user.name,
            email: req.user.email,
            identity: req.user.identity
        });
    })

module.exports = router;