const express = require('express');
const massive = require('massive');

massive({
    host: 'localhost',
    port: 5432,
    database: 'pgguide',
    user: 'postgres',
    password: 'C15321906',
    ssl: false,
    poolSize: 10
  }).then(db => {
    
    //Get all users 
    app.get("/users", (req, res) => {

      db.query(
        "select email,details::json->>'sex' as sex from users order by created_at"
        ).then(users => {res.send(users)}
        );
     });

     //Get specific user by id
     app.get("/users/:id", (req, res) => {

      db.query(
        "select email,details::json->> 'sex' as sex from users where id = $1 order by created_at", [req.params.id]
        ).then(users => {res.send(users)}
        );
     });

     //Get all products or specific product by title
     app.get("/products", (req, res) => {
      //Hackable solution
      if(req.query.title != null)
      {
        db.query(
          "SELECT * FROM products WHERE title='"+req.query.title+"'"
          ).then(products => {res.send(products)}
          );
      }
      else
      {
        db.query(
          'select * from products order by price ASC'
          ).then(products => {res.send(products)}
          );
      }
     });

    //Safe solution 1
    app.get('/products/safe/:title', (req, res) => {

      var title = req.params.title;
    
      db.query(
        "select * from products where title = $1", [title]
        ).then(products => {res.send(products)}
        );
    });
      
    // Using a stored procedure using SQL or PLPGSQL whichever you prefer
    app.get('/products_proc', (req, res) => {
      let query;
        if(req.query.title) {
            query = db.product_title(req.query.title, function(err, products){})
        } else {
            query = db.product(function(err, products){})
        }
        return query.then(items => res.json(items))
    });

    //Get product by specific id
    app.get("/products/:id", (req, res) => {

      db.query(
        'select * from products where id = $1', [req.params.id]
        ).then(products => {res.send(products)}
        );
     });

    //Get all purchases
    app.get("/purchases", (req, res) => {

      db.query(
        "SELECT purchases.name, purchases.address, users.email, purchase_items.price," + 
        "purchase_items.quantity, purchase_items.state FROM purchases INNER JOIN users ON" + 
        "(purchases.user_id = users.id) INNER JOIN purchase_items ON (purchases.id = purchase_items.purchase_id)" +
        "ORDER BY purchase_items.price DESC"
        ).then(purchases => {res.send(purchases)}
        );
     });
     
  });


const app = express();
const port = 3005;

app.get('/', (req, res) => res.send('REST Api for Lab 1'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));


