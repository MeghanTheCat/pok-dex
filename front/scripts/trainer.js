const ERROR_MESSAGES = {
    AUTH_REQUIRED: 'Token d\'authentification non trouvé, veuillez vous connecter.',
    FETCH_ERROR: 'Erreur lors de la récupération des données du trainer.',
    UPDATE_ERROR: 'Erreur lors de la mise à jour des données du trainer.',
    INVALID_DATA: 'Données invalides reçues du serveur.'
};

let currentTrainerData = null;

function checkAuthStatus() {
    const token = localStorage.getItem('token');
    const userInfo = localStorage.getItem('userInfo');
    const userInfoSection = document.getElementById('user-info');
    const usernameDisplay = document.getElementById('username-display');

    if (token && userInfo) {
        const user = JSON.parse(userInfo);
        userInfoSection.classList.remove('hidden');
        usernameDisplay.textContent = user.username;
        return { token, userInfo: user };
    } else {
        window.location.href = '../page/sign-in.html';
        return null;
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('fr-FR', options);
}

async function fetchTrainerData() {
    const auth = checkAuthStatus();
    if (!auth) return;

    try {
        const response = await fetch(`http://localhost:3000/trainer/search?username=${auth.userInfo.username}`, {
            headers: {
                'Authorization': `Bearer ${auth.token}`
            }
        });

        if (!response.ok) {
            throw new Error(ERROR_MESSAGES.FETCH_ERROR);
        }

        const data = await response.json();
        currentTrainerData = data.data;
        updateTrainerDisplay(currentTrainerData);
    } catch (error) {
        console.error(error);
        showError(ERROR_MESSAGES.FETCH_ERROR);
    }
}

function updateTrainerDisplay(trainer) {
    document.getElementById('trainer-image').src = trainer.imagePath;
    document.getElementById('trainer-name').textContent = trainer.trainerName;
    document.getElementById('pkmn-seen').textContent = trainer.pkmnSeen.length;
    document.getElementById('pkmn-caught').textContent = trainer.pkmnCatch.length;
    document.getElementById('creation-date').textContent = formatDate(trainer.creationDate);
}

function openModal() {
    document.getElementById('edit-modal').classList.remove('hidden');
    document.getElementById('overlay').classList.remove('hidden');

    document.getElementById('edit-trainer-name').value = currentTrainerData.trainerName;
    document.getElementById('edit-image-path').value = currentTrainerData.imagePath;
}

function closeModal() {
    document.getElementById('edit-modal').classList.add('hidden');
    document.getElementById('overlay').classList.add('hidden');
}

async function updateTrainerData(formData) {
    const auth = checkAuthStatus();
    if (!auth) return;

    try {
        const response = await fetch('http://localhost:3000/trainer/update', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${auth.token}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams(formData)
        });

        if (!response.ok) {
            throw new Error(ERROR_MESSAGES.UPDATE_ERROR);
        }

        const result = await response.json();
        currentTrainerData = result.data;
        updateTrainerDisplay(currentTrainerData);
        closeModal();
    } catch (error) {
        console.error(error);
        showError(ERROR_MESSAGES.UPDATE_ERROR);
    }
}

function showError(message) {
    alert(message);
}

document.addEventListener('DOMContentLoaded', () => {
    fetchTrainerData();

    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        window.location.href = '../page/sign-in.html';
    });

    document.getElementById('edit-profile').addEventListener('click', openModal);
    document.getElementById('edit-image').addEventListener('click', openModal);

    document.getElementById('edit-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = {
            trainerName: document.getElementById('edit-trainer-name').value,
            username: document.getElementById('edit-username').value,
            imagePath: document.getElementById('edit-image-path').value
        };
        updateTrainerData(formData);
    });
});

document.getElementById('overlay').addEventListener('click', closeModal);