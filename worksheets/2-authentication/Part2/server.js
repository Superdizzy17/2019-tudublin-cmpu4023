var express = require('express');
var jwt = require('jsonwebtoken');
var app = express();
const massive = require('massive');

// Using massive to connect to PSQL database
massive({
    host: 'localhost',
    port: 5432,
    database: 'wks2',
    user: 'postgres',
    password: 'C15321906',
    ssl: false,
    poolSize: 10
  }).then(instance => {
      app.set('db', instance);

  // Register the home route that displays a welcome message
  // This route can be accessed without a token
  app.get('/', function(req, res){
    res.send("JWT for lab 2");
  })

  // A (pre-authentication) login API call which accepts 
  // a username and password and returns (if successful) 
  // a JWT with a set of claims. 
  // The claims should include, minimally, 
  // the user id and an expiry timestamp; 
  // the token should be set to expire no later than 24 hours
  app.post("/login", function(req, res){
    var username = req.query.username;

    instance.query("select username, password from users where username = '"
    +req.query.username+"' AND password = crypt('"
    +req.query.password+"', password);")
    .then(user => {
      console.log(user);
    if(user[0].username == username)
    {
      var token = jwt.sign({username: username}, 'supersecret',{expiresIn: 82800});
      //res.send(token);
      res.redirect("/api?token="+token);
      console.log(token);
    }
    else {
      res.send("Wrong Username");
    }

    })   
  })


  // This endpoint must be protected with authentication
  app.post("/products", authenticate, (req, res) => {
      
      //res.status(200).send("Successfully authenticated");

      instance.query("select * from products").then(products => {
        res.send(products);
      })
  });

  // A mechanism to verify client tokens as bearer tokens 
  // in a HTTP Authorization header field
  function authenticate(req, res, next) {
    /*
     * The steps for completing this function are as follows:
     * 
     *  1. Extract the authorization header from req.headers
     *  2. The needs to be of the form:
     *         BEARER JWT-TOKEN
     *  3. Parse the authorization header to extract the value of JWT-TOKEN
     *  4. Call the jwt.verify() function passing this and the public key
     *  5. If they match then call next(), otherwise respond with a 401
     */

    header = req.headers.authorization;
    console.log(req.headers.authorization);
    jwttoken = header.slice(7,);
    console.log(jwttoken);

    jwt.verify(jwttoken, 'supersecret', function(err){
      if(!err)
      {
        next();
      }
      else{
        res.status(401).send("User not found");
      }
    });
  }

// Register a route that requires a valid token to view data
app.get('/api', function(req, res){
  var token = req.query.token;
  jwt.verify(token, 'supersecret', function(err, decoded){
    if(!err){
      //var secrets = {"accountNumber" : "938291239","pin" : "11289","account" : "Finance"};
      //res.json(secrets);
        instance.query("select * from users")
        .then(products => res.send(products))

    } else {
      res.send(err);
    }
  })
})

// Launch our app on port 3000
app.listen('3002');
  });