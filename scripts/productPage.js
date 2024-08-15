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
    const jsonUrl = 'https://benjaminihentuge.github.io/storage/here.json';
    
    let currentProductIndex = 0;
    let products = [];
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
    }

    // "Next" button functionality
    document.querySelector('.next-product-btn').addEventListener('click', () => {
        currentProductIndex = (currentProductIndex + 1) % products.length; // Cycle through products
        loadProduct(currentProductIndex);
    });

    // Add to cart functionality
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', () => {
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

    if (closeModal) {
        closeModal.addEventListener('click', () => {
            cartModal.style.display = 'none';
        });
    }

    window.addEventListener('click', (event) => {
        if (event.target === cartModal) {
            cartModal.style.display = 'none';
        }
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
});
