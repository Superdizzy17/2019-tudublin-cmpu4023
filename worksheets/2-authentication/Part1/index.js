const express = require('express');
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
  }).then(db => {

    // Get all users 
    app.get("/users", (req, res) => {
        db.query(
          "select * from users"
          ).then(users => {res.send(users)}
          );
       });

    // Insert user with username and password 
    // where the password is encrypted using 
    // crypt() and gen_salt()
    app.post("/users", (req, res) =>{
      db.query("insert into users (username,password) values ('" + 
      req.query.username+"', crypt('" + 
      req.query.password +"', gen_salt('bf', 8)))").
      then(res.send("Successfully added"));
    });
  
    /*
    app.post("/users/:username/:password", (req, res) =>{

      var username = req.params.username;
      var password = req.params.password;

      db.query("insert into users (username,password) values ('$1', crypt('$1', gen_salt('bf', 8)))", [username,password]).
      then(res.send("Successfully added"));
    });
    */
   
    // Protected resource table products
    // Have to have a valid username and password 
    // in order to query the products table
    app.post("/products", function(req, res){
      var username = req.query.username;
  
      db.query("select username, password from users where username = '"
      +username+"' AND password = crypt('"
      +req.query.password+"', password);")
      .then(user => {
      if(user[0].username == username)
      {
        db.query("select * from products").then(products => {
          res.send(products);
        })
      }
      else {
        res.send("Username is invalid");
      }
      }).catch(err => {res.send("Invalid Login: Username or Password Incorrect")})
  })
  
});


const app = express();
const port = 3001;

app.get('/', (req, res) => res.send('Authentication for lab 2'));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));