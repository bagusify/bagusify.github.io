let appData = null;

// Initialization: Fetch Data
document.addEventListener('DOMContentLoaded', () => {
    fetch('data.json')
        .then(res => res.json())
        .then(data => {
            appData = data;
            renderAll();
        });
});

function renderAll() {
    renderCustomApps();
    renderWeddingInvites();
}

function renderCustomApps() {
    const isYearly = document.getElementById('priceToggle').checked;
    const container = document.getElementById('custom-apps-grid');
    container.innerHTML = '';

    appData.customApps.tiers.forEach(tier => {
        const price = isYearly ? tier.priceYearly : tier.priceMonthly;
        const formattedPrice = new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0
        }).format(price);

        container.innerHTML += `
            <div class="col-md-6 col-lg-3">
                <div class="price-card">
                    <small class="text-teal fw-bold font-monospace">${tier.tag}</small>
                    <h4 class="mt-2 fw-bold">${tier.name}</h4>
                    <p class="text-muted small">${tier.description}</p>
                    <h3 class="fw-bold mt-4">${formattedPrice}</h3>
                    <span class="text-muted small">${isYearly ? '/tahun' : '/bulan'}</span>
                    ${tier.bonus ? `<div class="mt-3"><span class="badge-bonus">${tier.bonus}</span></div>` : ''}
                </div>
            </div>
        `;
    });
}

function renderWeddingInvites() {
    const container = document.getElementById('wedding-grid');
    container.innerHTML = '';

    appData.weddingSuites.forEach(pkg => {
        const featureList = pkg.features.map(f => `<li class="mb-2">✓ ${f}</li>`).join('');
        
        container.innerHTML += `
            <div class="col-md-5">
                <div class="wedding-card ${pkg.popular ? 'popular' : ''}">
                    ${pkg.popular ? '<span class="position-absolute top-0 start-50 translate-middle badge bg-warning text-dark px-3">POPULER</span>' : ''}
                    <h3 class="fw-bold text-gold">${pkg.name}</h3>
                    <h4 class="fw-bold my-3">${pkg.priceRange}</h4>
                    <p class="text-muted small mb-4">Masa Aktif: ${pkg.validity}</p>
                    <ul class="list-unstyled small text-secondary">
                        ${featureList}
                    </ul>
                    <button class="btn ${pkg.popular ? 'btn-dark' : 'btn-outline-dark'} w-100 mt-4 rounded-0">Pilih Paket</button>
                </div>
            </div>
        `;
    });
}

// Interaction States
let activeSide = null;

function togglePanel(side, e) {
    if(e) e.stopPropagation();
    
    if (activeSide === side) {
        closeAll();
        return;
    }

    closeAll();
    document.getElementById(`panel-${side}`).classList.add('panel-active');
    document.getElementById('hero-bg').classList.add('hero-dimmed');
    activeSide = side;
}

function closeAll() {
    document.querySelectorAll('.side-panel').forEach(p => p.classList.remove('panel-active'));
    document.getElementById('hero-bg').classList.remove('hero-dimmed');
    activeSide = null;
}

function updatePriceView() {
    renderCustomApps();
}

// Keyboard ESC support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAll();
});