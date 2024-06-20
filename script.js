document.addEventListener("DOMContentLoaded", function() {
    // Definición de los productos
    const productos = [
        {
            "id": "1",
            "nombre": "Falcon Heavy",
            "descripcion": "Vehículo de lanzamiento espacial superpesado reutilizable, diseñado y fabricado por SpaceX.",
            "imagen": "images/FalconHeavy1.jpg",
            "precio": "20.00"
        },
        {
            "id": "2",
            "nombre": "Falcon 9",
            "descripcion": "Vehículo de lanzamiento parcialmente reutilizable de dos etapas diseñado y fabricado por SpaceX.",
            "imagen": "images/Falcon9.jpg",
            "precio": "25.00"
        },
        {
            "id": "3",
            "nombre": "Starship",
            "descripcion": "Sistema de lanzamiento y nave espacial totalmente reutilizable desarrollado por SpaceX como proyecto de vuelo espacial privado.",
            "imagen": "images/Starship.jpg",
            "precio": "30.00"
        },
        {
            "id": "4",
            "nombre": "Saturno V",
            "descripcion": "El Saturno V fue un cohete desechable de múltiples fases y de combustible líquido usado en los programas Apolo y Skylab de la NASA.",
            "imagen": "images/SaturnoV1.jpg",
            "precio": "15.00"
        },
        {
            "id": "5",
            "nombre": "SLS",
            "descripcion": "El sistema de lanzamiento espacial, es un vehículo de lanzamiento no recuperable superpesado estadounidense que está siendo desarrollado por la NASA desde 2011.",
            "imagen": "images/SLS1.jpg",
            "precio": "30.00"
        },
        {
            "id": "6",
            "nombre": "Delta IV Heavy",
            "descripcion": "El Delta IV Heavy, fue un vehículo de lanzamiento de carga pesada desechable, el tipo más grande de la familia Delta IV.",
            "imagen": "images/DeltaIVHeavy1.jpg",
            "precio": "30.00"
        }
    ];

    // Modal elements
    const modal = document.createElement('div');
    modal.id = "product-modal";
    modal.classList.add("product-modal");
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <div id="modal-product-info"></div>
        </div>
    `;
    document.body.appendChild(modal);
    
    const modalContent = document.getElementById("modal-product-info");
    const closeModal = modal.querySelector(".close");

    // Function to show the modal
    const showModal = (product) => {
        modalContent.innerHTML = `
            <div class="card1">
                <h3>${product.nombre}</h3>
                <img src="${product.imagen}" alt="${product.nombre}" style="width:100%;height:auto;">
                <p>${product.descripcion}</p>
                <p>Price: $${product.precio}</p>
                <button class="buy-now" data-id="${product.id}">Shop Now</button>
            </div>
        `;
        modal.style.display = "block";

        // Add event listener to the "Shop Now" button inside the modal
        modalContent.querySelector(".buy-now").addEventListener("click", (e) => {
            addToCart(product.id);
            modal.style.display = "none";
        });
    };

    // Close modal functionality
    closeModal.addEventListener("click", () => {
        modal.style.display = "none";
    });

    window.addEventListener("click", (e) => {
        if (e.target == modal) {
            modal.style.display = "none";
        }
    });

    // Function to update the cart in the localStorage
    const updateCart = () => {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        // Update cart UI or other necessary actions
    };

    // Function to add product to the cart
    const addToCart = (id) => {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const productInCart = cart.find(item => item.id === id);

        if (productInCart) {
            productInCart.quantity += 1;
        } else {
            const product = productos.find(p => p.id === id);
            cart.push({ ...product, quantity: 1 });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        updateCart();
    };

    // Add click event listeners to product cards and buttons
    document.querySelectorAll(".card1").forEach(card => {
        card.addEventListener("click", (e) => {
            const productId = card.querySelector(".buy-now").id;
            const product = productos.find(p => p.id === productId);
            if (e.target.classList.contains("buy-now")) {
                addToCart(productId);
            } else {
                showModal(product);
            }
        });
    });

    // Initialize the cart
    updateCart();

    // Funcionalidad para el menú desplegable
    const submenuLinks = document.querySelectorAll('nav ul ul li a');

    submenuLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const sectionId = event.target.getAttribute('href').substring(1);
            const section = document.getElementById(sectionId);
            section.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Funcionalidad para la búsqueda
    const searchButton = document.getElementById('search-button');
    const searchInput = document.getElementById('search-input');

    const executeSearch = () => {
        const query = searchInput.value.toLowerCase();
        document.querySelectorAll('.productos article').forEach(product => {
            const title = product.querySelector('h3').innerText.toLowerCase();
            if (title.includes(query)) {
                product.style.display = 'block';
            } else {
                product.style.display = 'none';
            }
        });
    };

    searchButton.addEventListener('click', executeSearch);

    searchInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            executeSearch();
        }
    });
});
