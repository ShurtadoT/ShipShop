document.addEventListener("DOMContentLoaded", function() {
// script.js

    document.addEventListener("DOMContentLoaded", function() {
        
        // URL del archivo JSON
        const url = 'products.json';
    
        // Obtener el contenedor de productos
        const productsContainer = document.getElementById('products');
    
        // Función para crear una tarjeta de producto
        function createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h2>${product.name}</h2>
            <p class="price">${product.price}</p>
            <button class="shop-now">Shop Now</button>
        `;
    
        // Evento para mostrar el modal con la información del producto
        card.addEventListener('click', function(event) {
            if (!event.target.classList.contains('shop-now')) {
            showModal(product);
            }
        });
    
        return card;
        }
    
        // Fetch para obtener el JSON
        fetch(url)
        .then(response => response.json())
        .then(products => {
            products.forEach(product => {
            const card = createProductCard(product);
            productsContainer.appendChild(card);
            });
        })
        .catch(error => console.error('Error fetching the JSON:', error));
    
        // Función para mostrar el modal
        function showModal(product) {
        const modal = document.getElementById('product-modal');
        document.getElementById('modal-title').textContent = product.name;
        document.getElementById('modal-image').src = product.image;
        document.getElementById('modal-description').textContent = product.description;
        modal.style.display = "block";
        }
    
        // Cerrar el modal
        const modal = document.getElementById('product-modal');
        const span = document.getElementsByClassName('close')[0];
    
        span.onclick = function() {
        modal.style.display = "none";
        }
    
        window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
        }
    });
    

    

    // Funcionalidad de búsqueda
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
