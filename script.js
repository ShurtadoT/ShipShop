document.addEventListener("DOMContentLoaded", function () {

    const modal = document.getElementById("productModal");
    const modalTitle = document.getElementById("modalTitle");
    const modalImage = document.getElementById("modalImage");
    const modalDescription = document.getElementById("modalDescription");
    const modalPrice = document.getElementById("modalPrice");
    const span = document.getElementsByClassName("close")[0];

    // Cargar los productos desde el archivo JSON
    fetch('productos.json')
        .then(response => response.json())
        .then(data => {
            console.log(data); // Verificar que los datos se cargan
            const products = data.productos;
            
            document.querySelectorAll('.buy-now').forEach(function(button) {
                button.addEventListener('click', function() {
                    const productId = this.getAttribute('data-id');
                    console.log("Button clicked, product ID:", productId); // Verificar el ID del producto
                    const product = products.find(p => p.id == productId);
                    
                    if (product) {
                        console.log("Product found:", product); // Verificar que se encontró el producto
                        modalTitle.textContent = product.nombre;
                        modalImage.src = product.imagen;
                        modalDescription.textContent = product.descripcion;
                        modalPrice.textContent = "Precio: $" + product.precio;
                        
                        modal.style.display = "block";
                    } else {
                        console.error("Product not found for ID:", productId);
                    }
                });
            });
        })
        .catch(error => console.error('Error loading products:', error));

    span.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

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
