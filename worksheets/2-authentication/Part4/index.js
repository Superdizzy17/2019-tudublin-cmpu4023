const express = require("express");
const http = require("http");
const massive = require("massive");
const bodyParser = require("body-parser");
const CryptoJS = require("crypto-js");
const Base64 = require("crypto-js/enc-base64");

const app = express();
app.use(bodyParser.json());

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
    app.set("db", instance);

    // This endpoint is publicly accessible (by choice)
    app.get("/products/:id", (req, res) => {
        req.app
            .get("db")
            .query("select * from products where id = $1", [req.params.id])
            .then(items => {
                res.status(200).json(items);
            })
            .catch(error => res.status(400).send(error));
    });

    // This endpoint must be protected with authentication
    app.post("/products", authenticate, (req, res) => {
        instance.query("select * from products").then(products => {
            console.log(products);
          })
          res.status(200).send("Successfully authenticated");
    });

    // Authentication middleware for protected endpoints
function authenticate(req, res, next) {
    /*
     * The steps for implementing this function are as follows:
     * 
     *  1. Extract the authorization header from req.headers
     *  2. You can have formatted this header any way you like but if you want it to
     *     work with the example client in this repo it needs to be of the form:
     *         HMAC-SHA256 Key=KEY Signature=SIGNATURE
     *  3. Parse the header and extract the values of KEY and SIGNATURE
     *  4. Query the database for the access key matching KEY and compute the signature
     *     from the secret key. You can compute this in the database or in Express
     *     whichever you prefer (although the former is a more secure implementation)
     *  5. Compare the computed signature with SIGNATURE (from the request). If they
     *     match then call next(), otherwise respond with a 401
     */

    auth = req.headers.authorization;
    //console.log(auth);

    key = auth.slice(16,25);
    //console.log(key);

    signature = auth.slice(36,);
    console.log(signature);

   instance.query("select * from users where access_key='"
    +key+"'")
    .then(user => {
        //console.log(user[0].secret_key);
        data = 'http://' + req.headers.host + req.url + req.body.value + key;
        crypt = CryptoJS.HmacSHA256(data, user[0].secret_key);
        secret_signature = Base64.stringify(crypt);

        if(secret_signature == signature)
        {
            next();
        }
        else
        {
            res.status(401).send("Signature does not match");
        }
    })  

}
    http.createServer(app).listen(3003);
});

