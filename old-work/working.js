// Load Flaticon icon stylesheets
function loadIconStyles() {
    const head = document.head;

    const regularIcons = document.createElement('link');
    regularIcons.rel = 'stylesheet';
    regularIcons.href = 'https://cdn-uicons.flaticon.com/uicons-regular-rounded/css/uicons-regular-rounded.css';
    
    const solidIcons = document.createElement('link');
    solidIcons.rel = 'stylesheet';
    solidIcons.href = 'https://cdn-uicons.flaticon.com/uicons-solid-rounded/css/uicons-solid-rounded.css';
    
    const boldIcons = document.createElement('link');
    boldIcons.rel = 'stylesheet';
    boldIcons.href = 'https://cdn-uicons.flaticon.com/uicons-bold-rounded/css/uicons-bold-rounded.css';

    head.appendChild(regularIcons);
    head.appendChild(solidIcons);
    head.appendChild(boldIcons);
}

// Call the function to load the icon stylesheets
loadIconStyles();

// Function to initialize cart from local storage
function initializeCart() {
    let storedCart = JSON.parse(localStorage.getItem('shoppingCart'));
    return storedCart ? storedCart : [];
}

// Initialize cart
let cart = initializeCart();

// Function to update the cart counter
function updateCartCounter() {
    const cartCounter = document.querySelector('.cart-btn h1');
    const totalItems = cart.reduce((total, item) => total + (item.quantity || 0), 0); // Sum up quantities
    cartCounter.textContent = totalItems; // Set the counter to the total number of items in the cart
}

// Function to calculate the total cost
function calculateTotalCost() {
    return cart.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0).toFixed(2); // Calculate total cost
}

// Function to display cart items
function displayCartItems() {
    const lidlContainer = document.getElementById('lidl-products');
    const aldiContainer = document.getElementById('aldi-products');

    // Clear existing items
    lidlContainer.innerHTML = '';
    aldiContainer.innerHTML = '';

    cart.forEach(item => {
        const productDiv = document.createElement('div');
        productDiv.className = 'container';

        productDiv.innerHTML = `
        <div class="product">
            <div class="img-box">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="details-box">
                <div class="product-info">
                    <h1>${item.name}</h1>
                    <h2>€${item.price.toFixed(2)}</h2>
                </div>
                <div class="product-controls">
                    <input type="number" value="${item.quantity || 1}" min="1" data-name="${item.name}">
                    <i class="remove-item fi-rr-trash-xmark" data-name="${item.name}"></i>
                </div>
            </div>
        </div>
        `;

        // Append productDiv to the correct brand container
        if (item.brand.toLowerCase() === 'lidl') {
            lidlContainer.appendChild(productDiv);
        } else if (item.brand.toLowerCase() === 'aldi') {
            aldiContainer.appendChild(productDiv);
        }
    });

    // Add event listener to each remove icon (re-attached every time displayCartItems is called)
    const removeButtons = document.querySelectorAll('.remove-item');
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const itemName = this.getAttribute('data-name'); // Get the name of the item to remove
            removeFromCart(itemName);
        });
    });

    // Display total cost
    const totalCostElement = document.getElementById('total-cost');
    totalCostElement.textContent = `Total: €${calculateTotalCost()}`; // Set the total cost

    updateCartCounter(); // Update the cart counter
}

// Function to remove item from cart
function removeFromCart(name) {
    cart = cart.filter(item => item.name !== name); // Remove the item from the cart array
    localStorage.setItem('shoppingCart', JSON.stringify(cart)); // Save updated cart to local storage
    updateCartCounter(); // Update cart counter after item removal
    displayCartItems(); // Refresh displayed cart items

}

// Function to initialize the cart counter on page load
function initializeCartCounter() {
    const storedCart = JSON.parse(localStorage.getItem('shoppingCart'));
    const cartCounter = document.querySelector('.cart-btn h1');
    const totalItems = storedCart ? storedCart.reduce((total, item) => total + (item.quantity || 0), 0) : 0;

    if (cartCounter) {
        cartCounter.textContent = totalItems; // Set the counter based on stored cart
    } else {
        console.error("Cart counter element not found!");
    }
}


// Function to add item to cart (only for the product pages)
function addToCart(event) {
    event.preventDefault(); // Prevent any default anchor behavior

    // Find the closest '.pro' parent to fetch the product details
    const productElement = event.target.closest('.pro');

    const item = {
        name: productElement.querySelector('h5').textContent,
        price: parseFloat(productElement.querySelector('h4').textContent.replace('€', '').replace(',', '.')),
        brand: productElement.querySelector('span').textContent,
        image: productElement.querySelector('img').src,
        quantity: 1 // Default quantity
    };

    // Check if item is already in the cart
    const existingItem = cart.find(cartItem => cartItem.name === item.name);
    if (existingItem) {
        existingItem.quantity += 1; // Increase quantity if item exists
    } else {
        cart.push(item); // Add new item to the cart
    }

    // Save the updated cart array to localStorage
    localStorage.setItem('shoppingCart', JSON.stringify(cart));

    // Update the cart counter
    updateCartCounter();

    // Provide feedback to the user
    alert(`${item.name} has been added to your cart!`);
}


// Call displayCartItems and updateCartCounter to show current cart items on page load
document.addEventListener('DOMContentLoaded', () => {
    const isCartPage = window.location.pathname.includes('cart.html'); // Adjust the pathname based on your cart page

    // Display cart items and update cart counter based on the page
    if (isCartPage) {
        updateCartCounter(); // Update the cart counter after displaying items
        displayCartItems(); // For the shopping cart page
    }

    // Initialize the cart counter to reflect the correct number of items
    updateCartCounter(); // Always update the cart counter on other pages
    initializeCartCounter(); // Ensure cart counter is correct on all pages
});


// Event listener for adding items to the cart (only for product pages)
if (!window.location.pathname.includes('cart.html')) {
    document.querySelectorAll('.add-to-cart-button').forEach(button => {
        button.addEventListener('click', addToCart);
    });
}

// Event listener for input change to update quantities in the cart
function updateQuantities() {
    const lidlInputs = document.querySelectorAll('#lidl-products input[type="number"]');
    const aldiInputs = document.querySelectorAll('#aldi-products input[type="number"]');

    lidlInputs.forEach(input => {
        const itemName = input.getAttribute('data-name');
        const item = cart.find(cartItem => cartItem.name === itemName);
        if (item) {
            item.quantity = parseInt(input.value, 10); // Update quantity for Lidl products
        }
    });

    aldiInputs.forEach(input => {
        const itemName = input.getAttribute('data-name');
        const item = cart.find(cartItem => cartItem.name === itemName);
        if (item) {
            item.quantity = parseInt(input.value, 10); // Update quantity for Aldi products
        }
    });

    // Update local storage
    localStorage.setItem('shoppingCart', JSON.stringify(cart));
    updateCartCounter(); // Update the cart counter
    displayCartItems(); // Refresh displayed cart items to reflect new quantities
}

// Attach change event listeners to the quantity inputs in both product containers
document.getElementById('lidl-products').addEventListener('input', updateQuantities);
document.getElementById('aldi-products').addEventListener('input', updateQuantities);
