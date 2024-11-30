const minusBtn = document.getElementById('minus-btn');
const plusBtn = document.getElementById('plus-btn');
const cartInput = document.getElementById('cart-input');

minusBtn.addEventListener('click', () => {
    const currentValue = parseInt(cartInput.value);
    if (currentValue > 1) {
        cartInput.value = currentValue - 1;
    }
});

plusBtn.addEventListener('click', () => {
    const currentValue = parseInt(cartInput.value);
    cartInput.value = currentValue + 1;
});



/* Scroll to top */

function scrollUp() {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// Function to handle the delay before navigating
function handlePageSwitch(event, url) {
    event.preventDefault(); // Prevent the default link behavior
    
    // Delay the page switch (for example, 2 seconds)
    setTimeout(function() {
      window.location.href = url; // Navigate to the link after the delay
    }, 500); // Adjust the delay as needed (2000ms = 2 seconds)
  }
  
