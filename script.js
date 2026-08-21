document.getElementById('year').textContent = new Date().getFullYear();

const CART_KEY = 'flipkart-cart';
const WISHLIST_KEY = 'flipkart-wishlist';

const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const searchResultBanner = document.getElementById('searchResultBanner');
const searchSuggestions = document.getElementById('searchSuggestions');

// remove numeric elements shown in header (cart/wishlist counts and category badges)
document.querySelectorAll('#wishlistCount, #cartCount, .count-badge').forEach((el) => el.remove());

const productCards = document.querySelectorAll('.product-card, .deal-box');
const filterButtons = document.querySelectorAll('.filter-btn');

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

const updateCartCount = () => {
  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  const cartCountElement = document.getElementById('cartCount');

  if (cartCountElement) {
    cartCountElement.textContent = totalItems;
  }
};

const updateWishlistCount = () => {
  const wishlist = getWishlist();
  const wishlistCountElement = document.getElementById('wishlistCount');

  if (wishlistCountElement) {
    wishlistCountElement.textContent = wishlist.length;
  }
};

const applyCategoryFilter = (category) => {
  productCards.forEach((card) => {
    const shouldShow = category === 'all' || card.dataset.category === category;
    card.style.display = shouldShow ? '' : 'none';
  });
};

filterButtons.forEach((button) => {
  const activate = () => {
    const selectedCategory = button.dataset.category;
    filterButtons.forEach((btn) => {
      const isActive = btn === button;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', String(isActive));
    });
    applyCategoryFilter(selectedCategory);
  };

  // support mouse/touch/click
  button.addEventListener('click', activate);
  button.addEventListener('touchstart', (e) => {
    // treat touch as activation without letting the following click duplicate work
    e.preventDefault();
    activate();
  }, { passive: false });

  // keyboard support
  button.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      activate();
    }
  });
});

// Make category strip items interactive (click/keyboard) and map to filters
const categoryItems = document.querySelectorAll('.category-item');
const categoryMap = {
  grocery: 'all',
  mobiles: 'electronics',
  mobiles: 'electronics',
  mobiles: 'electronics',
  mobiles: 'electronics',
  mobiles: 'electronics',
  mobiles: 'electronics',
  mobiles: 'electronics',
};

const mapLabelToCategory = (label) => {
  const key = label.trim().toLowerCase();
  if (key.includes('mobile') || key.includes('phone')) return 'electronics';
  if (key.includes('elect')) return 'electronics';
  if (key.includes('fashion')) return 'fashion';
  if (key.includes('home') || key.includes('appliance') || key.includes('appliances')) return 'home';
  if (key.includes('grocery')) return 'all';
  if (key.includes('travel')) return 'all';
  if (key.includes('beauty')) return 'fashion';
  if (key.includes('two') || key.includes('wheel')) return 'all';
  return 'all';
};

categoryItems.forEach((item) => {
  // ensure keyboard focus and ARIA role (buttons already in DOM)
  item.setAttribute('aria-pressed', item.getAttribute('aria-pressed') || 'false');

  const activateCategoryItem = () => {
    const label = item.querySelector('span')?.textContent || item.textContent || '';
    const cat = mapLabelToCategory(label);

    // mark category items pressed state
    categoryItems.forEach((i) => i.setAttribute('aria-pressed', String(i === item)));

    // update filter buttons UI and aria-pressed
    filterButtons.forEach((btn) => {
      const isActive = btn.dataset.category === cat;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', String(isActive));
    });

    applyCategoryFilter(cat);

    // update the preview list (pagination handled by updatePreviewForCategory)
    updatePreviewForCategory(cat);

    // scroll to products and focus first visible item
    const productPanelEl = document.querySelector('.product-panel');
    if (productPanelEl) {
      productPanelEl.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        const candidates = Array.from(productPanelEl.querySelectorAll('.product-card, .deal-box'));
        const firstVisible = candidates.find((el) => window.getComputedStyle(el).display !== 'none');
        if (firstVisible) firstVisible.focus();
      }, 350);
    }
  };

  item.addEventListener('click', activateCategoryItem);
  item.addEventListener('touchstart', (e) => {
    e.preventDefault();
    activateCategoryItem();
  }, { passive: false });
  item.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      activateCategoryItem();
    }
  });
});

// category count badges removed (hidden by CSS)


// category preview controls (no arrows/pagination)
const previewList = document.getElementById('previewList');
const previewEl = document.getElementById('categoryPreview');
const previewViewAll = document.getElementById('previewViewAll');
let currentPreviewCategory = 'all';

