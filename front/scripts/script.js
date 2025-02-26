const ITEMS_PER_PAGE = 10;
let currentPage = 1;
let allPokemon = [];
let searchTimeout;
let activeFilters = [];

const ERROR_MESSAGES = {
    AUTH_REQUIRED: 'Token d\'authentification non trouvé, veuillez vous connecter.',
    SESSION_EXPIRED: 'Session expirée. Veuillez vous reconnecter.',
    INVALID_FORMAT: 'Format de données invalide',
    NO_POKEMON: 'Aucun pokémon trouvé',
    SEARCH_ERROR: 'Erreur lors de la recherche des Pokémon.'
};

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

function checkAuthStatus() {
    const token = localStorage.getItem('token');
    const userInfo = localStorage.getItem('userInfo');

    const signInLink = document.getElementById('sign-in-link');
    const userInfoSection = document.getElementById('user-info');
    const usernameDisplay = document.getElementById('username-display');

    const trainerLink = document.getElementById('trainer-link');

    if (token && userInfo) {
        const user = JSON.parse(userInfo);
        signInLink.classList.add('hidden');
        userInfoSection.classList.remove('hidden');
        trainerLink.classList.remove('hidden');
        usernameDisplay.textContent = user.username;
        return true;
    } else {
        signInLink.classList.remove('hidden');
        userInfoSection.classList.add('hidden');
        trainerLink.classList.add('hidden');
        return false;
    }
}

function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    window.location.reload();
}

document.addEventListener('DOMContentLoaded', () => {
    checkAuthStatus();

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
});

function getAuthToken() {
    const token = localStorage.getItem('token');
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

async function displayCurrentPage() {
    const container = document.getElementById('pokemon-container');
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const currentPokemon = allPokemon.slice(start, end);
    const token = getAuthToken();
    container.innerHTML = '';
    let trainer = null;

    if (localStorage.getItem('userInfo')) {
        const user = JSON.parse(localStorage.getItem('userInfo'));
        const username = user.username;
        const response = await fetch(`http://localhost:3000/trainer/search?username=${username}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        trainer = await response.json();
        trainer = trainer.data;
    }

    currentPokemon.forEach(pokemon => {
        let isSeen = false;
        let isCaptured = false;
        let imageFilter = 'brightness(0)';

        if (trainer != null) {
            isCaptured = trainer.pkmnCatch.some(capturedPkmn => capturedPkmn.name === pokemon.name);
            isSeen = trainer.pkmnSeen.some(seenPkmn => seenPkmn.name === pokemon.name);

            if (isCaptured) {
                imageFilter = 'none'; // Normal
            } else if (isSeen) {
                imageFilter = 'grayscale(100%)'; // Noir et blanc
            }
        } else {
            isCaptured = true;
            isSeen = true;
            imageFilter = 'brightness(1)'
        }

        let typesHTML = '';
        pokemon.types.forEach(type => {
            typesHTML += `<span class="type-badge"
                onclick="addTypeFilter('${type}')"
                style="background-color: ${getTypeColor(type)}">${type}</span>`;
        });

        // Ne montrer les boutons que si le Pokémon n'est ni vu ni capturé
        const actionButtons = (!isSeen && !isCaptured) ? `
            <div class="pokemon-actions">
                <button class="action-btn see-btn"
                    onclick="handleSeePokemon('${pokemon._id}', '${trainer._id}')">
                    <img src="assets/search.png"/>
                </button>
                <button class="action-btn catch-btn"
                    onclick="handleCatchPokemon('${pokemon._id}', '${trainer._id}')">
                    <img src="assets/pokeball.png"/>
                </button>
            </div>
        ` : (!isCaptured) ? `
            <div class="pokemon-actions">
                <button class="action-btn catch-btn"
                    onclick="handleCatchPokemon('${pokemon._id}', '${trainer._id}')">
                    <img src="assets/pokeball.png"/>
                </button>
            </div>
        ` : '';
        const pokemonCard = `
            <div class="pokemon-card" data-name="${pokemon.name}">
                <div class="pokemon-image-container">
                    <img src="${pokemon.imagePath}" alt="${pokemon.name}" 
                        class="pokemon-image" 
                        style="filter: ${imageFilter}">
                    ${actionButtons}
                </div>
                <h3 class="pokemon-name">${pokemon.name}</h3>
                <div class="pokemon-types">
                    ${typesHTML}
                </div>
            </div>
        `;
        container.innerHTML += pokemonCard;
    });

    if (token) {
        document.querySelectorAll('.pokemon-card').forEach(card => {
            const pokemonName = card.getAttribute('data-name');
            card.querySelector('.pokemon-name').addEventListener('click', () => {
                openDetailPokedex(pokemonName);
            });
            card.querySelector('.pokemon-image').addEventListener('click', () => {
                openDetailPokedex(pokemonName);
            })
        });
    }
}

// Fonctions pour gérer les actions
async function handleSeePokemon(pokemonId, trainerId) {
    const token = getAuthToken();
    if (!token) return;

    try {
        const response = await fetch(`http://localhost:3000/trainer/see`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                trainerId: trainerId,
                pokemonId: pokemonId
            })
        });
        if (response.ok) {
            // Rafraîchir l'affichage
            await displayCurrentPage();
        }
    } catch (error) {
        console.error('Error marking pokemon as seen:', error);
    }
}

