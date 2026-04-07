let categories = [
    { id: 1, name: "Electronics", description: "Electronic devices and accessories" },
    { id: 2, name: "Clothing", description: "Apparel and fashion items" },
    { id: 3, name: "Food & Beverage", description: "Consumable goods and drinks" },
    { id: 4, name: "Office Supplies", description: "Stationery and office equipment" },
    { id: 5, name: "Tools & Hardware", description: "Hand tools and power equipment" },
];

let products = [
    { id: 1, name: "Wireless Headphones", sku: "SKU-WH-001", categoryId: 1, price: 89.99, quantity: 45, lowStockThreshold: 10, status: "active" },
    { id: 2, name: "USB C", sku: "SKU-USB-002", categoryId: 1, price: 49.99, quantity: 8, lowStockThreshold: 15, status: "active" },
    { id: 3, name: "Mechanical Keyboard", sku: "SKU-KB-003", categoryId: 1, price: 129.99, quantity: 22, lowStockThreshold: 10, status: "active" },
    { id: 4, name: "Laptop Stand", sku: "SKU-LS-004", categoryId: 1, price: 39.99, quantity: 5, lowStockThreshold: 10, status: "active" },
    { id: 5, name: "LED Desk Lamp", sku: "SKU-DL-005", categoryId: 1, price: 34.99, quantity: 60, lowStockThreshold: 10, status: "active" },
    { id: 6, name: "Classic T Shirt White", sku: "SKU-TS-101", categoryId: 2, price: 19.99, quantity: 120, lowStockThreshold: 20, status: "active" },
    { id: 7, name: "Slim Fit Jeans", sku: "SKU-JN-102", categoryId: 2, price: 59.99, quantity: 3, lowStockThreshold: 15, status: "active" },
    { id: 8, name: "Hoodie Pullover", sku: "SKU-HD-103", categoryId: 2, price: 44.99, quantity: 75, lowStockThreshold: 20, status: "inactive" },
    { id: 9, name: "Running Sneakers", sku: "SKU-SN-104", categoryId: 2, price: 79.99, quantity: 40, lowStockThreshold: 15, status: "active" },
    { id: 10, name: "Premium Ground Coffee", sku: "SKU-CF-201", categoryId: 3, price: 14.99, quantity: 200, lowStockThreshold: 30, status: "active" },
    { id: 11, name: "Green Tea Pack", sku: "SKU-GT-202", categoryId: 3, price: 9.99, quantity: 7, lowStockThreshold: 20, status: "active" },
    { id: 12, name: "Protein Bars Box", sku: "SKU-PB-203", categoryId: 3, price: 24.99, quantity: 55, lowStockThreshold: 15, status: "active" },
    { id: 13, name: "A4 Copy Paper", sku: "SKU-OP-301", categoryId: 4, price: 8.99, quantity: 300, lowStockThreshold: 50, status: "active" },
    { id: 14, name: "Ballpoint Pens Set", sku: "SKU-PN-302", categoryId: 4, price: 5.99, quantity: 6, lowStockThreshold: 20, status: "active" },
    { id: 15, name: "Stapler Heavy Duty", sku: "SKU-ST-303", categoryId: 4, price: 15.99, quantity: 30, lowStockThreshold: 10, status: "active" },
    { id: 16, name: "Power Drill 18V", sku: "SKU-TL-401", categoryId: 5, price: 99.99, quantity: 12, lowStockThreshold: 5, status: "active" },
    { id: 17, name: "Tape Measure 5m", sku: "SKU-TM-402", categoryId: 5, price: 12.99, quantity: 2, lowStockThreshold: 10, status: "active" },
    { id: 18, name: "Safety Gloves L", sku: "SKU-SG-403", categoryId: 5, price: 18.99, quantity: 50, lowStockThreshold: 15, status: "discontinued" },
];

let nextId = 19, lowStockOnly = false;


function showPage(name, el) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

    document.getElementById('page-' + name).classList.add('active');
    el.classList.add('active');
    if (name === 'dashboard') renderDashboard();
    if (name === 'products') renderProducts();
    if (name === 'categories') renderCategories();
    closeAllDropdowns();
}

function renderDashboard() {


    const totalValue = products.reduce((s, p) => s + p.price * p.quantity, 0);
    const lowItems = products.filter(p => p.quantity <= p.lowStockThreshold);
    const active = products.filter(p => p.status === 'active').length;


    document.getElementById('kpi-total').textContent = products.length;
    document.getElementById('kpi-active-sub').textContent = active + ' active';
    document.getElementById('kpi-value').textContent = '$' + totalValue;
    document.getElementById('kpi-low').textContent = lowItems.length;
    document.getElementById('kpi-cats').textContent = categories.length;

    const counts = {};

    categories.forEach(c => counts[c.id] = 0);

    products.forEach(p => { if (p.categoryId) counts[p.categoryId] = (counts[p.categoryId] || 0) + 1; });

    const maxCount = Math.max(...Object.values(counts), 1);

    document.getElementById('bar-chart').innerHTML = categories.map(c => `
    
        <div class="bar-col">
      <div class="bar" style="height:${Math.max(8, (counts[c.id] / maxCount) * 160)}px" title="${c.name}: ${counts[c.id]}"></div>
      <div class="bar-label">${c.name.split(' ')[0]}</div>
    </div>`).join('');

    const listEl = document.getElementById('low-stock-list');

    listEl.innerHTML = lowItems.map(p => `
        <div class="alert-item">

          <div><div class="alert-name">${p.name}</div><div class="alert-sku">${p.sku}</div></div>
          <span class="stock-badge">${p.quantity} / ${p.lowStockThreshold}</span>

        </div>`).join('');
}

