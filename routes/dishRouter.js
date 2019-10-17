const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const Dishes = require('../models/dishes');
const dishRouter = express.Router();
var authenticate = require('../authenticate');

dishRouter.use(bodyParser.json());

dishRouter.route('/')
.get((req,res,next) => {
    // res.end('Will send all the dishes to you!');
    Dishes.find({})
    //populate the author fields in the comments using info from users
    .populate('comments.author')
    .then((dishes)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        //this will put the dishes data in the body of the response
        res.json(dishes);
    },err => next(err))
    .catch(err => next(err));
})
.post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    //res.end('Will add the dish: ' + req.body.name + ' with details: ' + req.body.description);
    //body-parser will have already parsed the json and put it in req.body
    Dishes.create(req.body)
    .then((dish)=>{
        console.log('Dish Created', dish);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    },err => next(err))
    .catch(err => next(err));
})
.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes');
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Dishes.remove({})
    .then((resp)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    },err => next(err))
    .catch(err => next(err));
})

dishRouter.route('/:dishId')
.get((req,res,next) => {
    //res.end('Will send details of the dish: ' + req.params.dishId +' to you!');
    Dishes.findById(req.params.dishId)
    //populate the author fields in the comments using info from users
    .populate('comments.author')
    .then((dish)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    },err => next(err))
    .catch(err => next(err));
})
.post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  res.statusCode = 403;
  res.end('POST operation not supported on /dishes/'+ req.params.dishId);
})
.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  //res.write('Updating the dish: ' + req.params.dishId + '\n');
  //res.end('Will update the dish: ' + req.body.name + 
  //      ' with details: ' + req.body.description);
    Dishes.findByIdAndUpdate(req.params.dishId,
        {$set: req.body}, {new:true}) //passing {new:true} will return the updated dish
    .then((dish)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    },err => next(err))
    .catch(err => next(err));
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    //res.end('Deleting dish: ' + req.params.dishId);
    Dishes.findByIdAndRemove(req.params.dishId)
    .then((resp)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    },err => next(err))
    .catch(err => next(err));
})

dishRouter.route('/:dishId/comments')
.get((req,res,next) => {
    Dishes.findById(req.params.dishId)
    //populate the author fields in the comments using info from users
    .populate('comments.author')
    .then((dish)=>{
        if (dish != null){
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            //this will put the dishes data in the body of the response
            res.json(dish.comments);
        }
        else {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            //this will pass the error to the error handler in App.js to be handled there
            return next(err);
        }
    },err => next(err))
    .catch(err => next(err));
})
.post(authenticate.verifyUser, (req, res, next) => {
    //body-parser will have already parsed the json and put it in req.body
    Dishes.findById(req.params.dishId)
    .then((dish)=>{
        if (dish != null){
            //add the author field to the body of the req and assign it to
            //the currently signed in user which is available in the req.user
            //as inserted by the passport.authenticate( imported as 
            // authenticate.verifyUser) function
            req.body.author = req.user._id;
            dish.comments.push(req.body);
            dish.save()
            .then((dish)=>{
                //populate the dish comments' author field before sending 
                //the response
                Dishes.findById(dish._id)
                    .populate('comments.author')
                    .then(dish => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(dish);
                    }) 
            },err => next(err))
        }
        else {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            //this will pass the error to the error handler in App.js to be handled there
            return next(err);
        }
    },err => next(err))
    .catch(err => next(err));
})
.put(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes/' + req.params.dishId + '/comments');
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish)=>{
        if (dish !== null){
            for (let i = (dish.comments.length-1); i>=0; i--){
                dish.comments.id(dish.comments[i]._id).remove();
            }
            dish.save()
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);                
            }, (err) => next(err));
        } 
        else{
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            //this will pass the error to the error handler in App.js to be handled there
            return next(err);
        }
    },err => next(err))
    .catch(err => next(err));
})

dishRouter.route('/:dishId/comments/:commentId')
.get(authenticate.verifyUser, (req,res,next) => {
    Dishes.findById(req.params.dishId)
    //populate the author fields in the comments using info from users
    .populate('comments.author')
    .then((dish)=>{
        if (dish != null && dish.comments.id(req.params.commentId) != null){
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dish.comments.id(req.params.commentId));
        }
        else if (dish == null){
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Dish ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);
        }
    },err => next(err))
    .catch(err => next(err));
})
.post(authenticate.verifyUser, (req, res, next) => {
  res.statusCode = 403;
  res.end('POST operation not supported on /dishes/'+ req.params.dishId +
    '/comments/'+req.params.commentId);
})
.put(authenticate.verifyUser, (req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish)=>{
        if (dish == null){
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
        else if(dish.comments.id(req.params.commentId) == null){     
            err = new Error('Dish ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            console.log(dish.comments.id(req.params.commentId).author, req.user._id)
            console.log(typeof(req.user._id));
            //the objectId are 12 byte binary data, hence their equality is checked
            //using .equals operator instead of == or === which doesn't work
            if (dish.comments.id(req.params.commentId).author.equals(req.user._id)){
                if (req.body.rating ){
                    dish.comments.id(req.params.commentId).rating = req.body.rating;
                }
                if (req.body.comment){
                    dish.comments.id(req.params.commentId).comment = req.body.comment;
                }
                dish.save()
                .then((dish)=>{
                    Dishes.findById(dish._id)
                    .populate('comments.author')
                    .then(dish=>{
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(dish);
                    })  
                },err => next(err))
            } else {
                err = new Error('You are not authorized to update this comment');
                err.status = 403;
                return next(err);
            } 
        }
    }
    ,err => next(err))

})
.delete(authenticate.verifyUser, (req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish)=>{
        if (dish == null){
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
        else if(dish.comments.id(req.params.commentId) == null){
            {
                err = new Error('Dish ' + req.params.commentId + ' not found');
                err.status = 404;
                return next(err);
            }
        }
        else {
            //the objectId are 12 byte binary data, hence their equality is checked
            //using .equals operator instead of == or === which doesn't work
            if (dish.comments.id(req.params.commentId).author.equals(req.user._id)){
                dish.comments.id(req.params.commentId).remove();
                dish.save()
                .then((dish)=>{
                    Dishes.findById(dish._id)
                    .populate('comments.author')
                    .then(dish=>{
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(dish);
                    }) 
                },err => next(err))
            } 
            else {
                err = new Error('You are not authorized to delete this comment');
                err.status = 403;
                //this will pass the error to the error handler in App.js to be handled there
                return next(err);
            }
        }
    },err => next(err))
    .catch(err => next(err));
})

module.exports = dishRouter;