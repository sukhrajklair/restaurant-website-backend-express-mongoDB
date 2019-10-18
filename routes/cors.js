const express = require('express');
const cors = require('cors');
const app = express();

const whitelist = ['http://localhost:3000','https://localhost:3443'];
const corsOptionsDelegate = (req, callback) => {
    let corsOptions;
    //if the request origin is in the whitelist, cors module will include
    //Access-Control-Allow-Origin header set to the request's origin
    if (whitelist.indexOf(req.header('Origin')) !== -1) {
        corsOptions = { origin:true }
    }
    //if the request origin is not in the whitelist, cors module will not
    //include Access-Control-Allow-Origin header and 
    else {
        corsOptions = { origin:false}
    }
    callback(null, corsOptions);
};

/* The following express middlewares can be used to tell the browser whether
the request method at a certain endpoint is allowed from a certain origin
*/
//When this is invoked, it sends ACAO header set to * which allows cross-origin
//requests from all domain
exports.cors = cors();
//when this is invoked it sends ACAO header set to the origin of the request
//if the origin is in the whitelist else it doesn't send the ACAO header at all
exports.corsWithOptions = cors(corsOptionsDelegate);