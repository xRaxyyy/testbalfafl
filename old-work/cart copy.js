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

// Function to initialize cart from session storage
function initializeCart() {
    /*alert('initializeCart function called'); // Verify the function is called*/

    const userId = localStorage.getItem('userId'); // Check if the user is logged in
    let storedCart;

    if (userId) {
        /*alert('User logged in, checking accountCart in localStorage'); // Debugging the flow*/
        storedCart = localStorage.getItem('accountCart1');
    } else {
        /*alert('No user logged in, checking guestCart in localStorage'); // Debugging the flow*/
        storedCart = localStorage.getItem('guestCart12');
    }

    /*alert('Stored Cart (raw): ' + storedCart); // Show raw value before parsing*/

    // Parse the cart if it exists, otherwise return an empty array
    try {
        storedCart = storedCart ? JSON.parse(storedCart) : [];
        /*alert('Stored Cart after parsing: ' + JSON.stringify(storedCart)); // Log parsed cart*/
    } catch (error) {
        /*alert('Error parsing stored cart data: ' + error);*/
        storedCart = [];
    }

    // Ensure that storedCart is an array
    if (!Array.isArray(storedCart)) {
        /*alert('Stored cart is not an array, resetting it.');*/
        storedCart = [];
    }

    return storedCart;
}

// Initialize cart
let cart = initializeCart();
/*alert('Final cart after initialization: ' + JSON.stringify(cart)); // Log final cart array*/

// Function to save the cart to Firebase
function saveCartToFirebase(userId) {
    const userCartRef = firebase.database().ref('users/' + userId + '/cart/'); // Reference to the user's cart
    
    // Transform the cart array into an object using the product name as the key
    const cartObject = {};
    cart.forEach(item => {
        cartObject[item.name] = {
            brand: item.brand,
            image: item.image,
            price: item.price,
            quantity: item.quantity
        };
    });

    userCartRef.set({ items: cartObject }) // Save the current cart to Firebase
        .then(() => {
            /*alert('Cart saved successfully to Firebase.');*/
        })
        .catch(error => {
            /*alert('Error saving cart to Firebase: ' + error);*/
        });
}

// Function to add item to cart
function addToCart(event, productName) {
    event.preventDefault();

    // Fetch products from the JSON file
    fetch('products.json')
        .then(response => response.json())
        .then(products => {
            // Assuming you pass the product name as a data attribute on the button
            /*const productName = localStorage.getItem('visible-product');*/

            alert(productName)

            // Find the product in the JSON data
            const product = products.find(p => p.name === productName);

            if (!product) {
                alert('Product not found' + productName); // Alert if product not found
                return;
            }

            // Check if quantity input exists
            const quantityInput = document.getElementById('cart-input');
            let quantityValue = 1; // Default to 1 if no input found
            
            if (quantityInput) {
                quantityValue = parseInt(quantityInput.value) || 1; // Get quantity from input if it exists, default to 1 if invalid
            }

            // Define the item object based on the product data
            const item = {
                name: product.name, // Product name
                price: parseFloat(product.price.replace('€', '').replace(',', '.')), // Product price
                image: product.image, // Product image
                shop: product.shop, // Shop name
                brand: product.brand, // Brand name
                quantity: quantityValue // Set the quantity from the input or default
            };

            const existingItem = cart.find(cartItem => cartItem.name === item.name);

            if (existingItem) {
                existingItem.quantity += quantityValue; // Increase quantity if item exists
            } else {
                cart.push(item); // Add new item to the cart
            }

            // Check for user ID in localStorage
            const userId = localStorage.getItem('userId');

            // Save updated cart to session storage
            if (userId) {
                localStorage.setItem('accountCart1', JSON.stringify(cart)); // Save to session storage for logged-in users
                saveCartToFirebase(userId); // Optionally save to Firebase
            } else {
                localStorage.setItem('guestCart12', JSON.stringify(cart)); // Save to session storage for guests
            }

            updateCartCounter(); // Update cart counter after adding an item
            localStorage.removeItem('visible-product')
        })
        .catch(error => {
            console.error('Error fetching products:', error);
            alert('Failed to fetch products.');
        });
}


// Function to update the cart counter
function updateCartCounter() {
    const cartCounter = document.getElementById('cart-counter'); // Assuming there's an element with this ID
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0); // Calculate total quantity of items
    cartCounter.textContent = totalItems; // Update the cart counter display
    /*alert('Cart counter updated: ' + totalItems); // Debug: log updated count*/
}

// Function to remove item from cart
function removeFromCart(itemName) {
    const userId = localStorage.getItem('userId'); // Get user ID from local storage

    // Log item to be removed for debugging
    console.log('Removing item: ' + itemName); 
    // Remove the item from the cart
    cart = cart.filter(item => item.name !== itemName);

    // Update local storage with the new cart
    const cartKey = userId ? 'accountCart1' : 'guestCart12';
    localStorage.setItem(cartKey, JSON.stringify(cart));

    displayCartItems(); // Re-display cart items after removal
    updateCartCounter(); // Update cart counter after removal

    if (userId) {
        saveCartToFirebase(userId); // Save the current cart to Firebase if user is logged in
    }
}


