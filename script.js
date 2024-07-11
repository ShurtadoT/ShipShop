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

    let cart = [];

    fetch('productos.json')
        .then(response => response.json())
        .then(data => {
            const products = data.productos;

            document.querySelectorAll('.buy-now').forEach(function (button) {
                button.addEventListener('click', function () {
                    const productId = this.getAttribute('data-id');
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

    document.querySelector('.add-to-cart-btn').addEventListener('click', function () {
        const productId = this.getAttribute('data-id');
        const productName = modalTitle.textContent;
        const productPrice = parseFloat(modalPrice.textContent.replace('Precio: $', ''));

        cart.push({ id: productId, name: productName, price: productPrice });
        updateCartModal();
        updateCartCount();

        popupMessage.textContent = `Se ha añadido al carrito: ${productName}`;
        popupMessage.classList.add('show');
        overlay.style.display = 'block';

        setTimeout(() => {
            popupMessage.classList.remove('show');
            overlay.style.display = 'none';
            toggleModal(modal, false);
        }, 1500);
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
            <p class="item-name">${item.name}</p>
            <p class="item-price">$${item.price.toFixed(2)}</p>
            <button class="remove-item" data-id="${item.id}">Remove</button>
        `;
        cartItem.querySelector('.remove-item').addEventListener('click', function () {
            removeCartItem(item.id);
        });
        return cartItem;
    }

    function removeCartItem(itemId) {
        console.log(`Before removal: ${JSON.stringify(cart)}`);  // Mensaje de depuración
        // Filtra el carrito para eliminar solo el elemento seleccionado
        cart = cart.filter(item => item.id !== itemId);
        console.log(`After removal: ${JSON.stringify(cart)}`);  // Mensaje de depuración
        // Actualiza el modal del carrito
        updateCartModal();
        updateCartCount();
    }

    function updateCartModal() {
        cartItemsContainer.innerHTML = "";

        if (cart.length === 0) {
            emptyCartMessage.style.display = "block";
            cartSummary.style.display = "none";
        } else {
            emptyCartMessage.style.display = "none";
            cartSummary.style.display = "block";

            let total = 0;
            cart.forEach(item => {
                const cartItem = createCartItem(item);
                cartItemsContainer.appendChild(cartItem);
                total += item.price;
            });

            totalProducts.textContent = cart.length;
            totalPrice.textContent = total.toFixed(2);
        }
    }

    function updateCartCount() {
        const cartCountElement = document.querySelector('.cart-count');
        cartCountElement.textContent = cart.length;
    }

    document.getElementById('continueShopping').addEventListener('click', function () {
        toggleModal(cartModal, false);
        window.location.href = '#productos';
    });

    checkoutButton.addEventListener('click', function () {
        toggleModal(cartModal, false);
        setTimeout(() => {
            toggleModal(checkoutModal, true);
        }, 500); // Asegúrate de que este tiempo coincida con el tiempo de transición en CSS
    });

    checkoutClose.onclick = function () {
        toggleModal(checkoutModal, false);
    }

    window.onclick = function (event) {
        if (event.target == checkoutModal) {
            toggleModal(checkoutModal, false);
        }
    }


    
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
