// routes/app.js

'use strict';

const express = require('express');
const router = express.Router();

const App = require('../models/app')

router.route('/app')
    .get((req,res) => {
        let filter = {};
        
        App.find(filter, (err,apps) => {
            if(err){
                res.status(500).json({message: err.message});
            }
            res.json(apps);
        });
    })

    .post((req,res) => {
        var app = new App(req.body);
        app.save(err => {
            if(err){
                res.status(500).json({message: err.message});
            }
            res.json({message: 'App created', app: app});
        });
    });


 router.route('/app/:id')
    .get((req,res) => {
        let filter = {_id:req.params.id};
        App.findOne(filter, (err,app) => {
            if(err){
                res.status(500).json({message: err.message});
            }
            res.json(app);
        });
    })
    .put((req,res) => {
        let filter = {_id:req.params.id};
        App.findOne(filter, (err,app) => {

            if(err){
                res.status(500).json({message: err.message});
            }

            for(let prop in req.body){
                app[prop]=req.body[prop];
            }

            app.save(function(err) {
                if(err){
                    res.status(500).json({message: err.message});
                }
                res.json({message: 'App updated', app: app});
            });

        });
    })
    .delete((req,res) => {
        let filter = {_id:req.params.id};
        App.remove(filter, (err, movie) => {
            if(err){
                    res.status(500).json({message: err.message});
            }
            res.json({message: 'App deleted', _id: filter._id});
        });
    });

module.exports = router;