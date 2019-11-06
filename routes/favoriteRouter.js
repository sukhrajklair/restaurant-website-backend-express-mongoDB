const express = require('express');
const bodyParser = require('body-parser');
const Favorites = require('../models/favorite');
const authenticate = require('../authenticate');
const cors = require('./cors');

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res)=>{
    res.sendStatus = 200;
})
.get(cors.corsWithOptions, authenticate.verifyUser, (req,res,next)=>{
    Favorites.findOne({user:req.user._id})
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
                Favorites.findById(favorites._id)
                    .populate('user')
                    .populate('dishes')
                    .then((favorites) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorites);
                    })
            })
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
                Favorites.findById(favorites._id)
                    .populate('user')
                    .populate('dishes')
                    .then((favorites) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorites);
                    })
            })
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

favoriteRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res)=>{
    res.sendStatus = 200;
})
.get(cors.cors, authenticate.verifyUser, (req,res,next) => {
    Favorites.findOne({user: req.user._id})
    .then((favorites) => {
        if (!favorites) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            return res.json({"exists": false, "favorites": favorites});
        }
        else {
            if (favorites.dishes.indexOf(req.params.dishId) < 0) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.json({"exists": false, "favorites": favorites});
            }
            else {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.json({"exists": true, "favorites": favorites});
            }
        }

    }, (err) => next(err))
    .catch((err) => next(err))
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
                Favorites.findById(favorites._id)
                    .populate('user')
                    .populate('dishes')
                    .then((favorites) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorites);
                    })
            })
            .catch(err => next(err));
        }
        //if the favorite document for this user doesn't exist then create
        // a new document with the favorite dishes added in
        else {
            favorites = new Favorites({user: req.user._id, dishes: []})
            favorites.dishes.push(req.params.dishId);
            favorites.save()
            .then(favorites=>{
                Favorites.findById(favorites._id)
                    .populate('user')
                    .populate('dishes')
                    .then((favorites) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorites);
                    })
            })
            .catch(err => next(err));
        }
    },
    err => next(err))
    .catch(err => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req,res,next)=>{
    Favorites.update({user:req.user._id}, { $pullAll: {dishes: [req.params.dishId] } })
    .then(favorite => {
        favorite.save()
        .then((favorite) => {
            Favorites.findById(favorite._id)
            .populate('user')
            .populate('dishes')
            .then((favorite) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            })
        },err => next(err))
    })
    .catch(err => next(err));
})

module.exports = favoriteRouter;