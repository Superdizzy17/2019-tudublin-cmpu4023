const express = require('express')
const bodyParser = require('body-parser')
const port = 3006
const app = express()
const { User, Product, Purchase, PurchaseItem } = require('./sequelize')

app.use(bodyParser.json())

//Start Screen
app.get('/', (req, res) => res.send('REST Api using express and sequelize for lab 1'));

// Get product by id
app.get('/products/:id', (req, res) => {
    Product.findById(req.params.id)
	.then(items => res.json(items))
})

// Get all products or product filtered by title
app.get('/products', (req, res) => {
	let query;
    if(req.query.title) {
        query = Product.findAll({where: {title: req.query.title}})
    } else {
        query = Product.findAll()
    }
    return query.then(items => res.json(items))
})

// Create a new product 
app.post('/products', (req, res) => {
    if(req.query.name && req.query.price) {
        Product.build({ title: req.query.name, price: req.query.price, created_at: new Date()})
		  .save()
		  .catch(function(error) {console.log(error)
		})
		output = 'Product created name = ' + req.query.name +
				' price = ' + req.query.price
    } else {
        output = 'Enter product name and price'
    }
    return res.send(output)
})

// Update product with id
app.put('/products/:id', (req, res) => {
	Product.update(
	  { title: req.query.title },
	  { where: { id: req.params.id } }
	)
	.then(result =>
		Product.findById(req.params.id)
		.then(items => res.json(items))
	)
	.catch(err =>res.send(err))
})

// Delete product with id
app.delete('/products/:id', (req, res) => {
	Product.count({ where: { id: req.params.id } })
    .then(count => {
        if (count != 0) {
            Product.destroy({where: {id: req.params.id}})
			return res.send('Product with id = ' + req.params.id +  ' deleted')
        } else {
			return res.send('Product with id = ' + req.params.id + ' does not exist')
		}
	})
})

app.listen(port, () => console.log(`REST API using express and sequelize listening on port ${port}!`))