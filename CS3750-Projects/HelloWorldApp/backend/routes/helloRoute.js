const express = require('express');
const router = express.Router();
const dbo = require("../db/conn");

// Route to add a "Hello, World!" message
router.route('/addHello').post(async (req, res) => {
    try {
        const dbConnect = dbo.getDb();
        const message = { message: 'Hello, World!' };
        const collection = dbConnect.collection("group9");
        await collection.insertOne(message);
        res.json({ message: 'Message added!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Route to get the "Hello, World!" message
router.route('/hello').get(async (req, res) => {
    try {
        const dbConnect = dbo.getDb();
        const collection = dbConnect.collection("group9");
        const message = await collection.findOne({});
        res.json(message);  
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;