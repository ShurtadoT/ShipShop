const fs = require('fs');
const path = require('path');

// Ruta al archivo productos.json
const productosPath = path.join(__dirname, '..', 'productos.json');

// Función para obtener todos los productos
exports.getProducts = (req, res) => {
  fs.readFile(productosPath, (err, data) => {
    if (err) {
      console.error('Error reading products file:', err);
      return res.status(500).json({ message: 'Error reading products file' });
    }

    try {
      const products = JSON.parse(data).map(product => ({
        ...product,
        precio: parseFloat(product.precio)
      }));
      res.json(products);
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      res.status(500).json({ message: 'Error parsing JSON' });
    }
  });
};

// Función para obtener un producto por ID
exports.getProductById = (req, res) => {
  const productId = req.params.id;

  fs.readFile(productosPath, (err, data) => {
    if (err) {
      console.error('Error reading products file:', err);
      return res.status(500).json({ message: 'Error reading products file' });
    }

    try {
      const products = JSON.parse(data).map(product => ({
        ...product,
        precio: parseFloat(product.precio)
      }));
      const product = products.find(p => p.id === productId);

      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      res.json(product);
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      res.status(500).json({ message: 'Error parsing JSON' });
    }
  });
};

// Asegúrate de exportar correctamente las funciones
module.exports = {
  getProducts: exports.getProducts,
  getProductById: exports.getProductById
};
