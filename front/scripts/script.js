const ITEMS_PER_PAGE = 10;
let currentPage = 1;
let allPokemon = [];

function getAuthToken() {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('Token d\'authentification non trouvé, veuillez vous connecter.');
    }
    return token;
}

// Fonction pour récupérer tous les Pokémon
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
                ? 'Session expirée. Veuillez vous reconnecter.'
                : 'Error lors de la récupération des Pokémons.');
        }

        const responseData = await response.json();
        allPokemon = responseData.data;
        if (!Array.isArray(allPokemon)) {
            throw new Error('Format de données invalide');
        }
        if (allPokemon.length === 0) {
            throw new Error('Aucun pokémon trouvé');
        }
        displayCurrentPage();
        updatePaginationControls();
    } catch (error) {
        console.error('Erreur lors de la récupération des Pokémon:', error);
        document.getElementById('pokemon-container').innerHTML =
            `<p class="error-message">${error.message}</p>`;
    }
}

// Fonction pour afficher les Pokémon de la page courante
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
        `<span class="type-badge" style="background-color: ${getTypeColor(type)}">${type}</span>`
    ).join('')}
        </div>
        </div>
        `).join('');
}

// Fonction pour mettre à jour les contrôles de pagination
function updatePaginationControls() {
    const totalPages = Math.ceil(allPokemon.length / ITEMS_PER_PAGE);
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const pageInfo = document.getElementById('page-info');

    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
    pageInfo.textContent = `Page ${currentPage} sur ${totalPages}`;
}

// Fonction pour obtenir la couleur correspondant au type
function getTypeColor(type) {
    const typeColors = {
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
    return typeColors[type.toLowerCase()] || '#666666';
}

// Gestionnaires d'événements pour la pagination
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

let searchTimeout;

async function searchPokemon(query) {
    try {
        const token = getAuthToken();
        const response = await fetch(`http://localhost:3000/api/pkmn/search?partialName=${encodeURIComponent(query)}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(response.status === 401
                ? 'Session expirée. Veuillez vous reconnecter.'
                : 'Erreur lors de la recherche des Pokémon.');
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

document.getElementById('search-input').addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    const query = e.target.value.trim();

    if (query === '') {
        fetchPokemon();
        return;
    }

    searchTimeout = setTimeout(() => {
        searchPokemon(query);
    }, 300);
});

fetchPokemon();