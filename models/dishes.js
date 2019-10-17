const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//This module adds a new data type 'currency' to mongoose
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const commentSchema = new Schema({
    rating: {
        type: Number,
        min:1,
        max:5,
        required: true
    },
    comment:{
        type: String,
        required: true
    },
    //author will refer to the signed user using its id
    //instead storing author information here
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
},
{
    timestamps: true
});

const dishSchema = new Schema({
    name:{
        type:String,
        required: true,
        unique: true
    },
    description:{
        type:String,
        required: true
    },
    image:{
        type:String,
        required: true
    },
    category:{
        type:String,
        required: true
    },
    label:{
        type:String,
        default: ''
    },
    price:{
        type: Currency,
        required: true,
        min: 0
    },
    featured:{
        type: Boolean,
        default: false
    },
    comments: [commentSchema]
},{
    timestamps:true
});

var Dishes = mongoose.model('Dish', dishSchema);

module.exports = Dishes;