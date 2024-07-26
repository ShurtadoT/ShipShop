const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const cartFilePath = path.join(__dirname, '..','cart.json');

// Leer el contenido del carrito
const readCartFile = () => {
    try {
        if (!fs.existsSync(cartFilePath)) {
            fs.writeFileSync(cartFilePath, '[]');
        }
        const data = fs.readFileSync(cartFilePath, 'utf8');
        return JSON.parse(data).map(item => ({
            ...item,
            precio: parseFloat(item.precio)
        }));
    } catch (error) {
        console.error('Error reading cart file:', error);
        return [];
    }
};

// Escribir en el archivo del carrito
const writeCartFile = (cart) => {
    try {
        fs.writeFileSync(cartFilePath, JSON.stringify(cart, null, 2));
    } catch (error) {
        console.error('Error writing to cart file:', error);
    }
};

// Obtener el carrito
router.get('/', (req, res) => {
    const cart = readCartFile();
    res.json(cart);
});

// Añadir un producto al carrito
router.post('/', (req, res) => {
    const { productId } = req.body;
    const productsFilePath = path.join(__dirname, '..', 'productos.json');

    if (!fs.existsSync(productsFilePath)) {
        return res.status(500).json({ message: 'Products file not found' });
    }

    const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf8')).map(product => ({
        ...product,
        precio: parseFloat(product.precio)
    }));
    const product = products.find(p => p.id == productId);

    if (product) {
        const cart = readCartFile();
        cart.push(product);
        writeCartFile(cart);
        res.json({ message: 'Product added to cart', product });
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
});

// Eliminar un producto del carrito
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    let cart = readCartFile();
    cart = cart.filter(item => item.id != id);
    writeCartFile(cart);
    res.json({ message: 'Product removed from cart' });
});

module.exports = router;
