const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId
require('dotenv').config();
const cors = require('cors');

const app = express();
const port = 5000;

// middleware
app.use(cors());
app.use(express.json());

// Travel11
// jv2oT2QhAEXIiTZm

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xqctd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        console.log('connected to db')
        const database = client.db('travel11');
        const servicesCollection = database.collection('services')
        const ordersCollection = database.collection('orders')
        

//      // GET API

        app.get('/services', async (req,res)=>{
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);

        })
//      //Get single services
        app.get('/services/:id', async (req, res)=> {
            const id = req.params.id;
            const query = { _id: ObjectId(id)};
            const service = await servicesCollection.findOne(query);
            res.json(service);
        })

//      //ORDER GET API

        app.get('/orders', async (req,res)=>{
            const cursor = ordersCollection.find({});
            const orders = await cursor.toArray();
            res.send(orders);

        })
        
        // POST API
        app.post('/services', async(req, res)=>{
            const service = req.body;
            console.log('hit the',service)   
            const result = await servicesCollection.insertOne(service);
            console.log(result)
            res.json(result)
        });

        // Order POST API
        app.post('/orders', async(req, res)=>{
            const service = req.body;
            console.log('hit the',service)   
            const result = await ordersCollection.insertOne(service);
            console.log(result)
            res.json(result)
        });

        // DELETE API
        app.delete('/services/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const result = await servicesCollection.deleteOne(query)
            res.json(result)
        })
    }
    finally{
        //await.client.close();
    }

}
run().catch(console.dir)





app.get('/',(req, res)=>{
    res.send('i am the response from server')
});

app.listen(port, ()=>{
    console.log('server running', port)
})