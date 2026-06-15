let allCompanies = [];

function createCompanyCard(company) {
    const card = document.createElement('main');
    card.className = 'card';

    card.innerHTML = `
        <div class="card-head">
            <div class="card-logo">
                <img src="${company.path_logo || 'icon/logo.svg'}" 
                     alt="${company.company_name}"
                     onerror="this.src='icon/logo.svg'">
            </div>
            <div class="card-text">
                <h1 class="brand">${company.company_name}</h1>
                <div class="person">${company.director || 'Директор не указан'}</div>
            </div>
        </div>
        <div class="description">
            ${company.company_description || 'Описание отсутствует'}
        </div>
        <div class="services">
            ${company.specialization ? company.specialization.split(',').map(tag =>
        `<span class="tag-badge">${tag.trim()}</span>`
    ).join('') : '<span class="tag-badge">IT</span>'}
        </div>
        <a href="${company.company_site || '#'}" class="employer-link" target="_blank">
            Посетить сайт работодателя
        </a>
    `;

    return card;
}

function displayCompanies(companies) {
    const container = document.querySelector('.employers');
    container.innerHTML = '';

    if (!companies || companies.length === 0) {
        container.innerHTML = '<div style="text-align: center; padding: 50px;">Ничего не найдено</div>';
        return;
    }

    companies.forEach(company => {
        container.appendChild(createCompanyCard(company));
    });
}

function searchCompanies() {
    const searchInput = document.querySelector('.search-input');
    const query = searchInput.value.toLowerCase().trim();

    if (query === '') {
        displayCompanies(allCompanies);
    } else {
        const filtered = allCompanies.filter(company => {
            return company.company_name?.toLowerCase().includes(query) ||
                company.director?.toLowerCase().includes(query) ||
                company.company_description?.toLowerCase().includes(query) ||
                company.specialization?.toLowerCase().includes(query);
        });
        displayCompanies(filtered);
    }
}

async function loadCompanies() {
    try {
        const response = await fetch('http://localhost:3001/company');
        const result = await response.json();

        if (response.ok) {
            allCompanies = result.data;
            displayCompanies(allCompanies);
        } else {
            console.error('Ошибка:', result.error);
        }
    } catch (error) {
        console.error('Ошибка подключения:', error);
    }
}

function setupSearch() {
    const searchBtn = document.querySelector('.search-btn');
    const searchInput = document.querySelector('.search-input');

    if (!searchBtn || !searchInput) return;

    searchBtn.addEventListener('click', searchCompanies);

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchCompanies();
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadCompanies();
    setupSearch();
});