const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Ruta para obtener todos los productos
router.get('/', productController.getProducts);

// Ruta para obtener un producto por ID
router.get('/:id', productController.getProductById);

module.exports = router;
