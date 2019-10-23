const express = require('express');
const bodyParser = require('body-parser');
const Favorites = require('../models/favorite');
const authenticate = require('../authenticate');
const cors = require('./cors');

const favortieRouter = express.Router();

favortieRouter.use(bodyParser.json());

favortieRouter.route('/')
.options(cors.corsWithOptions, (req, res)=>{
    res.sendStatus = 200;
})
.get(cors.corsWithOptions, authenticate.verifyUser, (req,res,next)=>{
    Favorites.find({user:req.user._id})
    .populate('user')
    .populate('dishes')
    .then(favorites=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites);
    },
    err => next(err))
    .catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req,res,next)=>{
    Favorites.findOne({user:req.user._id})
    .then(favorites=>{
        // if the favorite document for this user already exists then just
        //push the new favorite dishes into the dishes field
        if (favorites) {
            req.body.forEach(dish=>{
                //if the dish already doesn't exist in the favorites, 
                //then add it to the favorites
                if (favorites.dishes.indexOf(dish._id) === -1){
                    favorites.dishes.push(dish._id)
                }
            })
            favorites.save()
            .then(favorites=>{
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorites);
            },
            err=>next(err))
            .catch(err => next(err));
        }
        //if the favorite document for this user doesn't exist then create
        // a new document with the favorite dishes added in
        else {
            favorites = new Favorites({user: req.user._id, dishes: []})
            req.body.forEach(dish=>{
                //if the dish already doesn't exist in the favorites, 
                //then add it to the favorites
                if (favorites.dishes.indexOf(dish._id) === -1){
                    favorites.dishes.push(dish._id)
                }
            })
            favorites.save()
            .then(favorites=>{
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorites);
            },
            err=>next(err))
            .catch(err => next(err));
        }
    },
    err => next(err))
    .catch(err => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req,res,next)=>{
    Favorites.remove({user: req.user._id})
    .then((resp)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    },err => next(err))
    .catch(err => next(err));
})

favortieRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res)=>{
    res.sendStatus = 200;
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req,res,next)=>{
    Favorites.findOne({user:req.user._id})
    .then(favorites=>{
        // if the favorite document for this user already exists then just
        //push the new favorite dishes into the dishes field
        if (favorites) {
            if (favorites.dishes.indexOf(req.params.dishId) === -1){
                favorites.dishes.push(req.params.dishId);
            }
            favorites.save()
            .then(favorites=>{
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorites);
            },
            err=>next(err))
            .catch(err => next(err));
        }
        //if the favorite document for this user doesn't exist then create
        // a new document with the favorite dishes added in
        else {
            favorites = new Favorites({user: req.user._id, dishes: []})
            favorites.dishes.push(req.params.dishId);
            favorites.save()
            .then(favorites=>{
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorites);
            },
            err=>next(err))
            .catch(err => next(err));
        }
    },
    err => next(err))
    .catch(err => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req,res,next)=>{
    Favorites.update({user:req.user._id}, { $pullAll: {dishes: [req.params.dishId] } })
    .then((resp)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    },err => next(err))
    .catch(err => next(err));
})

module.exports = favortieRouter;