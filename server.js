const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Atlas URI - Replace <username>, <password>, and <database>
const dbURI = "mongodb+srv://admin:<db_password>@chocolatestoredb.pgybc.mongodb.net/?retryWrites=true&w=majority&appName=ChocolateStoreDB";

// Connect to MongoDB Atlas
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define a schema for orders
const orderSchema = new mongoose.Schema({
    name: String,
    tel: String,
    transactionId: String,
    totalAmount: Number,
    cart: [
        {
            id: Number,
            name: String,
            price: Number
        }
    ]
});

// Create a model for orders
const Order = mongoose.model('Order', orderSchema);

// Endpoint to save an order
app.post('/orders', async (req, res) => {
    try {
        const order = new Order(req.body);
        await order.save();
        res.status(201).send({ message: "Order saved successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: "Failed to save order." });
    }
});

// Endpoint to fetch all orders (optional)
app.get('/orders', async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: "Failed to fetch orders." });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
