const baseUrl = 'http://localhost:3000';

const loginForm = document.querySelector('.login');
const registerForm = document.querySelector('.register');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    let email = document.querySelector('.login-email').value;
    let password = document.querySelector('.login-password').value;

    let response = await fetch(`${baseUrl}/users/login`, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });

    let data = await response.json();
    if (data.error) {
        alert(data.error);
    } else {
        localStorage.setItem('token', data.token);
        console.log(data.token);
        // window.location.href = '/pokedex/front/pokedex.html';
    }
});