const renderPreview = (matches) => {
  if (!previewList) return;
  previewList.innerHTML = '';
  const pageItems = (matches || []).slice(0, 6);
  pageItems.forEach((m) => {
    const imgSrc = m.querySelector('img')?.src || '';
    const title = m.querySelector('h3')?.textContent || m.querySelector('.deal-info h3')?.textContent || 'Product';
    const price = m.querySelector('.price')?.textContent || '';
    const rating = m.querySelector('.rating')?.textContent || '';
    const id = m.dataset.productId;

    const item = document.createElement('div');
    item.className = 'preview-item';
    item.tabIndex = 0;
    item.innerHTML = `<img src="${imgSrc}" alt="${title}" /><div class="meta"><div class="title">${title}</div><div class="price">${price} ${rating ? ' • ' + rating : ''}</div></div>`;
    item.addEventListener('click', () => { if (id) window.location.href = `/product.html?id=${id}`; });
    item.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (id) window.location.href = `/product.html?id=${id}`; } });
    previewList.appendChild(item);
  });

  if (!pageItems.length) previewEl.classList.add('hidden'); else previewEl.classList.remove('hidden');
};

if (previewViewAll) previewViewAll.addEventListener('click', () => {
  filterButtons.forEach((btn) => {
    const match = btn.dataset.category === currentPreviewCategory;
    btn.classList.toggle('active', match);
    btn.setAttribute('aria-pressed', String(match));
  });
  applyCategoryFilter(currentPreviewCategory);
  if (productPanel) productPanel.scrollIntoView({ behavior: 'smooth' });
});

const updatePreviewForCategory = (cat) => {
  currentPreviewCategory = cat;
  const candidates = Array.from(document.querySelectorAll('.product-card, .deal-box'));
  const matches = candidates.filter((c) => {
    const ccat = c.dataset.category || '';
    return cat === 'all' ? true : ccat === cat;
  });
  renderPreview(matches);
};

// category counts intentionally not shown

// apply ?category=... from URL on load
const urlParams = new URLSearchParams(window.location.search);
const initialCategory = urlParams.get('category');
if (initialCategory) {
  // find the header category item matching the param
  const found = Array.from(categoryItems).find((it) => mapLabelToCategory(it.querySelector('span')?.textContent || it.textContent || '') === initialCategory || (it.querySelector('span')?.textContent || '').toLowerCase().includes(initialCategory.toLowerCase()));
  if (found) found.click();
}

const hideSuggestions = () => {
  if (searchSuggestions) {
    searchSuggestions.classList.add('hidden');
    searchSuggestions.innerHTML = '';
  }
};

const renderSuggestions = (items) => {
  if (!searchSuggestions) return;

  searchSuggestions.innerHTML = '';

  if (!items.length) {
    hideSuggestions();
    return;
  }

  items.forEach((item) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'search-suggestion-item';
    button.textContent = item.name;
    button.setAttribute('role', 'option');
    button.addEventListener('click', () => {
      searchInput.value = item.name;
      hideSuggestions();
      window.location.href = `/product.html?id=${item.id}`;
    });
    searchSuggestions.appendChild(button);
  });

  searchSuggestions.classList.remove('hidden');
};

searchInput?.addEventListener('input', async () => {
  const query = searchInput.value.trim();

  if (!query) {
    hideSuggestions();
    return;
  }

  try {
    const response = await fetch(`/api/suggestions?q=${encodeURIComponent(query)}`);
    const result = await response.json();
    renderSuggestions(result.suggestions || []);
  } catch (error) {
    hideSuggestions();
  }
});

document.addEventListener('click', (event) => {
  const clickedInsideSearch = searchForm?.contains(event.target);
  if (!clickedInsideSearch) {
    hideSuggestions();
  }
});

const toggleWishlistItem = (card, button) => {
  const productId = Number(card.dataset.productId);
  const productName = card.querySelector('h3')?.textContent?.trim() || 'Product';
  const productPriceText = card.querySelector('.price')?.textContent || '₹0';
  const productPrice = Number(productPriceText.replace(/[^\d]/g, '')) || 0;
  const productImage = card.querySelector('img')?.src || '';
  const wishlist = getWishlist();
  const existingIndex = wishlist.findIndex((item) => item.id === productId);

  if (existingIndex >= 0) {
    wishlist.splice(existingIndex, 1);
  } else {
    wishlist.push({ id: productId, name: productName, price: productPrice, image: productImage });
  }

  saveWishlist(wishlist);
  updateWishlistCount();

  const isSaved = wishlist.some((item) => item.id === productId);
  button.classList.toggle('active', isSaved);
  button.textContent = isSaved ? '♥' : '♡';
};

