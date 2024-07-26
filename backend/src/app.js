const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const productsRouter = require('./routes/products');
const cartRouter = require('./routes/cart');
const cors = require('cors');

app.use(cors());
app.use(express.json()); // Asegúrate de que puedas parsear JSON en las peticiones

// Rutas
app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

app.use(express.static(path.join(__dirname, 'src')));

// Iniciar servidor
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
