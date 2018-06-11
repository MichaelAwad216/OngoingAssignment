const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors');
const Favourites = require('../models/favourites');
const favouriteRouter = express.Router();

favouriteRouter.use(bodyParser.json())

favouriteRouter.use(function (req, res, next) {
    console.log('Time: ', Date.now())
    next()
})

favouriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200)}) 

.get(cors.cors, authenticate.veriyUser, (req, res, next) => { 
    Favourites.findOne({user: req.user._id})
    .populate('user') 
    .populate('dishes')
    .then((favourites) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(favourites);
    }, (err) => next(err))
    .catch((err) => next(err));
})

.post(cors.corsWithOptions, authenticate.veriyUser, (req, res, next) => {
    console.log(req.body[0]._id);
    Favourites.findOne({users:req.user._id})
    .then((favourite) => {
        if(favourite){
            for (var i=0; i<req.body.length; i++) {
                if (favourite.dishes.indexOf(req.body[i]._id) === -1) {
                    favourite.dishes.push(req.body[i]._id);
                }
            }
            favourite.save()
            .then((favourite) => {
                console.log('Favorite Created ', favourite);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favourite);
            }, (err) => next(err)); 
        } else {
            Favourites.create({"user": req.user._id, "dishes": req.body})
            .then((favourite) => {
                console.log('Favorite Created ', favourite);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favourite);
            }, (err) => next(err));
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})

.put(cors.corsWithOptions, authenticate.veriyUser, (req, res, next) =>{
    res.statusCode = 403;
    res.end('POST operation not supported on /favorites/');
})

.delete(cors.corsWithOptions, authenticate.veriyUser, (req, res, next) =>{
    Favourites.findOneAndRemove({user: req.user._id})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

favouriteRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200)}) 
.post(cors.corsWithOptions, authenticate.veriyUser, (req, res, next) => {
    Favourites.findOne({user: req.user._id})
    .then((favourite) => {
        if(favourite) {
            if (favourite.dishes.indexOf(req.params.dishId) === -1) {
                favourite.dishes.push(req.params.dishId);
            } else {
                res.statusCode = 403;
                res.setHeader('Content-Type','plain/text');
                res.send("This id is part of your favourite list already");
            }
        } else {
            Favourites.create({"user":req.user._id, "dishes":req.params.dishId})
            .then((favourite) => {
                console.log('Favourite created ', favourite);
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(favourite);
            }, (err) => next(err))
            .catch((err) => next(err));
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(cors.corsWithOptions, authenticate.veriyUser, (req, res, next) =>{
    Favourites.findOne({user: req.user._id})
      .then((favourtie) => {
        if (favourtie) {
          index = favourtie.dishes.indexOf(req.params.dishId);
          if (index >= 0) {
            favourtie.dishes.splice(index, 1);
            favourtie.save()
              .then((favorite) => {
                console.log('favourtie Deleted ', favorite);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
              }, (err) => next(err));
          } else {
            var err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
          }
        } else {
          err = new Error('Favourties not found');
          err.status = 404;
          return next(err);
        }
      }, (err) => next(err))
      .catch((err) => next(err))
  })

  .put(cors.corsWithOptions, authenticate.veriyUser, (req, res, next) =>{
    res.statusCode = 403;
    res.end('POST operation not supported on /favorites/dishId');
  });

module.exports = favouriteRouter
