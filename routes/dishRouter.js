const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const Dishes = require('../models/dishes');
const cors = require('./cors');
const authenticate = require('../authenticate');

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

dishRouter.route('/')
/* WHen a webpage makes a cross-origin request with method other than GET,
the broweser makes a 'preflight' request with method OPTIONS. Here we are
dealing with such request by using cors.corsWithOptios middleware which sets
the ACAO header to the origini of the request if the origin is in the whitelist.
The whitelist is declared where cors middleware is configured.
*/
.options(cors.corsWithOptions, (req, res)=>{
    res.sendStatus = 200;
})
.get(cors.cors,(req,res,next) => {
    // res.end('Will send all the dishes to you!');
    Dishes.find(req.query)
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
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
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
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Dishes.remove({})
    .then((resp)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    },err => next(err))
    .catch(err => next(err));
})

dishRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res)=>{
    res.sendStatus = 200;
})
.get(cors.cors, (req,res,next) => {
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
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  res.statusCode = 403;
  res.end('POST operation not supported on /dishes/'+ req.params.dishId);
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
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
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    //res.end('Deleting dish: ' + req.params.dishId);
    Dishes.findByIdAndRemove(req.params.dishId)
    .then((resp)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    },err => next(err))
    .catch(err => next(err));
})

module.exports = dishRouter;