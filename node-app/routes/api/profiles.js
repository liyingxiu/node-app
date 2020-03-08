//@login && @register
const express = require('express');
const router = express.Router();
const passport = require('passport');

const Profile = require('../../models/Profile');

//@route    get请求，/api/profiles/test
//@desc     返回请求的json数据
//@access   public
router.get('/test', (req, res) => {
    res.json({ msg: 'profile works' })
})

//@route    POST请求，/api/profiles/add
//@desc     创建信息接口
//@access   private

router.post('/add', passport.authenticate('jwt', { session: false }), (req, res) => {
    const profileFields = {};

    if (req.body.type) profileFields.type = req.body.type;
    if (req.body.describe) profileFields.describe = req.body.describe;
    if (req.body.income) profileFields.income = req.body.income;
    if (req.body.expand) profileFields.expand = req.body.expand;
    if (req.body.cash) profileFields.cash = req.body.cash;
    if (req.body.remark) profileFields.remark = req.body.remark;

    new Profile(profileFields).save()
        .then(profile => {
            res.json(profile)
        })

});


//@route    GET请求，/api/profiles
//@desc     获取所有信息
//@access   private

router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.find()
        .then(profile => {
            if (profile) {
                return res.status(404).json('没有任何内容');
            }else{
                res.json(profile);
            }
        }).catch(err => {
            return res.status(404).json(err);
        })
});

module.exports = router;