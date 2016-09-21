// routes/user.js

'use strict';

const express = require('express');
const router = express.Router();

const User = require('../models/user')

router.route('/user')
    .get((req,res) => {
        let filter = {};
        
        User.find(filter, (err,users) => {
            if(err){
                res.status(500).json({message: err.message});
            }
            res.json(users);
        });
    })

    .post((req,res) => {
        var user = new User(req.body);
        user.save(err => {
            if(err){
                res.status(500).json({message: err.message});
            }
            res.json({message: 'User created', user: user});
        });
    });


 router.route('/user/:id')
    .get((req,res) => {
        let filter = {_id:req.params.id};
        User.findOne(filter, (err,user) => {
            if(err){
                res.status(500).json({message: err.message});
            }
            res.json(user);
        });
    })
    .put((req,res) => {
        let filter = {_id:req.params.id};
        User.findOne(filter, (err,user) => {

            if(err){
                res.status(500).json({message: err.message});
            }

            for(let prop in req.body){
                user[prop]=req.body[prop];
            }

            user.save(function(err) {
                if(err){
                    res.status(500).json({message: err.message});
                }
                res.json({message: 'User updated', user: user});
            });

        });
    })
    .delete((req,res) => {
        let filter = {_id:req.params.id};
        User.remove(filter, (err, movie) => {
            if(err){
                    res.status(500).json({message: err.message});
            }
            res.json({message: 'User deleted', _id: filter._id});
        });
    });

module.exports = router;