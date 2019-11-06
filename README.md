# Backend for a Restaurant
This project serves as a backend for a restaurant website. It implements REST API using Express, manages data using MongoDB + Mongoose, and implements user authenticatin using Passport. It also supports OAUTH using Facebook.
The project was done just as an exercise to understand the concepts involved in its implementation. I understand that it may not meet the standards of a real-word production software.


# Installation
1. Clone or download this repository.
2. Go to the directory of the project and run the following command in the terminal window to install all dependencies:
`npm install`

# Running the Server
1. Make sure the MongoDB server is running.
2. Configure the url of MongoDB in config.js file in the root folder.
3. Configure the port and secure port (for https) in `./bin/www` file.
4. Configure CORS if cross origin requests are expected.
4. Run `npm run` command in the terminal to start the server.

# API 

## '/users'
This endpoint lets you get details of existing users, register a new user, and login and logout a user. It supports following operations:

### GET
* Returns all users from the database
* Only Admin users can perform this operation
* Requests from only same-origin or whitelisted cross-origins are allowed

## '/users/signup'
This endpoint lets you register a new user.

### POST
* Adds a new user to the database. Refer to './models/users.js' for the schema of a user. All of the necessary information needs to be provided in the body of the request.
* No authentication required
* Requests from only same-origin or whitelisted cross-origins are allowed

## '/users/login'
This endpoint lets you login an existing user. 

### POST
* Log-in an existing user. The first request should contain the username and password in the body of the request. The server then responds with a Jason Web Token which needs to be included in the Header of subsequent requests as 'Bearer Token' to keep the user logged in
* Requests from only same-origin or whitelisted cross-origins are allowed

## '/facebook/token'
This endpoint let users login using their facebook accounts. The developer needs to get their clientID and clientSecret from Facebook and put it in the './config.js' file. 

## '/dishes'
This endpoint lets you interact with all of the dishes in the restaurant's database. It supports following operations:

### GET
* Returns all of the dishes in the database
* No authentication required
* Requests from cross-origin are allowed

### PUT
PUT operation is not supported on this endpoint

### POST
* Adds a new dish to the database. Refer to './models/dishes.js' for the schema of a dish
* Only Admin users can perform this operation
* Requests from only same-origin or whitelisted cross-origins are allowed

### DELETE
* Deletes all dishes from the database
* Only Admin users can perform this operation
* Requests from only same-origin or whitelisted cross-origins are allowed

## '/dishes/:dishId'
This endpoint lets you interact with a specific dish in the restaurant's database. It supports following operations:

### GET
* Returns the dish which has its id matching the `dishId` contained in the request
* No authentication required
* Requests from cross-origin are allowed

### PUT
* Edits the dish with the specified id using the data from the body of the request
* Only Admin users can perform this operation
* Requests from only same-origin or whitelisted cross-origins are allowed

### POST
POST operation is not supported on this endpoint

### DELETE
* Deletes the dish with the speicified id. 
* Only Admin users can perform this operation
* Requests from only same-origin or whitelisted cross-origins are allowed

## '/comments'
This endpoint lets you interact with comments in the restaurant's database. It supports following operations:

### GET
* Returns all comments
* No authentication required
* Requests from cross-origin are allowed

### PUT
* PUT operation is not supported on this endpoint

### POST
* Adds a new comment to the database. Refer to './models/comments.js' for the schema of a comment
* Only signed-in users can perform this operation
* Requests from only same-origin or whitelisted cross-origins are allowedf

### DELETE
* Deletes all of the comments 
* Only Admin users can perform this operation
* Requests from only same-origin or whitelisted cross-origins are allowed

## '/comments/:commentId'
This endpoint lets you interact with a specific comment in the restaurant's database. It supports following operations:

### GET
* Returns the specified comment 
* Only signed-in user can perform this opertion
* Requests from cross-origin are allowed

### PUT
* Edits the specified comment 
* Only the original poster of the comment can perform this operation
* Requests from only same-origin or whitelisted cross-origins are allowedf

### POST
* POST operation is not supported on this endpoint

### DELETE
* Deletes the specified comment 
* Only the original poster of the comment can perform this operation
* Requests from only same-origin or whitelisted cross-origins are allowed

## '/leaders'
This endpoint lets you interact with all of the leaders (key people) in the restaurant's database. It supports following operations:

### GET
* Returns all of the leaders in the database
* No authentication required
* Requests from cross-origin are allowed

### PUT
PUT operation is not supported on this endpoint

### POST
* Adds a new leader to the database. Refer to './models/leaders.js' for the schema of a dish
* Only Admin users can perform this operation
* Requests from only same-origin or whitelisted cross-origins are allowed

### DELETE
* Deletes all leaders from the database
* Only Admin users can perform this operation
* Requests from only same-origin or whitelisted cross-origins are allowed

## '/leaders/:leaderId'
This endpoint lets you interact with a specific leader in the restaurant's database. It supports following operations:

### GET
* Returns the leader which has its id matching the `leaderId` contained in the request
* No authentication required
* Requests from cross-origin are allowed

### PUT
* Edits the leader with the specified id using the data from the body of the request
* Only Admin users can perform this operation
* Requests from only same-origin or whitelisted cross-origins are allowed

### POST
POST operation is not supported on this endpoint

### DELETE
* Deletes the leader with the speicified id. 
* Only Admin users can perform this operation
* Requests from only same-origin or whitelisted cross-origins are allowed

## '/promotions'
This endpoint lets you interact with all of the promotions in the restaurant's database. It supports following operations:

### GET
* Returns all of the promotions in the database
* No authentication required
* Requests from cross-origin are allowed

### PUT
PUT operation is not supported on this endpoint

### POST
* Adds a new promotion to the database. Refer to './models/promotion.js' for the schema of a dish
* Only Admin users can perform this operation
* Requests from only same-origin or whitelisted cross-origins are allowed

### DELETE
* Deletes all promotions from the database
* Only Admin users can perform this operation
* Requests from only same-origin or whitelisted cross-origins are allowed

## '/promotions/:promoId'
This endpoint lets you interact with a specific promotion in the restaurant's database. The id of the specific prmotion needs to be provided as a query parameter. It supports following operations:

### GET
* Returns the promotion which has its id matching the `dishId` contained in the request
* No authentication required
* Requests from cross-origin are allowed

### PUT
* Edits the promotion with the specified id using the data from the body of the request
* Only Admin users can perform this operation
* Requests from only same-origin or whitelisted cross-origins are allowed

### POST
POST operation is not supported on this endpoint

### DELETE
* Deletes the promotion with the speicified id. 
* Only Admin users can perform this operation
* Requests from only same-origin or whitelisted cross-origins are allowed
