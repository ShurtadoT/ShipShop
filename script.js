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

    let cart = [];

    fetch('productos.json')
        .then(response => response.json())
        .then(data => {
            const products = data.productos;

            document.querySelectorAll('.buy-now').forEach(function(button) {
                button.addEventListener('click', function() {
                    const productId = this.getAttribute('data-id');
                    const product = products.find(p => p.id == productId);

                    if (product) {
                        modalTitle.textContent = product.nombre;
                        modalImage.src = product.imagen;
                        modalDescription.textContent = product.descripcion;
                        modalPrice.textContent = "Precio: $" + product.precio;
                        navbar.style.display = "none";
                        modal.style.display = "block";

                        const addToCartButton = document.querySelector('.add-to-cart-btn');
                        addToCartButton.setAttribute('data-id', productId);
                    }
                });
            });
        })
        .catch(error => console.error('Error loading products:', error));

    span.onclick = function() {
        modal.style.display = "none";
        navbar.style.display = "block";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
            navbar.style.display = "block";
        }
    }

    document.querySelector('.add-to-cart').addEventListener('click', function() {
        const productId = this.getAttribute('data-id');
        const productName = modalTitle.textContent;
        const productPrice = parseFloat(modalPrice.textContent.replace('Precio: $', ''));

        cart.push({ id: productId, name: productName, price: productPrice });
        updateCartModal();

        popupMessage.textContent = `Se ha añadido al carrito: ${productName}`;
        popupMessage.classList.add('show');
        overlay.style.display = 'block';

        setTimeout(() => {
            popupMessage.classList.remove('show');
            overlay.style.display = 'none';
            modal.style.display = 'none';
            navbar.style.display = 'block';
        }, 2000); // El mensaje desaparecerá después de 2 segundos
    });

    cartButton.addEventListener('click', function() {
        updateCartModal();
        cartModal.style.display = "block";
        navbar.style.display = "none";
        header.style.display = "none";
    });

    cartClose.onclick = function() {
        cartModal.style.display = "none";
        navbar.style.display = "block";
        header.style.display = "block";
    }

    window.onclick = function(event) {
        if (event.target == cartModal) {
            cartModal.style.display = "none";
            navbar.style.display = "block";
            header.style.display = "block";
        }
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
                const cartItem = document.createElement("div");
                cartItem.classList.add("cart-item");
                cartItem.innerHTML = `
                    <p>${item.name}</p>
                    <p>$${item.price.toFixed(2)}</p>
                `;
                cartItemsContainer.appendChild(cartItem);
                total += item.price;
            });

            totalProducts.textContent = cart.length;
            totalPrice.textContent = total.toFixed(2);
        }
    }

    document.getElementById('continueShopping').addEventListener('click', function() {
        cartModal.style.display = 'none';
        navbar.style.display = 'block';
        header.style.display = 'block';
        window.location.href = '#productos';  // Cambia esto a la URL de tu página de inicio
    });

    const searchButton = document.querySelector(".search-button");
    const searchInput = document.querySelector("#input");

    const performSearch = () => {
        const query = searchInput.value.toLowerCase();
        const links = document.querySelectorAll("nav ul a");
        let found = false;

        links.forEach(link => {
            if (link.textContent.toLowerCase().includes(query)) {
                window.location.href = link.getAttribute("href");
                found = true;
            }
        });

        if (!found) {
            alert("No se encontraron resultados para su búsqueda.");
        }
    };

    searchButton.addEventListener("click", performSearch);

    searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            performSearch();
        }
    });
});
