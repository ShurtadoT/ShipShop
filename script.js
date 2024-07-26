document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("productModal");
    const modalTitle = document.getElementById("modalTitle");
    const modalImage = document.getElementById("modalImage");
    const modalDescription = document.getElementById("modalDescription");
    const modalPrice = document.getElementById("modalPrice");
    const span = document.querySelector('.close');
    const navbar = document.getElementById('navbar');
    const header = document.querySelector('header');
    const popupMessage = document.getElementById('popupMessage');
    const overlay = document.getElementById('overlay');
    const cartModal = document.getElementById("cartModal");
    const cartButton = document.querySelector(".cart-container");
    const cartClose = document.querySelector(".cart-close");
    const cartItemsContainer = document.getElementById("cartItems");
    const emptyCartMessage = document.getElementById("emptyCartMessage");
    const cartSummary = document.getElementById("cartSummary");
    const totalProducts = document.getElementById("totalProducts");
    const totalPrice = document.getElementById("totalPrice");
    const checkoutButton = document.getElementById('checkout');
    const checkoutModal = document.getElementById('checkoutModal');
    const checkoutClose = document.querySelector('.checkout-close');
    const backToCartButton = document.querySelector('.checkout-back');

    let cart = [];

    // Cambiar la URL para obtener los productos desde el backend
    // Obtener productos desde el backend
    fetch('http://localhost:3000/api/products')
    .then(response => response.json())
    .then(data => {
        const products = data;

        console.log('Products loaded:', products);  // Para depuración

        document.querySelectorAll('.buy-now').forEach(function (button) {
            button.addEventListener('click', function () {
                const productId = this.getAttribute('data-id');
                console.log('Button clicked, productId:', productId);  // Para depuración
                const product = products.find(p => p.id == productId);

                if (product) {
                    modalTitle.textContent = product.nombre;
                    modalImage.src = product.imagen;
                    modalDescription.textContent = product.descripcion;
                    modalPrice.textContent = "Precio: $" + product.precio;
                    toggleModal(modal, true);

                    const addToCartButton = document.querySelector('.add-to-cart-btn');
                    addToCartButton.setAttribute('data-id', productId);
                }
            });
        });
    })
    .catch(error => console.error('Error loading products:', error));


    function toggleModal(modal, show) {
        if (show) {
            modal.classList.add('show');
            modal.style.display = "block";
            setTimeout(() => {
                modal.style.opacity = "1";
                modal.style.visibility = "visible";
            }, 10); // Pequeño retraso para permitir que el CSS se aplique
        } else {
            modal.style.opacity = "0";
            modal.style.visibility = "hidden";
            setTimeout(() => {
                modal.classList.remove('show');
                modal.style.display = "none";
            }, 500); // Asegúrate de que este tiempo coincida con el tiempo de transición en CSS
        }
        navbar.style.display = show ? "none" : "block";
        header.style.display = show ? "none" : "block";
    }

    span.onclick = function () {
        toggleModal(modal, false);
    }

    window.onclick = function (event) {
        if (event.target == modal) {
            toggleModal(modal, false);
        }
    }

   // Añadir producto al carrito
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', function () {
            const productId = this.getAttribute('data-id');
            console.log('Adding to cart, productId:', productId);  // Para depuración

            fetch('http://localhost:3000/api/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ productId: productId }),
            })
            .then(response => response.json())
            .then(data => {
                console.log('Product added to cart:', data);  // Para depuración

                // Actualizar el contador del carrito primero
                updateCartCount();

                // Luego actualizar el modal
                updateCartModal();

                if (data.product && data.product.nombre) {
                    popupMessage.textContent = `Se ha añadido al carrito: ${data.product.nombre}`;
                } else {
                    popupMessage.textContent = `Se ha añadido al carrito: Producto ${productId}`;
                }
                popupMessage.classList.add('show');
                overlay.style.display = 'block';

                setTimeout(() => {
                    popupMessage.classList.remove('show');
                    overlay.style.display = 'none';
                    toggleModal(modal, false);
                }, 1500);
            })
            .catch(error => console.error('Error adding product to cart:', error));
        });
    });



    cartButton.addEventListener('click', function () {
        updateCartModal();
        toggleModal(cartModal, true);
    });

    cartClose.onclick = function () {
        toggleModal(cartModal, false);
    }

    window.onclick = function (event) {
        if (event.target == cartModal) {
            toggleModal(cartModal, false);
        }
    }

    function createCartItem(item) {
        const cartItem = document.createElement("div");
        cartItem.classList.add("cart-item");
        cartItem.innerHTML = `
            <p class="item-name">${item.nombre}</p>
            <p class="item-price">$${item.precio.toFixed(2)}</p>
            <button class="remove-item" data-id="${item.id}">Remove</button>
        `;
        cartItem.querySelector('.remove-item').addEventListener('click', function () {
            removeCartItem(item.id);
        });
        return cartItem;
    }
    

    // Eliminar producto del carrito
    function removeCartItem(id) {
        fetch(`http://localhost:3000/api/cart/${id}`, {
            method: 'DELETE',
        })
        .then(response => response.json())
        .then(data => {
            console.log('Product removed from cart:', data);  // Para depuración
            updateCartModal();
            updateCartCount();
        })
        .catch(error => console.error('Error removing product from cart:', error));
    }

    // Obtener carrito desde el backend y actualizar el modal del carrito
    function updateCartModal() {
        fetch('http://localhost:3000/api/cart')
        .then(response => response.json())
        .then(cartData => {
            console.log('Cart data:', cartData);  // Para depuración
            cartItemsContainer.innerHTML = '';
    
            if (cartData.length === 0) {
                emptyCartMessage.style.display = 'block';
                cartSummary.style.display = 'none';
            } else {
                emptyCartMessage.style.display = 'none';
                cartSummary.style.display = 'block';
    
                cartData.forEach(item => {
                    item.precio = parseFloat(item.precio); // Asegúrate de que el precio sea un número
                    const cartItem = createCartItem(item);
                    cartItemsContainer.appendChild(cartItem);
                });
    
                const totalItems = cartData.length;
                const totalAmount = cartData.reduce((sum, item) => sum + item.precio, 0); // Asegúrate de que el precio sea un número
                totalProducts.textContent = totalItems;
                totalPrice.textContent = totalAmount.toFixed(2);
            }

            updateCartCount(); // Asegúrate de actualizar el contador del carrito
        })
        .catch(error => console.error('Error loading cart:', error));
    }

    function updateCartCount() {
        console.log('Updating cart count'); // Para depuración
        fetch('http://localhost:3000/api/cart') // Asegúrate de que la URL sea correcta
            .then(response => response.json())
            .then(cart => {
                let itemCount = cart.length;
                console.log('Cart item count:', itemCount); // Para depuración
                setTimeout(() => {
                    document.querySelector('.cart-count').textContent = itemCount; // Usar querySelector para clases
                }, 0); // Forzar actualización del DOM
            })
            .catch(error => console.error('Error fetching cart:', error));
    }
    
    
    // Llamar a la función al cargar la página para asegurarse de que el conteo esté actualizado
    document.addEventListener('DOMContentLoaded', updateCartCount);
    

    checkoutButton.addEventListener('click', function () {
        toggleModal(cartModal, false);
        toggleModal(checkoutModal, true);
    });

    checkoutClose.onclick = function () {
        toggleModal(checkoutModal, false);
        toggleModal(cartModal, true);
    };

    backToCartButton.onclick = function () {
        toggleModal(checkoutModal, false);
        toggleModal(cartModal, true);
    };
    

    function updateOrderSummary() {
        const orderSummary = document.getElementById("orderSummary");
        orderSummary.innerHTML = "";

        if (cart.length === 0) {
            orderSummary.innerHTML = "<p>El carrito está vacío.</p>";
        } else {
            let total = 0;
            cart.forEach(item => {
                const productDiv = document.createElement("div");
                productDiv.classList.add("order-item");
                productDiv.innerHTML = `
                    <p class="order-item-name">${item.name}</p>
                    <p class="order-item-price">$${item.price.toFixed(2)}</p>
                `;
                orderSummary.appendChild(productDiv);
                total += item.price;
            });

            const totalDiv = document.createElement("div");
            totalDiv.classList.add("order-total");
            totalDiv.innerHTML = `
                <p>Total:</p>
                <p>$${total.toFixed(2)}</p>
            `;
            orderSummary.appendChild(totalDiv);
        }
    }

    checkoutButton.addEventListener('click', function () {
        toggleModal(cartModal, false);
        setTimeout(() => {
            updateOrderSummary();
            toggleModal(checkoutModal, true);
        }, 500); // Asegúrate de que este tiempo coincida con el tiempo de transición en CSS
    });

    checkoutClose.onclick = function () {
        toggleModal(checkoutModal, false);
    }

    document.getElementById('cancelPayment').addEventListener('click', function () {
        toggleModal(checkoutModal, false);
    });

    window.onclick = function (event) {
        if (event.target == checkoutModal) {
            toggleModal(checkoutModal, false);
        }
    }

    backToCartButton.addEventListener('click', function () {
        toggleModal(checkoutModal, false);
        setTimeout(() => {
            toggleModal(cartModal, true);
        }, 500); // Asegúrate de que este tiempo coincida con el tiempo de transición en CSS
    });

    const searchButton = document.querySelector(".search-button");
    const searchInput = document.querySelector("#input");

    const performSearch = () => {
        const query = searchInput.value.toLowerCase();
        const links = document.querySelectorAll("nav ul a");
        let found = false;

        searchButton.disabled = true;
        links.forEach(link => {
            if (link.textContent.toLowerCase().includes(query)) {
                window.location.href = link.getAttribute("href");
                found = true;
            }
        });

        if (!found) {
            alert("No se encontraron resultados para su búsqueda.");
        }

        searchButton.disabled = false;
    };

    searchButton.addEventListener("click", performSearch);

    searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            performSearch();
        }
    });
});
