const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.iikigzo.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        const servicesCollection = client.db('assignment11').collection('services');
        const reviewCollection = client.db('assignment11').collection('review');
        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = servicesCollection.find(query);
            const services = await cursor.sort({ date: -1 }).limit(3).toArray();
            res.send(services);
        })
        app.get('/allservices', async (req, res) => {
            const query = {}
            const cursor = servicesCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })
        app.get('/reviews', async (req, res) => {
            let query = {}
            if (req.query.service) {
                query = {
                    service: req.query.service
                }
            }
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        })

        app.get('/myreviews', async (req, res) => {
            let query = {}
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = reviewCollection.find(query);
            const myreviews = await cursor.sort({ date: -1 }).toArray();
            res.send(myreviews);
        })

        app.get('/myreview/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const myreview = await reviewCollection.findOne(query);
            res.send(myreview);
        })

        app.put('/myreview/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const revie = req.body;
            const option = { upsert: true };
            const updateReview = {
                $set: {
                    name: revie.name,
                    review: revie.review
                }
            }
            const result = await reviewCollection.updateOne(filter, updateReview, option);
            res.send(result);
        })

        app.delete('/myreviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await reviewCollection.deleteOne(query);
            res.send(result);
        })

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.send(service);
        })

        app.post('/addservice', async (req, res) => {
            const addservice = req.body;
            const result = await servicesCollection.insertOne(addservice);
            res.send(result);
        })

        app.post('/addreview', async (req, res) => {
            const addreview = req.body;
            const result = await reviewCollection.insertOne(addreview);
            res.send(result);
        })
    }
    finally {

    }
}
run().catch(err => console.error(err))


app.get('/', (req, res) => {
    res.send('assignment-11-swerver is running')
})

app.listen(port, () => {
    console.log(`assignment 11 server is running on port ${port}`);
})