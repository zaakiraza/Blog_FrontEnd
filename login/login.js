let loginEmail = document.getElementById('loginEmail');
let loginPassword = document.getElementById('loginPassword');
let loginBtn = document.getElementById('loginBtn');

// LOGIN HANDLER
loginBtn.addEventListener("click", loginHandler);

function showError(input, errorId, message) {
    input.style.border = "2px solid red";
    document.getElementById(errorId).innerText = message;
}

async function loginHandler(e) {
    e.preventDefault();

    const email = loginEmail.value.trim();
    const password = loginPassword.value;
    let isValid = true;

    if (!email) {
        showError(loginEmail, 'errorEmail', 'Email is mandatory to fill');
        isValid = false;
    }
    else if (!email.includes('@')) {
        showError(loginEmail, 'errorEmail', 'Invalid Email');
        isValid = false;
    }

    if (!password) {
        showError(loginPassword, 'errorPassword', 'Password is mandatory to fill');
        isValid = false;
    }

    if (!isValid) return;

    else if (isValid) {
        try {
            const response = await fetch('https://blogbackend-6a9f.up.railway.app/auth/login', {
            // const response = await fetch('http://localhost:8000/auth/login', {
                method: 'POST',
                headers: {
                    Accept: 'application.json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    loginEmail: loginEmail.value,
                    loginPassword: loginPassword.value
                })
            })
            const feed = await response.json();
            if (!feed.status) {
                alert(feed.message);
                console.log("object")
                loginEmail.style.border = "2px solid red";
                loginPassword.style.border = "2px solid red";
            }
            else {
                localStorage.setItem('loginEmail', loginEmail.value);
                window.location.href = '../Home/home.html';
            }
        }
        catch (e) {
            alert(e);
        }
    }
}

// LOGIN SHOW PASSWORD
document.getElementById('showPassword').addEventListener('click', () => {
    loginPassword.type = "password";
    loginPassword.focus();
    loginPassword.style.outline = "none";
    document.getElementById('hidePassword').style.display = "block";
    document.getElementById('showPassword').style.display = "none";
});

// LOGIN HIDE PASSWORD
document.getElementById('hidePassword').addEventListener('click', () => {
    loginPassword.type = "text";
    loginPassword.focus();
    loginPassword.style.outline = "none";
    document.getElementById('showPassword').style.display = "block";
    document.getElementById('hidePassword').style.display = "none";
});

// REMOVE RED BORDER
loginEmail.addEventListener("change", () => {
    if (loginEmail.value) {
        loginEmail.style.border = "1px solid #ccc";
        document.getElementById('errorEmail').innerText = "";
    }
})

loginPassword.addEventListener("change", () => {
    if (loginPassword.value) {
        loginPassword.style.border = "1px solid #ccc";
        document.getElementById('errorPassword').innerText = "";
    }
})