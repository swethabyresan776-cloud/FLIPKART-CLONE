require("dotenv").config();
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URI).then(() => console.log("MongoDB connected successfully")).catch(err => console.log("MongoDB connection error:",err));
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const products = [
  { id: 1, name: 'Noise Buds X', category: 'electronics', price: 1799, image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=400&q=80' },
  { id: 2, name: 'Smart Watch Pro', category: 'electronics', price: 2499, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80' },
  { id: 3, name: 'Core i5 Laptop', category: 'electronics', price: 47990, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80' },
  { id: 4, name: 'Bluetooth Speaker', category: 'electronics', price: 3299, image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=400&q=80' },
  { id: 5, name: 'Air Cooler', category: 'home', price: 5499, image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=400&q=80' },
  { id: 6, name: 'Premium Headphones', category: 'electronics', price: 2999, image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=500&q=80' },
  { id: 7, name: 'Monitors', category: 'electronics', price: 8999, image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=500&q=80' },
  { id: 8, name: 'Gaming Mouse', category: 'electronics', price: 1299, image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=400&q=80' },
  { id: 9, name: 'Office Chair', category: 'home', price: 6999, image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=400&q=80' },
  { id: 10, name: '4K Smart TV', category: 'electronics', price: 35999, image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=400&q=80' },
  { id: 11, name: 'Running Shoes', category: 'fashion', price: 2499, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80' },
  { id: 12, name: 'Water Bottle', category: 'home', price: 799, image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=400&q=80' },
  { id: 13, name: 'Portable SSD', category: 'electronics', price: 4999, image: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=400&q=80' },
  { id: 14, name: 'Home Speaker', category: 'electronics', price: 1899, image: 'https://images.unsplash.com/photo-1518444065439-e933c06ce9cd?auto=format&fit=crop&w=400&q=80' }
  ,{ id: 15, name: 'Commuter Scooter', category: 'two-wheelers', price: 54999, image: 'https://images.unsplash.com/photo-1516000851953-0d4e0b3a7b5a?auto=format&fit=crop&w=400&q=80' }
  ,{ id: 16, name: 'Rider Helmet', category: 'two-wheelers', price: 2499, image: 'https://images.unsplash.com/photo-1515548211163-9b6f1b8a4f4c?auto=format&fit=crop&w=400&q=80' }
];

app.use(express.static(__dirname));

app.get('/api/suggestions', (req, res) => {
  const q = (req.query.q || '').toString().trim().toLowerCase();

  if (!q) {
    return res.json({ success: true, suggestions: [] });
  }

  const suggestions = products
    .filter((product) => product.name.toLowerCase().includes(q))
    .slice(0, 5)
    .map((product) => ({ id: product.id, name: product.name }));

  return res.json({ success: true, suggestions });
});

app.get('/api/search', (req, res) => {
  const q = (req.query.q || '').toString().trim().toLowerCase();

  if (!q) {
    return res.json({ success: false, message: 'Please enter a product name' });
  }

  const found = products.find((product) => product.name.toLowerCase().includes(q));

  if (!found) {
    return res.json({ success: false, message: `No product found for "${req.query.q}"` });
  }

  return res.json({ success: true, product: found });
});

app.get('/product.html', (req, res) => {
  const id = Number(req.query.id);
  const product = products.find((item) => item.id === id);

  if (!product) {
    return res.sendFile(path.join(__dirname, 'index.html'));
  }

  const productPage = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${product.name} | CartZone</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap" rel="stylesheet" />
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: 'Roboto', sans-serif; background: #f1f3f6; color: #212121; }
          .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
          .topbar { background: #2874f0; color: white; padding: 16px 0; }
          .nav { display: flex; align-items: center; justify-content: space-between; gap: 20px; }
          .logo { font-size: 2rem; font-weight: 700; letter-spacing: -0.06em; }
          .sub { font-size: 0.72rem; color: #ffe500; }
          .product-wrap { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; margin-top: 30px; background: #fff; padding: 24px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
          .product-image { width: 100%; height: 420px; object-fit: contain; background: #f7f7f7; border-radius: 12px; }
          .product-details h1 { font-size: 2rem; margin-bottom: 12px; }
          .rating { color: #388e3c; font-weight: 700; margin-bottom: 16px; }
          .price { font-size: 2.3rem; font-weight: 700; margin-bottom: 10px; }
          .old { color: #777; text-decoration: line-through; margin-left: 12px; font-size: 1rem; }
          .desc { color: #666; line-height: 1.7; margin-top: 18px; }
          .cta-row { display: flex; gap: 12px; margin-top: 20px; flex-wrap: wrap; }
          .buy-btn, .cart-btn, .wishlist-action-btn { border: none; padding: 14px 28px; font-size: 1rem; font-weight: 700; border-radius: 4px; cursor: pointer; }
          .buy-btn { background: #fb641b; color: white; }
          .cart-btn { background: #2874f0; color: white; }
          .wishlist-action-btn { background: #fff; color: #e53935; border: 1px solid #f1d2d2; }
          a.back-link { display: inline-block; margin-top: 20px; color: #2874f0; font-weight: 700; text-decoration: none; }
          .cart-link-inline { display: inline-block; margin-top: 20px; color: #2874f0; font-weight: 700; text-decoration: none; }
        </style>
      </head>
      <body data-product-id="${product.id}" data-product-name="${product.name}" data-product-price="${product.price}">
        <header class="topbar">
          <div class="container nav">
            <div>
              <div class="logo">CartZone</div>
              <div class="sub">Explore Plus</div>
            </div>
            <div style="display:flex; align-items:center; gap:18px;">
              <a href="/cart.html" style="color: white; font-weight: 700; text-decoration: none;">Cart <span id="cartCount">0</span></a>
              <a href="/" style="color: white; font-weight: 700; text-decoration: none;">Back to Home</a>
            </div>
          </div>
        </header>
        <div class="container">
          <div class="product-wrap">
            <div>
              <img class="product-image" src="${product.image}" alt="${product.name}" />
            </div>
            <div class="product-details">
              <h1>${product.name}</h1>
              <p class="rating">4.5 ★★★★★</p>
              <p class="price">₹${product.price.toLocaleString('en-IN')} <span class="old">₹${(product.price + 1200).toLocaleString('en-IN')}</span></p>
              <p class="desc">This product is part of the CartZone-inspired storefront demo. It matches the search query and opens a dedicated product page for the selected item.</p>
              <div class="cta-row">
                <button class="buy-btn">Buy Now</button>
                <button id="addToCartBtn" class="cart-btn">Add to Cart</button>
                <button id="wishlistActionBtn" class="wishlist-action-btn">♡ Wishlist</button>
              </div>
              <div><a class="back-link" href="/">← Continue Shopping</a></div>
              <div><a class="cart-link-inline" href="/cart.html">View Cart →</a></div>
            </div>
          </div>
        </div>
        <script>
          const CART_KEY = 'flipkart-cart';
          const WISHLIST_KEY = 'flipkart-wishlist';
          const cartCount = document.getElementById('cartCount');
          const addToCartBtn = document.getElementById('addToCartBtn');
          const wishlistActionBtn = document.getElementById('wishlistActionBtn');
          const productBody = document.body;

          const getCart = () => {
            try {
              return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
            } catch (error) {
              return [];
            }
          };

          const saveCart = (cart) => {
            localStorage.setItem(CART_KEY, JSON.stringify(cart));
          };

          const getWishlist = () => {
            try {
              return JSON.parse(localStorage.getItem(WISHLIST_KEY) || '[]');
            } catch (error) {
              return [];
            }
          };

          const saveWishlist = (wishlist) => {
            localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
          };

          const updateCartBadge = () => {
            const cart = getCart();
            const total = cart.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
            if (cartCount) cartCount.textContent = total;
          };

          const updateWishlistButton = () => {
            const wishlist = getWishlist();
            const isSaved = wishlist.some((item) => item.id === Number(productBody.dataset.productId));
            if (wishlistActionBtn) {
              wishlistActionBtn.textContent = isSaved ? '♥ Saved' : '♡ Wishlist';
              wishlistActionBtn.style.background = isSaved ? '#ffe7e7' : '#fff';
            }
          };

          addToCartBtn?.addEventListener('click', () => {
            const cart = getCart();
            const productId = Number(productBody.dataset.productId);
            const productName = productBody.dataset.productName;
            const productPrice = Number(productBody.dataset.productPrice);

            const existing = cart.find((item) => item.id === productId);

            if (existing) {
              existing.quantity += 1;
            } else {
              cart.push({ id: productId, name: productName, price: productPrice, quantity: 1 });
            }

            saveCart(cart);
            updateCartBadge();
            addToCartBtn.textContent = 'Added';
            setTimeout(() => {
              addToCartBtn.textContent = 'Add to Cart';
            }, 1200);
          });

          wishlistActionBtn?.addEventListener('click', () => {
            const wishlist = getWishlist();
            const productId = Number(productBody.dataset.productId);
            const existingIndex = wishlist.findIndex((item) => item.id === productId);

            if (existingIndex >= 0) {
              wishlist.splice(existingIndex, 1);
            } else {
              wishlist.push({
                id: productId,
                name: productBody.dataset.productName,
                price: Number(productBody.dataset.productPrice),
                image: ''
              });
            }

            saveWishlist(wishlist);
            updateWishlistButton();
          });

          updateCartBadge();
          updateWishlistButton();
        </script>
      </body>
    </html>
  `;

  res.send(productPage);
});

app.get('/checkout.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'checkout.html'));
});

app.get('/order-confirmation.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'order-confirmation.html'));
});

app.get('/wishlist.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'wishlist.html'));
});

app.get('/cart.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'cart.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`CartZone demo server running at http://localhost:${PORT}`);
});
