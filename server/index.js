const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const itemRoutes = require('./routes/itemRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const riderRoutes = require('./routes/riderRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
    res.send("Welcome to EComm Server");
});

const PORT = process.env.PORT || 8001;

app.use('/auth', authRoutes);
app.use('/items', itemRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', orderRoutes);
app.use('/rider', riderRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to DB');
    app.listen(PORT, () => {
      console.log(`Server Started at port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log('Error in DB Connection');
    console.error(err);
  });

