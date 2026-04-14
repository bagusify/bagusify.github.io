// 1. Global State
let appData = null;
window.activeSide = null;

function setRandomHero() {
    const hero = document.getElementById('hero-bg');
    if (!hero) return;
    
    const randomImg = "https://picsum.photos/2076?grayscale&blur";
    
    // We keep the white radial gradient overlay at 90% opacity 
    // so the text remains perfectly readable on the light theme.
    hero.style.background = `radial-gradient(circle at center, rgba(255,255,255,0.9) 0%, rgba(229,231,235,0.95) 100%), url('${randomImg}') center/cover no-repeat`;
}

// 2. EXPLICIT WINDOW BINDINGS (Fixes onclick errors)
window.togglePanel = function(side, e) {
    // THE FIX: Stop the click from triggering anything else
    if (e) {
        e.preventDefault(); 
        e.stopPropagation(); 
    }
    
    if (window.activeSide === side) {
        window.closeAll();
        return;
    }

    window.closeAll();
    const panel = document.getElementById(`panel-${side}`);
    const hero = document.getElementById('hero-bg');
    
    if (panel) panel.classList.add('panel-active');
    if (hero) hero.classList.add('hero-dimmed');
    
    window.activeSide = side;
};

window.closeAll = function() {
    document.querySelectorAll('.side-panel').forEach(p => p.classList.remove('panel-active'));
    const hero = document.getElementById('hero-bg');
    if(hero) hero.classList.remove('hero-dimmed');
    window.activeSide = null;
};

window.updatePriceView = function() {
    renderCustomApps();
};

// 3. INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
    // Inject random background immediately
    setRandomHero();

    fetch('src/data/master.json')
        .then(res => {
            if (!res.ok) throw new Error("HTTP error " + res.status);
            return res.json();
        })
        .then(data => {
            appData = data;
            renderAll();
        })
        .catch(err => {
            console.error("Data Load Error: Are you running Live Server?", err);
        });
});

// 4. RENDER LOGIC (With Defensive Checks)
function renderAll() {
    renderCustomApps();
    renderWeddingInvites();
}

function renderCustomApps() {
    // DEFENSIVE CHECK: Ensure data exists before looping
    if (!appData || !appData.customApps || !appData.customApps.tiers) {
        console.warn("Render Aborted: customApps data is missing.");
        return;
    }

    const toggleEl = document.getElementById('priceToggle');
    const isYearly = toggleEl ? toggleEl.checked : false; // Failsafe if toggle is missing
    
    const container = document.getElementById('custom-apps-grid');
    if (!container) {
        console.warn("Render Aborted: #custom-apps-grid not found in HTML.");
        return; 
    }

    container.innerHTML = ''; // Clear previous

    appData.customApps.tiers.forEach(tier => {
        const price = isYearly ? tier.priceYearly : tier.priceMonthly;
        const formattedPrice = new Intl.NumberFormat('id-ID', {
            style: 'currency', currency: 'IDR', maximumFractionDigits: 0
        }).format(price);

        container.innerHTML += `
            <div class="col-md-6 col-lg-3">
                <div class="price-card h-100">
                    <small class="text-teal fw-bold font-monospace">${tier.tag || 'TIER'}</small>
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
    if (!appData || !appData.weddingSuites) return;

    const container = document.getElementById('wedding-grid');
    if (!container) return;
    
    container.innerHTML = '';

    appData.weddingSuites.forEach(pkg => {
        const featureList = pkg.features.map(f => `<li class="mb-2">✓ ${f}</li>`).join('');
        
        container.innerHTML += `
            <div class="col-md-5">
                <div class="wedding-card h-100 ${pkg.popular ? 'popular' : ''}">
                    ${pkg.popular ? '<span class="position-absolute top-0 start-50 translate-middle badge bg-warning text-dark px-3 shadow-sm">POPULER</span>' : ''}
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

// 5. GLOBAL ESCAPE LISTENER
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') window.closeAll();
});