updateCartCount();
updateWishlistCount();

// Add to cart handlers
const addCartButtons = document.querySelectorAll('.add-cart-btn');

const addToCart = (card) => {
  const productId = Number(card.dataset.productId);
  const productName = card.querySelector('h3')?.textContent?.trim() || 'Product';
  const productPriceText = card.querySelector('.price')?.textContent || '₹0';
  const productPrice = Number(productPriceText.replace(/[^\d]/g, '')) || 0;
  const productImage = card.querySelector('img')?.src || '';

  const cart = getCart();
  const existing = cart.find((i) => i.id === productId);
  if (existing) {
    existing.quantity = Number(existing.quantity || 1) + 1;
  } else {
    cart.push({ id: productId, name: productName, price: productPrice, image: productImage, quantity: 1 });
  }

  saveCart(cart);
  updateCartCount();
};

addCartButtons.forEach((btn) => {
  const card = btn.closest('.product-card');
  btn.addEventListener('click', (event) => {
    event.stopPropagation();
    if (card) {
      addToCart(card);
      btn.textContent = 'Added ✓';
      setTimeout(() => (btn.textContent = 'Add to cart'), 1200);
    }
  });
});

// Floating toast for add-to-cart
const makeToast = (message, options = {}) => {
  let toast = document.getElementById('siteToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'siteToast';
    toast.style.position = 'fixed';
    toast.style.right = '16px';
    toast.style.bottom = '16px';
    toast.style.background = 'rgba(23,35,55,0.96)';
    toast.style.color = '#fff';
    toast.style.padding = '12px 16px';
    toast.style.borderRadius = '10px';
    toast.style.boxShadow = '0 6px 20px rgba(0,0,0,0.2)';
    toast.style.zIndex = 9999;
    toast.style.display = 'flex';
    toast.style.alignItems = 'center';
    toast.style.gap = '12px';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<div>${message}</div><a href="/cart.html" style="color:#ffe500;font-weight:700;margin-left:8px;">View cart</a>`;
  toast.style.opacity = '1';
  setTimeout(() => {
    toast.style.transition = 'opacity 300ms ease';
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 350);
  }, options.duration || 1400);
};

// Enhance add-to-cart buttons to show toast
addCartButtons.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    const card = btn.closest('.product-card');
    const name = card?.querySelector('h3')?.textContent || 'Item';
    makeToast(`${name} added to cart`);
  });
});

const wishlistButtons = document.querySelectorAll('.wishlist-btn');
wishlistButtons.forEach((button) => {
  const card = button.closest('.product-card');
  const productId = Number(card?.dataset.productId || 0);
  const isSaved = getWishlist().some((item) => item.id === productId);

  button.classList.toggle('active', isSaved);
  button.textContent = isSaved ? '♥' : '♡';

  button.addEventListener('click', (event) => {
    event.stopPropagation();
    if (card) {
      toggleWishlistItem(card, button);
    }
  });
});

productCards.forEach((card) => {
  card.style.cursor = 'pointer';

  const openProduct = () => {
    const productId = card.dataset.productId;
    if (productId) {
      window.location.href = `/product.html?id=${productId}`;
    }
  };

  card.addEventListener('click', openProduct);
  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openProduct();
    }
  });
});

// Best seller quick access
const bestSellersCard = document.getElementById('bestSellersCard');
if (bestSellersCard) {
  const toggleBestSellers = () => {
    const active = bestSellersCard.getAttribute('aria-pressed') === 'true';
    bestSellersCard.setAttribute('aria-pressed', String(!active));

    // find best sellers: mark products with rating >= 4.5 as best seller
    const cards = document.querySelectorAll('.product-card');
    cards.forEach((c) => {
      const ratingText = c.querySelector('.rating')?.textContent || '';
      const match = ratingText.match(/([0-9]\.[0-9])/);
      const rating = match ? Number(match[1]) : 0;
      if (rating >= 4.5) {
        c.dataset.bestseller = 'true';
        if (!c.querySelector('.badge-bestseller')) {
          const badge = document.createElement('span');
          badge.className = 'badge-bestseller';
          badge.textContent = 'BESTSELLER';
          c.querySelector('.product-copy h3')?.appendChild(badge);
        }
      } else {
        delete c.dataset.bestseller;
        const existing = c.querySelector('.badge-bestseller');
        if (existing) existing.remove();
      }
    });

    // filter view to show bestsellers only when activated
    const showOnly = !active;
    cards.forEach((c) => {
      const isBs = c.dataset.bestseller === 'true';
      c.style.display = showOnly ? (isBs ? '' : 'none') : '';
    });
  };

  bestSellersCard.addEventListener('click', toggleBestSellers);
  bestSellersCard.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleBestSellers();
    }
  });
}

// Panel 'View All' buttons: show all products and scroll to the products section
const panelViewButtons = document.querySelectorAll('.panel-header > button');
const productPanel = document.querySelector('.product-panel');
panelViewButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    // reset filters
    filterButtons.forEach((b) => b.classList.toggle('active', b.dataset.category === 'all'));
    applyCategoryFilter('all');
    // remove bestsellers pressed state if any
    if (bestSellersCard) bestSellersCard.setAttribute('aria-pressed', 'false');
    // scroll into view
    if (productPanel) productPanel.scrollIntoView({ behavior: 'smooth' });
  });
});

searchForm?.addEventListener('submit', async (event) => {
  event.preventDefault();

  const query = searchInput.value.trim();
  if (!query) {
    searchResultBanner.textContent = 'Please enter a product name';
    searchResultBanner.classList.remove('hidden');
    hideSuggestions();
    return;
  }

  try {
    const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    const result = await response.json();

    if (result.success && result.product) {
      window.location.href = `/product.html?id=${result.product.id}`;
      return;
    }

    searchResultBanner.textContent = result.message || 'No matching product found.';
    searchResultBanner.classList.remove('hidden');
    hideSuggestions();
  } catch (error) {
    searchResultBanner.textContent = 'Search failed. Please try again.';
    searchResultBanner.classList.remove('hidden');
    hideSuggestions();
  }
});

// Seller signup handling (on seller.html)
const sellerForm = document.getElementById('sellerForm');
if (sellerForm) {
  const sellerReset = document.getElementById('sellerReset');
  sellerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = {
      name: (document.getElementById('sellerName')?.value || '').trim(),
      business: (document.getElementById('businessName')?.value || '').trim(),
      email: (document.getElementById('sellerEmail')?.value || '').trim(),
      phone: (document.getElementById('sellerPhone')?.value || '').trim(),
      category: (document.getElementById('sellerCategory')?.value || '').trim(),
      submittedAt: new Date().toISOString(),
    };

    if (!data.name || !data.business || !data.email) {
      makeToast('Please complete all required fields');
      return;
    }

    try {
      const key = 'seller-applications';
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      existing.unshift(data);
      localStorage.setItem(key, JSON.stringify(existing));
      makeToast('Application submitted — we will contact you');
      sellerForm.reset();
    } catch (err) {
      makeToast('Unable to save application locally');
    }
  });

  sellerReset?.addEventListener('click', () => sellerForm.reset());
}

// Contact modal handling (on more.html)
const contactModal = document.getElementById('contactModal');
const modalLinks = document.querySelectorAll('[data-modal="contact"]');
if (modalLinks.length && contactModal) {
  const openModal = () => {
    contactModal.classList.remove('hidden');
    contactModal.setAttribute('aria-hidden', 'false');
  };

  const closeModal = () => {
    contactModal.classList.add('hidden');
    contactModal.setAttribute('aria-hidden', 'true');
  };

  modalLinks.forEach((lnk) => lnk.addEventListener('click', (e) => { e.preventDefault(); openModal(); }));

  contactModal.querySelectorAll('[data-close]').forEach((el) => el.addEventListener('click', closeModal));
  document.getElementById('closeModal')?.addEventListener('click', closeModal);
  document.getElementById('cancelContact')?.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && contactModal && contactModal.getAttribute('aria-hidden') === 'false') closeModal();
  });

  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const msg = {
        name: (document.getElementById('contactName')?.value || '').trim(),
        email: (document.getElementById('contactEmail')?.value || '').trim(),
        message: (document.getElementById('contactMessage')?.value || '').trim(),
        at: new Date().toISOString(),
      };
      if (!msg.name || !msg.email || !msg.message) {
        makeToast('Please fill all fields');
        return;
      }

      try {
        const key = 'contact-messages';
        const existing = JSON.parse(localStorage.getItem(key) || '[]');
        existing.unshift(msg);
        localStorage.setItem(key, JSON.stringify(existing));
        makeToast('Message sent — we will respond soon');
        contactForm.reset();
        closeModal();
      } catch (err) {
        makeToast('Unable to save message locally');
      }
    });
  }
}
