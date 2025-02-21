const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');
const toggleForm = document.getElementById('toggleForm');
let isLoginForm = false;

if (localStorage.getItem('token')) {
    window.location.href = "../index.html";
}

toggleForm.addEventListener('click', () => {
    isLoginForm = !isLoginForm;
    registerForm.classList.toggle('hidden');
    loginForm.classList.toggle('hidden');
    toggleForm.textContent = isLoginForm ?
        "Not registered yet? Register!" :
        "Already registered? Sign In!";
});


const registerFirstname = document.querySelector('#firstname');
const registerLastname = document.querySelector('#lastname');
const registerUsername = document.querySelector('#username');
const registerEmail = document.querySelector('#email');
const registerPassword = document.querySelector('#password');
const loginEmail = document.querySelector('#loginEmail');
const loginPassword = document.querySelector('#loginPassword');

async function register(firstname, lastname, username, email, password) {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    const urlencoded = new URLSearchParams();
    urlencoded.append("firstname", firstname);
    urlencoded.append("lastname", lastname);
    urlencoded.append("username", username);
    urlencoded.append("email", email);
    urlencoded.append("password", password);

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: urlencoded,
        redirect: "follow"
    };
    console.log(requestOptions);

    fetch("http://localhost:3000/users/register", requestOptions)
        .then((response) => response.json())
        .then(async (result) => {
            if (result.error) {
                document.querySelectorAll(".error-container").forEach(e => {
                    e.textContent = result.error;
                });
            } else {
                login(email, password);
            }
        })
        .catch((error) => console.error(error));
}

async function checkIfUserHasTrainer(username) {
    const token = localStorage.getItem('token');
    console.log(token, username);
    fetch(`http://localhost:3000/trainer/search?username=${username}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    }).then((response) => response.json())
        .then((result) => {
            if (!result.data) {
                window.location.href = "../page/sign-trainer.html"; 
            } else {
                localStorage.setItem('trainer', result.data);
                window.location.href = "../index.html";
            }
        })
        .catch((error) => console.log(error))
}


async function login(email, password) {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    const urlencoded = new URLSearchParams();
    urlencoded.append("email", email);
    urlencoded.append("password", password);
    console.log("fonction login");
    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: urlencoded,
        redirect: "follow"
    };

    fetch("http://localhost:3000/users/login", requestOptions)
        .then((response) => response.text())
        .then((result) => {
            result = JSON.parse(result);
            if (result.error) {
                document.querySelectorAll(".error-container").forEach(e => {
                    e.textContent = result.error;
                });
            } else {
                console.log(result);
                token = result.token;
                localStorage.setItem("token", token);
                localStorage.setItem("userInfo", JSON.stringify({
                    email: email,
                    username: result.username
                }));
                checkIfUserHasTrainer(result.username);
            }
        })
        .catch((error) => console.error(error));
}

registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const firstname = registerFirstname.value;
    const lastname = registerLastname.value;
    const username = registerUsername.value;
    const email = registerEmail.value;
    const password = registerPassword.value;
    console.log(firstname, lastname, username, email, password);

    register(firstname, lastname, username, email, password);

    console.log('Inscription soumise');
});

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = loginEmail.value;
    const password = loginPassword.value;
    login(email, password);
    console.log('Connexion soumise');
});