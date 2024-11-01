const validUsers = {
    anderson: "anderson",
    luis: "luis"
};

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (validUsers[username] && validUsers[username] === password) {
        window.location.href = "home.html"; 
        localStorage.setItem("userCurrent", username);
    } else {
        alert('Usuário ou senha incorretos.');
    }
});