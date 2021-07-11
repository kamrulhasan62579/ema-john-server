var express = require('express')
var bodyParser = require('body-parser')

var cors = require('cors')
var app = express()
require('dotenv').config()


const { MongoClient } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.njdea.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors())

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


client.connect(err => {
  const collection = client.db("eProducts").collection("products");
  const ordersCollection = client.db("eProducts").collection("orders");
  console.log('Database connected');

  app.post('/addOrder', (req, res) =>{
    ordersCollection.insertOne(req.body)
    .then(result => {
      console.log('successfully placed order')
      res.send(result.insertedCount > 0 )
    })
  })

  app.get('/products', (req, res) =>{
      collection.find({})
      .toArray((err, documents) =>{
          res.send(documents)
      })
  })

  app.get(`/product/:key`, (req, res) =>{
    console.log();
    collection.find({key: req.params.key})
    .toArray((err, documents) =>{
      res.send(documents[0])
    })
  })

  app.post('/addProduct', (req, res) =>{
      collection.insertOne(req.body)
      .then(result =>{
          console.log(result);
      })
  })
});


app.get('/', function (req, res) {
  res.send('hello world')
})

app.listen(process.env.PORT || 4001, () => console.log("Listening from 4001"))