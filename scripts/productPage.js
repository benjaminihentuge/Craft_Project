document.addEventListener('DOMContentLoaded', function() {
    const gallery = document.querySelector('.product-gallery');
    const productTitle = document.querySelector('.product-title');
    const productPrice = document.querySelector('.product-price');
    const productDescription = document.querySelector('.product-description');
    const cartModal = document.getElementById('cartModal');
    const cartIcon = document.querySelector('.cart-icon');
    const closeModal = document.querySelector('.close');
    const cartCountSpan = document.querySelector('.cart-count');
    const addToCartBtn = document.querySelector('.add-to-cart-btn');
    const submitReviewBtn = document.querySelector('.submit-review-btn');
    const reviewList = document.querySelector('.review-list');
    const hamButton = document.querySelector('#menu');
    const navigation = document.querySelector('.navigation');
    const viewCartBtn = document.querySelector('.view-cart-btn'); 
    const dropCartBtn = document.querySelector('.drop-cart-btn'); 
    const cartContent = document.querySelector('.cart-content'); 
    const closeModalButtons = document.querySelectorAll('.modal .close'); 
    const checkoutBtn = document.querySelector('.checkout-btn'); // New: Checkout button
    const jsonUrl = 'https://benjaminihentuge.github.io/storage/here.json';

    let currentProductIndex = 0;
    let products = [];
    let cart = []; 
    let cartCount = 0;

    // Fetch JSON data
    fetch(jsonUrl)
        .then(response => response.json())
        .then(data => {
            products = data;
            loadProduct(currentProductIndex);
        })
        .catch(error => console.error('Error fetching product data:', error));

    // Load the product data into the HTML
    function loadProduct(index) {
        const product = products[index];
        productTitle.textContent = product.name;
        productPrice.textContent = `$${product.price}`;
        productDescription.textContent = product.description;

        // Load product images into the gallery
        gallery.innerHTML = ''; 
        product.images.forEach(image => {
            const img = document.createElement('img');
            img.src = image;
            img.alt = product.name;
            img.classList.add('product-image');
            gallery.appendChild(img);
        });

        // Load reviews for the current product
        loadReviews(product);
    }

    // Load reviews for the current product with 3 line breaks between each review
    function loadReviews(product) {
        reviewList.innerHTML = ''; 
        if (product.reviews && product.reviews.length > 0) {
            product.reviews.forEach(review => {
                const reviewDiv = document.createElement('div');
                reviewDiv.classList.add('review');
                reviewDiv.textContent = review;
                reviewList.appendChild(reviewDiv);
                
                // Add three line breaks after each review
                for (let i = 0; i < 3; i++) {
                    reviewList.appendChild(document.createElement('br'));
                }
            });
        } else {
            const noReviewDiv = document.createElement('div');
            noReviewDiv.classList.add('no-review');
            noReviewDiv.textContent = 'No reviews yet for this product.';
            reviewList.appendChild(noReviewDiv);
        }
    }

    // "Next" button functionality
    document.querySelector('.next-product-btn').addEventListener('click', () => {
        currentProductIndex = (currentProductIndex + 1) % products.length; 
        loadProduct(currentProductIndex);
    });

    // "Previous" button functionality
    document.querySelector('.previous-product-btn').addEventListener('click', () => {
        currentProductIndex = (currentProductIndex - 1 + products.length) % products.length; 
        loadProduct(currentProductIndex);
    });

    // Add to cart functionality
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', () => {
            const product = products[currentProductIndex];
            cart.push(product); 
            cartCount += 1;
            cartCountSpan.textContent = cartCount;
            alert('Item added to cart!');
        });
    }

    if (cartIcon) {
        cartIcon.addEventListener('click', () => {
            cartModal.style.display = 'block';
        });
    }

    closeModalButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal'); 
            modal.style.display = 'none'; 
        });
    });

    window.addEventListener('click', function(event) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (event.target === modal) {
                modal.style.display = 'none'; 
            }
        });
    });

    // Review submission functionality
    if (submitReviewBtn) {
        submitReviewBtn.addEventListener('click', () => {
            const textarea = document.querySelector('.review-chatbox textarea');
            const reviewText = textarea.value.trim();
            if (reviewText) {
                const review = document.createElement('div');
                review.classList.add('review');
                review.textContent = reviewText;
                reviewList.appendChild(review);
                textarea.value = ''; 
                
                // Add three line breaks after the submitted review
                for (let i = 0; i < 3; i++) {
                    reviewList.appendChild(document.createElement('br'));
                }
            }
        });
    }

    // Navigation toggle for mobile
    if (hamButton && navigation) {
        hamButton.addEventListener('click', () => {
            navigation.classList.toggle('open');
            hamButton.classList.toggle('open');
        });
    }

    // Function to update the cart content display
    function updateCartContent() {
        cartContent.innerHTML = ''; 

        if (cart.length === 0) {
            cartContent.textContent = 'Your cart is empty.';
        } else {
            cart.forEach((item, index) => {
                const cartItem = document.createElement('div');
                cartItem.classList.add('cart-item');
                
                // Displaying the image, name, and price of the item
                cartItem.innerHTML = `
                    <img src="${item.images[0]}" alt="${item.name}" class="cart-item-image" />
                    <p>${item.name} - $${item.price}</p>
                    <button class="remove-item-btn" data-index="${index}">Remove</button>
                `;
                
                cartContent.appendChild(cartItem);
            });

            // Add event listeners to remove buttons
            document.querySelectorAll('.remove-item-btn').forEach(button => {
                button.addEventListener('click', (event) => {
                    const index = event.target.dataset.index;
                    removeFromCart(index);
                });
            });

            // Display the total amount
            const totalDiv = document.createElement('div');
            totalDiv.classList.add('cart-total');
            totalDiv.textContent = `Total: $${calculateTotal()}`;
            cartContent.appendChild(totalDiv);
        }
    }

    // Function to remove an item from the cart
    function removeFromCart(index) {
        cart.splice(index, 1); 
        cartCount -= 1;
        cartCountSpan.textContent = cartCount;
        updateCartContent(); 
    }

    // Function to calculate the total price of items in the cart
    function calculateTotal() {
        let total = 0;
        cart.forEach(item => {
            const price = parseFloat(item.price); // Convert price to a number
            if (!isNaN(price)) { // Check if the price is a valid number
                total += price;
            }
        });
        return total.toFixed(2); // Return the total rounded to 2 decimal places
    }

    // View Cart functionality
    if (viewCartBtn) {
        viewCartBtn.addEventListener('click', () => {
            updateCartContent(); 
            cartModal.style.display = 'none'; 
            document.querySelector('.cart-content-modal').style.display = 'block'; 
        });
    }

    // Drop Cart functionality
    if (dropCartBtn) {
        dropCartBtn.addEventListener('click', () => {
            cart = []; 
            cartCount = 0;
            cartCountSpan.textContent = cartCount;
            updateCartContent(); 
            alert('Cart has been dropped!');
            cartModal.style.display = 'none'; 
        });
    }

    // Checkout functionality
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            const totalAmount = calculateTotal(); // Calculate the total amount
            alert(`Total Amount: $${totalAmount}\nProceeding to checkout...`);        });
    }
});
