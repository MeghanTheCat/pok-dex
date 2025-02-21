const trainerForm = document.getElementById('trainerForm');
const trainerName = document.querySelector('#trainerName');
const username = document.querySelector('#username');
const imagePath = document.querySelector('#imagePath');

async function createTrainer(trainerName, username, imagePath) {
    const token = localStorage.getItem('token');
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    myHeaders.append("Authorization", `Bearer ${token}`);

    const urlencoded = new URLSearchParams();
    urlencoded.append("trainerName", trainerName);
    urlencoded.append("username", username);
    urlencoded.append("imagePath", imagePath);

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: urlencoded,
        redirect: "follow"
    };

    fetch("http://localhost:3000/trainer", requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if (result.error) {
                document.querySelector(".error-container").textContent = result.error;
            } else {
                localStorage.setItem('trainer', result.data);
                window.location.href = "../index.html";
            }
        })
        .catch((error) => {
            console.error(error);
            document.querySelector(".error-container").textContent = "An error occurred while creating the trainer.";
        });
}

trainerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const trainerNameValue = trainerName.value;
    const user = JSON.parse(localStorage.getItem('userInfo'));
    console.log(user, "user");
    const usernameValue = user.username;
    const imagePathValue = imagePath.value;

    createTrainer(trainerNameValue, usernameValue, imagePathValue);
});