// Function to calculate costs by brand (Lidl, Aldi)
function calculateBrandCosts() {
    const lidlCost = cart
        .filter(item => item.shop && item.shop.toLowerCase() === 'lidl') // Check brand validity
        .reduce((total, item) => total + (item.price * (item.quantity || 1)), 0); // Handle quantity

    const aldiCost = cart
        .filter(item => item.shop && item.shop.toLowerCase() === 'aldi') // Check brand validity
        .reduce((total, item) => total + (item.price * (item.quantity || 1)), 0); // Handle quantity

    return { lidlCost, aldiCost };
}

// Function to calculate the subtotal and total cost
function calculateTotalCost() {
    const { lidlCost, aldiCost } = calculateBrandCosts();
    const subtotal = (lidlCost + aldiCost).toFixed(2); // Calculate subtotal
    const total = subtotal; // Assuming no additional fees for now
    return { subtotal, lidlCost, aldiCost, total };
}

// Function to display cart items (only on cart.html)
function displayCartItems() {
    // Check if cart is an array
    if (!Array.isArray(cart)) {
        cart = []; // Initialize as an empty array if it's not an array
    }

    const lidlContainer = document.getElementById('lidl-container');
    const aldiContainer = document.getElementById('aldi-container');
    const lidlItemsContainer = document.getElementById('lidl-products'); // Get the product container for Lidl
    const aldiItemsContainer = document.getElementById('aldi-products'); // Get the product container for Aldi
    const orderDetails = document.getElementById('order-details');
    const noProductsText = document.getElementById('no-products');

    lidlItemsContainer.innerHTML = ''; // Clear only the product items for Lidl
    aldiItemsContainer.innerHTML = ''; // Clear only the product items for Aldi

    // Flags to check if containers should be displayed
    let hasLidlProducts = false;
    let hasAldiProducts = false;

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
        </div>`;

        // Append product to appropriate container
        if (item.shop && item.shop.toLowerCase() === 'lidl') {
            lidlItemsContainer.appendChild(productDiv);
            hasLidlProducts = true; // Set flag if Lidl products are present
        } else if (item.shop && item.shop.toLowerCase() === 'aldi') {
            aldiItemsContainer.appendChild(productDiv);
            hasAldiProducts = true; // Set flag if Aldi products are present
        }
    });

    // Check if any products are present for Lidl or Aldi
    lidlContainer.style.display = hasLidlProducts ? 'block' : 'none';
    aldiContainer.style.display = hasAldiProducts ? 'block' : 'none';
    orderDetails.style.display = (hasLidlProducts || hasAldiProducts) ? 'block' : 'none';
    noProductsText.style.display = !(hasLidlProducts || hasAldiProducts) ? 'block' : 'none';

    // Update costs in the display
    const { subtotal, lidlCost, aldiCost, total } = calculateTotalCost();
    document.querySelector('.subtotal h2').textContent = `€${subtotal}`; // Update subtotal display
    document.querySelector('.lidl-price h2').textContent = `€${lidlCost.toFixed(2)}`; // Update Lidl price display
    document.querySelector('.aldi-price h2').textContent = `€${aldiCost.toFixed(2)}`; // Update Aldi price display
    document.querySelector('.total h2').textContent = `€${total}`; // Update total display
}




// Event listener for input change to update quantities in the cart
function updateQuantities() {
    const lidlInputs = document.querySelectorAll('#lidl-products input[type="number"]');
    const aldiInputs = document.querySelectorAll('#aldi-products input[type="number"]');

    lidlInputs.forEach(input => {
        const itemName = input.getAttribute('data-name');
        const quantity = parseInt(input.value, 10);
        const cartItem = cart.find(item => item.name === itemName);
        if (cartItem) {
            cartItem.quantity = quantity; // Update quantity in the cart
        }
    });

    aldiInputs.forEach(input => {
        const itemName = input.getAttribute('data-name');
        const quantity = parseInt(input.value, 10);
        const cartItem = cart.find(item => item.name === itemName);
        if (cartItem) {
            cartItem.quantity = quantity; // Update quantity in the cart
        }
    });

    const userId = localStorage.getItem('userId'); 
    
    if (userId) {
        localStorage.setItem('accountCart1', JSON.stringify(cart)); // Save to session storage for logged-in users
        saveCartToFirebase(userId);
    } else {
        localStorage.setItem('guestCart12', JSON.stringify(cart)); // Save to session storage for guests
    }
    
    displayCartItems();
    updateCartCounter();
}



// Add event listeners for input changes to update quantities
document.addEventListener('change', event => {
    if (event.target.matches('input[type="number"]')) {
        updateQuantities(); // Call updateQuantities if an input changes
    }
});



// Call displayCartItems and updateCartCounter to show current cart items on page load
document.addEventListener('DOMContentLoaded', () => {
    const isCartPage = window.location.pathname.includes('cart.html'); // Adjust the pathname based on your cart page

    // Display cart items and update cart counter based on the page
    if (isCartPage) {
        updateCartCounter(); // Update the cart counter after displaying items
        displayCartItems(); // For the shopping cart page
    }

    updateCartCounter(); // Ensure cart counter is correct on all pages
});

// Add event listener to remove item when clicking the trash icon
document.addEventListener('click', event => {
    if (event.target.classList.contains('remove-item')) {
        const itemName = event.target.getAttribute('data-name'); // Get the name of the item to remove
        removeFromCart(itemName); // Remove the item
    }
});