function renderProducts() {
    const sel = document.getElementById('filter-cat');

    const cur = sel.value;

    sel.innerHTML = '<option value="">All Categories</option>' + categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    sel.value = cur;

    const search = document.getElementById('search-input').value.toLowerCase();
    const catF = sel.value;
    const statF = document.getElementById('filter-status').value;

    const filtered = products.filter(p =>

        (!search || p.name.toLowerCase().includes(search) || p.sku.toLowerCase().includes(search)) &&
        (!catF || String(p.categoryId) === catF) &&
        (!statF || p.status === statF) &&
        (!lowStockOnly || p.quantity <= p.lowStockThreshold)
    );

    document.getElementById('product-tbody').innerHTML = filtered.map(p => {

        const cat = categories.find(c => c.id === p.categoryId);
        const isLow = p.quantity <= p.lowStockThreshold;


        return `<tr>


          <td><div class="prod-name">${p.name}</div><div class="prod-sku">${p.sku}</div></td>

          <td>${cat ? cat.name : '<span style="color:var(--muted)">—</span>'}</td>
          
          <td>$${p.price.toFixed(2)}</td>
          
          <td class="stock-num ${isLow ? 'stock-low' : ''}">${p.quantity}${isLow ? '<span class="dot"></span>' : ''}</td>
          
          <td><span class="badge badge-${p.status}">${p.status[0].toUpperCase() + p.status.slice(1)}</span></td>
          
          <td><div class="action-wrap">
          
          <button class="action-btn" onclick="toggleDropdown(${p.id})">⋯</button>
          
          <div class="dropdown" id="drop-${p.id}">
          
          <button onclick="editProduct(${p.id})">Edit</button>
          
          <button class="del" onclick="deleteProduct(${p.id})">Delete</button>
          
          </div>
          
          </div></td>
        </tr>`;

    }).join('');
}

function toggleLowStock() {
    lowStockOnly = !lowStockOnly;
    document.getElementById('low-stock-toggle').classList.toggle('on', lowStockOnly);
    renderProducts();
}

function openProductModal(p) {
    document.getElementById('f-cat').innerHTML = '<option value="">None</option>' + categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    document.getElementById('modal-title').textContent = p ? 'Edit Product' : 'Add Product';
    document.getElementById('edit-id').value = p ? p.id : '';
    document.getElementById('f-name').value = p ? p.name : '';
    document.getElementById('f-sku').value = p ? p.sku : '';
    document.getElementById('f-desc').value = p ? (p.description || '') : '';
    document.getElementById('f-cat').value = p ? (p.categoryId || '') : '';
    document.getElementById('f-status').value = p ? p.status : 'active';
    document.getElementById('f-price').value = p ? p.price : '';
    document.getElementById('f-qty').value = p ? p.quantity : '';
    document.getElementById('f-threshold').value = p ? p.lowStockThreshold : 10;
    document.getElementById('product-modal').classList.add('open');
}
function closeProductModal() { document.getElementById('product-modal').classList.remove('open'); }

function saveProduct() {
    const name = document.getElementById('f-name').value;

    const sku = document.getElementById('f-sku').value;

    const price = parseFloat(document.getElementById('f-price').value);

    const qty = parseInt(document.getElementById('f-qty').value);

    if (!name || !sku || isNaN(price) || isNaN(qty)) {
        alert('Fill in all required fields.');
        return;
    }

    const data = {
        name, sku,

        description: document.getElementById('f-desc').value,
        categoryId: parseInt(document.getElementById('f-cat').value),
        status: document.getElementById('f-status').value,
        price, quantity: qty,

        lowStockThreshold: parseInt(document.getElementById('f-threshold').value) || 10,
    };

    const editId = parseInt(document.getElementById('edit-id').value);

    if (editId) {
        const i = products.findIndex(p => p.id === editId);
        if (i !== -1) products[i] = { ...products[i], ...data };

    }
    else products.push({ id: nextId++, ...data });

    closeProductModal();
    renderProducts();
    renderDashboard();
}

function editProduct(id) {
    closeAllDropdowns();
    openProductModal(products.find(p => p.id === id));
}

function deleteProduct(id) {
    closeAllDropdowns();
    if (!confirm('Delete this product?')) return;

    products = products.filter(p => p.id !== id);

    renderProducts();
    renderDashboard();
}

function renderCategories() {
    document.getElementById('cat-grid').innerHTML =
        categories.map(c => {

            const count = products.filter(p => p.categoryId === c.id).length;

            return `<div class="cat-card">

          <h4>${c.name}</h4>
          
          <div class="cat-footer">

            <span class="cat-count">${count} products</span>
            <button class="btn btn-danger btn-sm" onclick="deleteCategory(${c.id})">Delete</button>
          </div>

        </div>`;
        }).join('');
}

function openCatModal() {
    document.getElementById('cf-name').value = '';
    document.getElementById('cf-desc').value = '';
    document.getElementById('cat-modal').classList.add('open');
}
function closeCatModal() {
    document.getElementById('cat-modal').classList.remove('open');
}

function saveCategory() {
    const name = document.getElementById('cf-name').value;

    if (!name) { alert('Category name is required.'); return; }

    categories.push({ id: nextId++, name, description: document.getElementById('cf-desc').value });

    closeCatModal(); renderCategories();
}

function deleteCategory(id) {
    if (!confirm('Delete this category?')) return;

    categories = categories.filter(c => c.id !== id);

    products = products.map(p => p.categoryId === id ? { ...p, categoryId: null } : p);

    renderCategories(); renderDashboard();
}



renderDashboard();