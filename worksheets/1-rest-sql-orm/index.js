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
    
    //Part 1
    app.get("/users", (req, res) => {

      db.query(
        'select email,details from users order by created_at'
        ).then(users => {res.send(users)}
        );
     });

     app.get("/users/:id", (req, res) => {

      db.query(
        'select email,details from users where id = $1 order by created_at', [req.params.id]
        ).then(users => {res.send(users)}
        );
     });

     app.get("/products", (req, res) => {

      if(req.query.title != null)
      {
        db.query(
          'select * from products where title = $1', [req.query.title]
          ).then(products => {res.send(products)}
          );
      }
      else
      {
        db.query(
          'select * from products'
          ).then(products => {res.send(products)}
          );
      }

     });

     app.get("/products/:id", (req, res) => {

      db.query(
        'select * from products where id = $1', [req.params.id]
        ).then(products => {res.send(products)}
        );
     });

     app.get("/purchases", (req, res) => {

      db.query(
        'SELECT purchases.name, purchases.address, users.email, purchase_items.price, purchase_items.quantity, purchase_items.state FROM purchases INNER JOIN users ON (purchases.user_id = users.id) INNER JOIN purchase_items ON (purchases.id = purchase_items.purchase_id) ORDER BY purchase_items.price DESC'
        ).then(purchases => {res.send(purchases)}
        );
     });
     //End of Part 1

     /*
     app.get("/products", (req, res) => {

      db.query(
        "select * from products where title = $1", [req.params.title]
        ).then(products => {res.send(products)}
        );
     });
     */

     
  });


const app = express();
const port = 3002;

app.get('/', (req, res) => res.send('REST Api for Lab 1'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));


