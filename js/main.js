/**
 * Malay Restaurant & Malay Fast Foods (Pvt) Ltd
 * Core Interactive JavaScript
 */

document.addEventListener('DOMContentLoaded', async () => {
  // Global State
  let menuData = [];
  let brandsData = [];
  let currentBrand = 'all';
  let currentCategory = 'all';
  let currentSearch = '';
  let currentPage = 1;
  const itemsPerPage = 20;

  // Shopping Cart state from localStorage
  let cart = JSON.parse(localStorage.getItem('malay_cart') || '[]');

  // DOM Elements
  const header = document.querySelector('.site-header');
  const menuContainer = document.getElementById('menu-items-grid');
  const brandFilters = document.querySelectorAll('.brand-filter-btn');
  const categoryScroll = document.getElementById('category-scroll-container');
  const searchInput = document.getElementById('menu-search-input');
  const paginationBar = document.getElementById('menu-pagination-bar');
  
  // Cart DOM Elements
  const cartToggleBtns = document.querySelectorAll('.cart-toggle-btn');
  const cartDrawer = document.getElementById('cart-drawer');
  const cartOverlay = document.getElementById('cart-drawer-overlay');
  const cartCloseBtn = document.getElementById('cart-close-btn');
  const cartItemsBody = document.getElementById('cart-items-body');
  const cartSubtotalEl = document.getElementById('cart-subtotal-amount');
  const cartBadges = document.querySelectorAll('.cart-badge');
  const whatsappOrderBtn = document.getElementById('whatsapp-order-btn');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileNavDrawer = document.getElementById('mobile-nav-drawer');

  // Detect subpage path
  const isSubPage = window.location.pathname.includes('/brands/') || !!document.body.dataset.brandPage;
  const basePath = isSubPage ? '../' : '';

  // 1. Load Data
  try {
    const [brandsRes, menuRes] = await Promise.all([
      fetch(`${basePath}data/brands.json`).then(r => r.json()),
      fetch(`${basePath}data/menu.json`).then(r => r.json())
    ]);
    brandsData = brandsRes;
    menuData = menuRes;
  } catch (err) {
    console.error('Failed to load menu/brands data', err);
  }

  // Update Cart UI initial
  updateCartUI();

  // Scroll effect on header
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  // Mobile Menu Drawer Toggle
  if (mobileMenuBtn && mobileNavDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileNavDrawer.classList.toggle('open');
      const icon = mobileMenuBtn.querySelector('i') || mobileMenuBtn;
      if (mobileNavDrawer.classList.contains('open')) {
        icon.textContent = '✕';
      } else {
        icon.textContent = '☰';
      }
    });
  }

  // Cart Drawer open/close
  cartToggleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openCartDrawer();
    });
  });

  if (cartCloseBtn) cartCloseBtn.addEventListener('click', closeCartDrawer);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCartDrawer);

  function openCartDrawer() {
    if (cartDrawer && cartOverlay) {
      cartDrawer.classList.add('open');
      cartOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeCartDrawer() {
    if (cartDrawer && cartOverlay) {
      cartDrawer.classList.remove('open');
      cartOverlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  // 2. Category & Brand Filtering Logic
  if (menuContainer) {
    // Check if body has explicit brandPage dataset
    if (document.body.dataset.brandPage) {
      currentBrand = document.body.dataset.brandPage;
    } else {
      // Check URL search params for brand
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has('brand')) {
        currentBrand = urlParams.get('brand');
      }
    }

    brandFilters.forEach(btn => {
      if (btn.dataset.brand === currentBrand) btn.classList.add('active');
      else btn.classList.remove('active');
    });

    renderCategoryPills();
    renderMenu();

    // Brand filter click events
    brandFilters.forEach(btn => {
      btn.addEventListener('click', () => {
        brandFilters.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentBrand = btn.dataset.brand;
        currentCategory = 'all';
        currentPage = 1;
        renderCategoryPills();
        renderMenu();
      });
    });

    // Search input
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        currentSearch = e.target.value.toLowerCase().trim();
        currentPage = 1;
        renderMenu();
      });
    }
  }

  function renderCategoryPills() {
    if (!categoryScroll) return;
    categoryScroll.innerHTML = '';

    // Collect categories based on current brand
    let relevantItems = menuData;
    if (currentBrand !== 'all') {
      relevantItems = menuData.filter(i => i.brand_id === currentBrand);
    }

    const categories = ['all', ...new Set(relevantItems.map(i => i.category).filter(Boolean))];

    categories.forEach(cat => {
      const btn = document.createElement('button');
      btn.className = `category-pill-btn ${cat === currentCategory ? 'active' : ''}`;
      btn.textContent = cat === 'all' ? 'All Categories' : cat;
      btn.addEventListener('click', () => {
        document.querySelectorAll('.category-pill-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentCategory = cat;
        currentPage = 1;
        renderMenu();
      });
      categoryScroll.appendChild(btn);
    });
  }

  function renderMenu() {
    if (!menuContainer) return;
    menuContainer.innerHTML = '';

    // Filter items
    let filtered = menuData.filter(item => {
      const matchBrand = (currentBrand === 'all' || item.brand_id === currentBrand);
      const matchCategory = (currentCategory === 'all' || item.category === currentCategory);
      const matchSearch = !currentSearch || (
        (item.name && item.name.toLowerCase().includes(currentSearch)) ||
        (item.category && item.category.toLowerCase().includes(currentSearch)) ||
        (item.item_code && item.item_code.toLowerCase().includes(currentSearch))
      );
      return matchBrand && matchCategory && matchSearch;
    });

    if (filtered.length === 0) {
      menuContainer.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 4rem 1rem; color: var(--text-dim);">
          <div style="font-size: 2.5rem; margin-bottom: 1rem;">🔍</div>
          <h4 style="font-size: 1.25rem; color: var(--text-light); margin-bottom: 0.5rem;">No dishes match your selection</h4>
          <p>Try selecting a different category, brand, or search term.</p>
          <button class="btn btn-outline btn-sm" style="margin-top: 1rem;" id="reset-menu-filters">Reset Filters</button>
        </div>
      `;
      document.getElementById('reset-menu-filters')?.addEventListener('click', () => {
        currentBrand = 'all';
        currentCategory = 'all';
        currentSearch = '';
        if (searchInput) searchInput.value = '';
        brandFilters.forEach(b => b.classList.toggle('active', b.dataset.brand === 'all'));
        renderCategoryPills();
        renderMenu();
      });
      if (paginationBar) paginationBar.innerHTML = '';
      return;
    }

    // Paginate
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedItems = filtered.slice(startIndex, startIndex + itemsPerPage);

    paginatedItems.forEach(item => {
      const card = document.createElement('div');
      card.className = 'menu-item-card';

      card.innerHTML = `
        <div>
          <div class="item-badge-row">
            <span class="item-brand-tag">${item.brand_name}</span>
            <span class="item-code-tag">${item.item_code}</span>
          </div>
          <h4 class="item-title">${item.name}</h4>
          <div class="item-category-label">${item.category}</div>
          ${item.description ? `<p class="item-desc">${item.description}</p>` : ''}
        </div>
        <div class="item-footer-row">
          <div class="item-price-wrap">
            <span class="item-price">${item.price_formatted}</span>
            ${item.calories ? `<span class="item-calories">🔥 ${item.calories}</span>` : ''}
          </div>
          <button class="item-add-btn" title="Add to Order" data-item-id="${item.id}">+</button>
        </div>
      `;

      card.querySelector('.item-add-btn').addEventListener('click', () => {
        addToCart(item);
      });

      menuContainer.appendChild(card);
    });

    // Render Pagination
    renderPagination(totalPages, filtered.length);
  }

  function renderPagination(totalPages, totalItemsCount) {
    if (!paginationBar) return;
    paginationBar.innerHTML = '';

    if (totalPages <= 1) return;

    const info = document.createElement('span');
    info.style.fontSize = '0.85rem';
    info.style.color = 'var(--text-dim)';
    info.style.marginRight = '1rem';
    info.textContent = `Showing ${(currentPage - 1) * itemsPerPage + 1} - ${Math.min(currentPage * itemsPerPage, totalItemsCount)} of ${totalItemsCount} dishes`;
    paginationBar.appendChild(info);

    // Prev
    if (currentPage > 1) {
      const prevBtn = document.createElement('button');
      prevBtn.className = 'btn btn-outline btn-sm';
      prevBtn.textContent = '← Prev';
      prevBtn.addEventListener('click', () => {
        currentPage--;
        renderMenu();
        document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth' });
      });
      paginationBar.appendChild(prevBtn);
    }

    // Page numbers
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    for (let p = startPage; p <= endPage; p++) {
      const pBtn = document.createElement('button');
      pBtn.className = `btn btn-sm ${p === currentPage ? 'btn-primary' : 'btn-outline'}`;
      pBtn.textContent = p;
      pBtn.addEventListener('click', () => {
        currentPage = p;
        renderMenu();
        document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth' });
      });
      paginationBar.appendChild(pBtn);
    }

    // Next
    if (currentPage < totalPages) {
      const nextBtn = document.createElement('button');
      nextBtn.className = 'btn btn-outline btn-sm';
      nextBtn.textContent = 'Next →';
      nextBtn.addEventListener('click', () => {
        currentPage++;
        renderMenu();
        document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth' });
      });
      paginationBar.appendChild(nextBtn);
    }
  }

  // 3. Cart & WhatsApp Logic
  function addToCart(item) {
    const existing = cart.find(c => c.id === item.id);
    if (existing) {
      existing.qty++;
    } else {
      cart.push({
        id: item.id,
        name: item.name,
        price: item.price || 0,
        price_formatted: item.price_formatted,
        brand_name: item.brand_name,
        item_code: item.item_code,
        qty: 1
      });
    }
    saveCart();
    updateCartUI();
    showToastNotification(`Added "${item.name}" to your order tray!`);
  }

  function removeFromCart(id) {
    cart = cart.filter(c => c.id !== id);
    saveCart();
    updateCartUI();
  }

  function updateQty(id, delta) {
    const item = cart.find(c => c.id === id);
    if (item) {
      item.qty += delta;
      if (item.qty <= 0) {
        removeFromCart(id);
      } else {
        saveCart();
        updateCartUI();
      }
    }
  }

  function saveCart() {
    localStorage.setItem('malay_cart', JSON.stringify(cart));
  }

  function updateCartUI() {
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    // Update Badges
    cartBadges.forEach(b => {
      b.textContent = totalQty;
      b.style.display = totalQty > 0 ? 'flex' : 'none';
    });

    if (cartSubtotalEl) {
      cartSubtotalEl.textContent = `${subtotal.toLocaleString()} LKR`;
    }

    if (cartItemsBody) {
      if (cart.length === 0) {
        cartItemsBody.innerHTML = `
          <div class="cart-empty-state">
            <div style="font-size: 2.8rem; margin-bottom: 0.5rem;">🍽️</div>
            <h4 style="color: var(--text-light); margin-bottom: 0.4rem;">Your Order Tray is Empty</h4>
            <p style="font-size: 0.85rem;">Explore our 600+ authentic dishes across Malay Restaurant & sister brands and add your favorites.</p>
          </div>
        `;
        if (whatsappOrderBtn) {
          whatsappOrderBtn.classList.add('disabled');
          whatsappOrderBtn.href = 'javascript:void(0)';
        }
      } else {
        cartItemsBody.innerHTML = '';
        cart.forEach(item => {
          const row = document.createElement('div');
          row.className = 'cart-item-row';
          const lineTotal = item.price > 0 ? `${(item.price * item.qty).toLocaleString()} LKR` : 'Inquiry';

          row.innerHTML = `
            <div class="cart-item-info">
              <div class="cart-item-name">${item.name}</div>
              <div class="cart-item-meta">${item.brand_name} (${item.item_code})</div>
              <div class="cart-item-price">${lineTotal}</div>
            </div>
            <div class="cart-qty-ctrls">
              <button class="cart-qty-btn minus" data-id="${item.id}">−</button>
              <span class="cart-qty-num">${item.qty}</span>
              <button class="cart-qty-btn plus" data-id="${item.id}">+</button>
            </div>
          `;

          row.querySelector('.minus').addEventListener('click', () => updateQty(item.id, -1));
          row.querySelector('.plus').addEventListener('click', () => updateQty(item.id, 1));
          cartItemsBody.appendChild(row);
        });

        // WhatsApp Link Generator
        if (whatsappOrderBtn) {
          whatsappOrderBtn.classList.remove('disabled');
          const waMessage = formatWhatsAppOrderMessage(cart, subtotal);
          whatsappOrderBtn.href = `https://wa.me/94777770363?text=${encodeURIComponent(waMessage)}`;
          whatsappOrderBtn.target = '_blank';
        }
      }
    }
  }

  function formatWhatsAppOrderMessage(items, total) {
    let msg = `🍽️ *NEW ORDER - MALAY RESTAURANT GROUP*\n`;
    msg += `----------------------------------------\n`;
    items.forEach(it => {
      const priceStr = it.price > 0 ? `${(it.price * it.qty).toLocaleString()} LKR` : 'Inquiry';
      msg += `• ${it.qty}x ${it.name} [${it.brand_name}] - ${priceStr}\n`;
    });
    msg += `----------------------------------------\n`;
    msg += `*Estimated Total: ${total.toLocaleString()} LKR*\n`;
    msg += `----------------------------------------\n`;
    msg += `Order Type: (Dine-In / Takeaway / Delivery)\n`;
    msg += `Customer Name:\n`;
    msg += `Contact Number:\n`;
    msg += `Delivery Address:\n`;
    msg += `Special Notes:\n`;
    return msg;
  }

  function showToastNotification(msg) {
    let toast = document.getElementById('malay-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'malay-toast';
      toast.style.position = 'fixed';
      toast.style.bottom = '80px';
      toast.style.right = '20px';
      toast.style.background = '#7D131A';
      toast.style.color = '#FFFFFF';
      toast.style.padding = '0.75rem 1.25rem';
      toast.style.borderRadius = '30px';
      toast.style.border = '1px solid #F5B838';
      toast.style.boxShadow = '0 8px 24px rgba(0,0,0,0.6)';
      toast.style.zIndex = '9999';
      toast.style.fontSize = '0.88rem';
      toast.style.fontWeight = '600';
      toast.style.transition = 'all 0.3s ease';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(15px)';
    }, 2800);
  }

  // 4. Catering Form WhatsApp Submission
  const cateringForm = document.getElementById('catering-form');
  if (cateringForm) {
    cateringForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('c-name')?.value || '';
      const phone = document.getElementById('c-phone')?.value || '';
      const date = document.getElementById('c-date')?.value || '';
      const pax = document.getElementById('c-pax')?.value || '';
      const brand = document.getElementById('c-brand')?.value || 'Malay Restaurant';
      const notes = document.getElementById('c-notes')?.value || '';

      let text = `🎉 *CATERING / EVENT INQUIRY - MALAY RESTAURANT GROUP*\n`;
      text += `----------------------------------------\n`;
      text += `• Name: ${name}\n`;
      text += `• Phone: ${phone}\n`;
      text += `• Event Date: ${date}\n`;
      text += `• Expected Guests: ${pax}\n`;
      text += `• Preferred Brand/Cuisine: ${brand}\n`;
      text += `• Requirements/Notes: ${notes}\n`;
      text += `----------------------------------------\n`;

      const url = `https://wa.me/94777770363?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank');
      showToastNotification('Opening WhatsApp with your Catering Inquiry...');
      cateringForm.reset();
    });
  }
});
