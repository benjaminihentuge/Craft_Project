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
    const viewCartBtn = document.querySelector('.view-cart-btn'); // New: View Cart button
    const dropCartBtn = document.querySelector('.drop-cart-btn'); // New: Drop Cart button
    const cartContent = document.querySelector('.cart-content'); // Cart content container
    const closeModalButtons = document.querySelectorAll('.modal .close'); // Select all close buttons in modals
    const jsonUrl = 'https://benjaminihentuge.github.io/storage/here.json';

    let currentProductIndex = 0;
    let products = [];
    let cart = []; // Array to store cart items
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
        gallery.innerHTML = ''; // Clear previous images
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
        reviewList.innerHTML = ''; // Clear previous reviews
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
        currentProductIndex = (currentProductIndex + 1) % products.length; // Cycle through products
        loadProduct(currentProductIndex);
    });

    // "Previous" button functionality
    document.querySelector('.previous-product-btn').addEventListener('click', () => {
        currentProductIndex = (currentProductIndex - 1 + products.length) % products.length; // Handle negative index and cycle through products
        loadProduct(currentProductIndex);
    });

    // Add to cart functionality
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', () => {
            const product = products[currentProductIndex];
            cart.push(product); // Add current product to cart array
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
            const modal = this.closest('.modal'); // Find the closest modal to the button
            modal.style.display = 'none'; // Hide the modal
        });
    });

    window.addEventListener('click', function(event) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (event.target === modal) {
                modal.style.display = 'none'; // Hide the modal if clicking outside of it
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
                textarea.value = ''; // Clear the textarea
                
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
        cartContent.innerHTML = ''; // Clear previous content

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
        }
    }

    // Function to remove an item from the cart
    function removeFromCart(index) {
        cart.splice(index, 1); // Remove item from cart array
        cartCount -= 1;
        cartCountSpan.textContent = cartCount;
        updateCartContent(); // Update cart content display
    }

    // View Cart functionality
    if (viewCartBtn) {
        viewCartBtn.addEventListener('click', () => {
            updateCartContent(); // Update the cart content display
            cartModal.style.display = 'none'; // Close the cart options modal
            document.querySelector('.cart-content-modal').style.display = 'block'; // Show the cart content modal
        });
    }

    // Drop Cart functionality
    if (dropCartBtn) {
        dropCartBtn.addEventListener('click', () => {
            cart = []; // Clear the cart
            cartCount = 0;
            cartCountSpan.textContent = cartCount;
            updateCartContent(); // Update the cart content display
            alert('Cart has been dropped!');
            cartModal.style.display = 'none'; // Close the cart options modal
        });
    }
});
