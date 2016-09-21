// auth.js

// routes/auth.js

'use strict';

const express = require('express');
const router = express.Router();

const User = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('../config.json');

router.post('/authenticate', (req,res) => {
    let filter = { email:req.body.email }; 
    User.findOne(filter, (err,user) => {
        if(err){
            res.status(500).json({message: err.message});
        }
        if(!user){
            res.status(401).json({message: 'User not found'});
        }

        if(user.password === req.body.password){
            var token = jwt.sign(user, config.secret, {
                expiresIn: 60 * config.jwtExpiresInMinutes
            });
            res.json({
                email: filter.email,
                token: token
            });
        }
        else{
            req.status(401).json({message: 'Username/Password incorrect'});
        }
    });
});

// middleware to validate the token for api requests
router.use('/api', (req,res,next) => {
    let token = req.headers['authtoken'];
    
    jwt.verify(token, config.secret, (err,decoded) => {
        if(err){
            return res.status(401).json({message: 'AuthToken is not valid'});
        }
        //req.decoded = decoded;
        next();
    });
});

module.exports = router;