async function handleCatchPokemon(pokemonId, trainerId) {
    const token = getAuthToken();
    if (!token) return;
    console.log(pokemonId, "pokemonID");
    console.log(trainerId, "TRAINER ID MOTHER FUCKER");

    try {
        // Première requête pour marquer comme vu
        await fetch(`http://localhost:3000/trainer/see`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                trainerId: trainerId,
                pokemonId: pokemonId
            })
        });

        const response = await fetch(`http://localhost:3000/trainer/mark`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                trainerId: trainerId,
                pokemonId: pokemonId
            })
        });

        if (response.ok) {
            // Rafraîchir l'affichage
            await displayCurrentPage();
        }
    } catch (error) {
        console.error('Error catching pokemon:', error);
    }
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
        let url = query || activeFilters.length > 0
            ? 'http://localhost:3000/api/pkmn/search?'
            : 'http://localhost:3000/api/pkmn/all';

        if (query || activeFilters.length > 0) {
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
            url += params.toString();
        }

        const response = await fetch(url, {
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
        if (query || activeFilters.length > 0) {
            currentPage = 1;
        }

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

document.getElementById('prev-btn').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        displayCurrentPage();
        updatePaginationControls();
    }
});

document.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();

        if (event.key === 'ArrowLeft') {
            if (currentPage > 1) {
                currentPage--;
                displayCurrentPage();
                updatePaginationControls();
            }
        } else {
            const totalPages = Math.ceil(allPokemon.length / ITEMS_PER_PAGE);
            if (currentPage < totalPages) {
                currentPage++;
                displayCurrentPage();
                updatePaginationControls();
            }
        }
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

const detailPokedex = document.getElementById('detail-pokedex');
const overlay = document.getElementById('overlay');
const closePokedexBtn = document.getElementById('close-pokedex');

const STAT_COLORS = {
    'name': '#FF0000',
    'types': '#F08030',
    'description': '#F8D030',
    'region': '#6890F0',
    'weight': '#78C850',
    'height': '#F85888'
};

function openDetailPokedex(pokemonName) {
    fetchPokemonDetail(pokemonName);
    overlay.style.display = 'block';
    setTimeout(() => {
        detailPokedex.classList.add('open');
    }, 10);
    document.body.style.overflow = 'hidden';
}

function closeDetailPokedex() {
    detailPokedex.classList.remove('open');
    setTimeout(() => {
        overlay.style.display = 'none';
    }, 500);
    document.body.style.overflow = '';
}

async function fetchPokemonDetail(pokemonName) {
    try {
        const token = getAuthToken();
        const response = await fetch(`http://localhost:3000/api/pkmn?name=${pokemonName.toLowerCase()}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(response.status === 401
                ? ERROR_MESSAGES.SESSION_EXPIRED
                : 'Erreur lors de la récupération des détails');
        }

        const data = await response.json();
        displayPokemonDetail(data);
    } catch (error) {
        console.error('Erreur:', error);
        document.getElementById('pokemon-detail').innerHTML = `<p class="error-message">${error.message}</p>`;
    }
}

function displayPokemonDetail(pokemonData) {
    const pokemon = pokemonData.data;
    if (!pokemon) {
        document.getElementById('pokemon-detail').innerHTML =
            '<p class="error-message">Aucune donnée disponible pour ce Pokémon</p>';
        return;
    }

    document.getElementById('pokemon-detail').innerHTML = `
        <div class="pokemon-detail-header">
            <img id="detail-image" src="${pokemon.imagePath || ''}" alt="${pokemon.name}">
            <div class="pokemon-detail-info">
                <h2 id="detail-name">${pokemon.name}</h2>
                <div id="detail-types" class="pokemon-types">
                    ${pokemon.types.map(type =>
        `<span class="type-badge" style="background-color: ${getTypeColor(type)}">${type}</span>`
    ).join('')}
                </div>
            </div>
        </div>

        <div class="pokemon-detail-description">
            <h3>Description</h3>
            <p>${pokemon.description || 'Aucune description disponible'}</p>
        </div>

        <div class="pokemon-detail-region">
            <h3>Région</h3>
            <div class="region-badges">
                ${pokemon.region && pokemon.region.length > 0
            ? pokemon.region.map(reg => `<span class="region-badge">${reg.regionName}</span>`).join('')
            : '<span>Aucune région spécifiée</span>'}
            </div>
        </div>

        <div class="pokemon-detail-dimensions">
            <div class="dimension">
                <span>Taille</span>
                <span>${pokemon.height ? `${pokemon.height / 10} m` : 'N/A'}</span>
            </div>
            <div class="dimension">
                <span>Poids</span>
                <span>${pokemon.weight ? `${pokemon.weight / 10} kg` : 'N/A'}</span>
            </div>
        </div>

        ${pokemon.soundPath ? `
        <div class="pokemon-detail-sound">
            <button id="play-sound" class="sound-button">
                <span class="sound-icon">🔊</span> Écouter le cri
            </button>
            <audio id="pokemon-cry" src="${pokemon.soundPath}"></audio>
        </div>
        ` : ''}
    `;

    const playButton = document.getElementById('play-sound');
    if (playButton) {
        playButton.addEventListener('click', () => {
            const audio = document.getElementById('pokemon-cry');
            audio.play();
        });
    }
}

closePokedexBtn.addEventListener('click', closeDetailPokedex);
overlay.addEventListener('click', closeDetailPokedex);

fetchPokemon();