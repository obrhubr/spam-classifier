const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios')
const app = express();
const { Spam } = require("./models/Spam");
var cors = require('cors');
 
app.use(cors());
app.use(express.json());

console.log(`Connecting to mongodb database at url: mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@mongo:27017/spam-classifier?authSource=admin`);
mongoose.connect(`mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@mongo:27017/spam-classifier?authSource=admin`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

app.post('/predict', async (req, res) => {
    try {
        var response = await axios
        .post('http://ml-api:3003/predict', {
            text: req.body.text
        });
        res.json(response.data)
    } catch (e) {
        res.status(500).json({'error': 'Could not reach ML api.', 'description': e})
    }
});

app.post('/newdata', async (req, res) => {
    var label = parseInt(req.body.label);
    if (!((req.body.label == 0) || (req.body.label == 1))) {
        res.status(400).json({ 'error': 'label has to be either 0 or 1' })
        return;
    };
    var data = { text: req.body.text, label: label}
    let card = new Spam(data);
    await card.save();
    res.json(card)
});

app.post('/retrain', async (req, res) => {
    try {
        var response = await axios
        .post('http://ml-train:3002/retrain', {
            text: req.body.text
        });
        res.json(response.data);
    } catch (e) {
        res.status(500).json({'error': 'Could not reach ML api.', 'description': e});
    }
});

app.post('/retrain-scratch', async (req, res) => {
    try {
        var response = await axios
        .post('http://ml-train:3002/retrain_scratch', {
            text: req.body.text
        });
        res.json(response.data);
    } catch (e) {
        res.status(500).json({'error': 'Could not reach ML api.', 'description': e})
    }
});

app.post('/status', async (req, res) => {
    try {
        var response = await axios
        .post('http://ml-api:3003/status', {
            
        });
        modelStatus = response.data.Message;
        mongoStatus = await Spam.estimatedDocumentCount();
        res.json({status: {model: modelStatus, mongodata: mongoStatus}});
    } catch (e) {
        res.status(500).json({'error': 'Could not reach ML api.', 'description': e})
    }
});

app.listen(3001, () => {
    console.log(`App listening at http://localhost:${3001}`)
});