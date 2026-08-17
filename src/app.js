const express = require('express');
const productRoutes = require('./routes/product.routes');

const app = express();

app.use(express.json());

app.get('/api/status', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API is running' });
});

app.use('/api/products', productRoutes);

module.exports = app;
