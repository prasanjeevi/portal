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
                req.status(500).json({message: err.message});
            }
            res.json(apps);
        });
        //res.send('list of apps=>' + JSON.stringify(req.query));
    })

    .post((req,res) => {
        var app = new App(req.body);
        app.save(err => {
            if(err){
                req.status(500).json({message: err.message});
            }
            res.json({message: 'App created', app: app});
        });
        //res.send('create app=>' + JSON.stringify(req.body));
    });


 router.route('/app/:id')
    .get((req,res) => {
        let filter = {_id:req.params.id};
        App.findOne(filter, (err,app) => {
            if(err){
                req.status(500).json({message: err.message});
            }
            res.json(app);
        });
        //res.send('app detail=>' + req.params.id);
    })
    .put((req,res) => {
        let filter = {_id:req.params.id};
        App.findOne(filter, (err,app) => {

            if(err){
                req.status(500).json({message: err.message});
            }

            for(let prop in req.body){
                app[prop]=req.body[prop];
            }

            app.save(function(err) {
                if(err){
                    req.status(500).json({message: err.message});
                }
                res.json({message: 'App updated', app: app});
            });

        });
        //res.send('app update=>' + req.params.id + '=>' +JSON.stringify(req.body));
    })
    .delete((req,res) => {
        let filter = {_id:req.params.id};
        App.remove(filter, (err, movie) => {
            if(err){
                    req.status(500).json({message: err.message});
            }
            res.json({message: 'App deleted', _id: filter._id});
        });
        //res.send('app delete=>' + req.params.id);
    });

module.exports = router;