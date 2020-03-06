//@login && @register
const express = require('express');
const router = express.Router();

router.get('/text',(req,res)=>{
    res.json({msg:'login works'})
})

module.exports = router;