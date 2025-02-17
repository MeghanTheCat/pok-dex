const ITEMS_PER_PAGE = 10;
let currentPage = 1;
let allPokemon = [];
let searchTimeout;
let activeFilters = [];

// Constantes pour les messages d'erreur
const ERROR_MESSAGES = {
    AUTH_REQUIRED: 'Token d\'authentification non trouvé, veuillez vous connecter.',
    SESSION_EXPIRED: 'Session expirée. Veuillez vous reconnecter.',
    INVALID_FORMAT: 'Format de données invalide',
    NO_POKEMON: 'Aucun pokémon trouvé',
    SEARCH_ERROR: 'Erreur lors de la recherche des Pokémon.'
};

// Couleurs des types de Pokémon
const TYPE_COLORS = {
    'fire': '#FF4422',
    'water': '#3399FF',
    'grass': '#77CC55',
    'electric': '#FFCC33',
    'normal': '#AAAA99',
    'fighting': '#BB5544',
    'flying': '#8899FF',
    'poison': '#AA5599',
    'ground': '#DDBB55',
    'rock': '#BBAA66',
    'psychic': '#FF5599',
    'ice': '#66CCFF',
    'bug': '#AABB22',
    'dragon': '#7766EE',
    'ghost': '#6666BB',
    'dark': '#775544',
    'steel': '#AAAABB',
    'fairy': '#EE99EE'
};

function getAuthToken() {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error(ERROR_MESSAGES.AUTH_REQUIRED);
    }
    return token;
}

function getTypeColor(type) {
    return TYPE_COLORS[type.toLowerCase()] || '#666666';
}

async function fetchPokemon() {
    try {
        const token = getAuthToken();
        const response = await fetch('http://localhost:3000/api/pkmn/all', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(response.status === 401
                ? ERROR_MESSAGES.SESSION_EXPIRED
                : ERROR_MESSAGES.SEARCH_ERROR);
        }

        const responseData = await response.json();
        allPokemon = responseData.data;

        if (!Array.isArray(allPokemon)) {
            throw new Error(ERROR_MESSAGES.INVALID_FORMAT);
        }
        if (allPokemon.length === 0) {
            throw new Error(ERROR_MESSAGES.NO_POKEMON);
        }

        displayCurrentPage();
        updatePaginationControls();
    } catch (error) {
        console.error('Erreur lors de la récupération des Pokémon:', error);
        document.getElementById('pokemon-container').innerHTML =
            `<p class="error-message">${error.message}</p>`;
    }
}

function displayCurrentPage() {
    const container = document.getElementById('pokemon-container');
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const currentPokemon = allPokemon.slice(start, end);

    container.innerHTML = currentPokemon.map(pokemon => `
        <div class="pokemon-card">
            <img src="${pokemon.imagePath}" alt="${pokemon.name}">
            <h3>${pokemon.name}</h3>
            <div class="pokemon-types">
                ${pokemon.types.map(type =>
        `<span class="type-badge"
                        onclick="addTypeFilter('${type}')"
                        style="background-color: ${getTypeColor(type)}">${type}</span>`
    ).join('')}
            </div>
        </div>
    `).join('');
}

function updatePaginationControls() {
    const totalPages = Math.ceil(allPokemon.length / ITEMS_PER_PAGE);
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const pageInfo = document.getElementById('page-info');

    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
    pageInfo.textContent = `Page ${currentPage} sur ${totalPages}`;
}

async function searchPokemon(query = '') {
    try {
        const token = getAuthToken();
        let url = 'http://localhost:3000/api/pkmn/search?';

        const params = new URLSearchParams();
        if (query) {
            params.append('partialName', query);
        }
        if (activeFilters.length > 0) {
            params.append('typeOne', activeFilters[0]);
            if (activeFilters[1]) {
                params.append('typeTwo', activeFilters[1]);
            }
        }

        const response = await fetch(`${url}${params.toString()}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(response.status === 401
                ? ERROR_MESSAGES.SESSION_EXPIRED
                : ERROR_MESSAGES.SEARCH_ERROR);
        }

        const responseData = await response.json();
        allPokemon = responseData.data;
        currentPage = 1;

        if (allPokemon.length === 0) {
            document.getElementById('pokemon-container').innerHTML =
                '<p class="error-message">Aucun Pokémon trouvé pour cette recherche.</p>';
            updatePaginationControls();
            return;
        }

        displayCurrentPage();
        updatePaginationControls();
    } catch (error) {
        console.error('Erreur lors de la recherche:', error);
        document.getElementById('pokemon-container').innerHTML =
            `<p class="error-message">${error.message}</p>`;
    }
}

function addTypeFilter(type) {
    if (activeFilters.length >= 2 || activeFilters.includes(type)) {
        return;
    }
    activeFilters.push(type);
    updateActiveFiltersDisplay();
    searchPokemon(document.getElementById('search-input').value.trim());
}

function removeTypeFilter(type) {
    activeFilters = activeFilters.filter(t => t !== type);
    updateActiveFiltersDisplay();
    searchPokemon(document.getElementById('search-input').value.trim());
}

function updateActiveFiltersDisplay() {
    const filtersContainer = document.getElementById('active-filters');
    filtersContainer.innerHTML = activeFilters.map(type => `
        <span class="filter-badge" 
            style="background-color: ${getTypeColor(type)}"
            onclick="removeTypeFilter('${type}')">${type}</span>
    `).join('');
}

// Event Listeners
document.getElementById('prev-btn').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        displayCurrentPage();
        updatePaginationControls();
    }
});

document.getElementById('next-btn').addEventListener('click', () => {
    const totalPages = Math.ceil(allPokemon.length / ITEMS_PER_PAGE);
    if (currentPage < totalPages) {
        currentPage++;
        displayCurrentPage();
        updatePaginationControls();
    }
});

document.getElementById('search-input').addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    const query = e.target.value.trim();
    searchTimeout = setTimeout(() => searchPokemon(query), 300);
});

// Initial load
fetchPokemon();