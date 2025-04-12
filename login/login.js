let loginEmail = document.getElementById('loginEmail');
let loginPassword = document.getElementById('loginPassword');
let loginBtn = document.getElementById('loginBtn');

// LOGIN HANDLER
loginBtn.addEventListener("click", loginHandler);
async function loginHandler(e) {
    e.preventDefault();
    if (!loginEmail.value || !loginPassword.value) {
        if (!loginEmail.value) {
            loginEmail.style.border = "2px solid red";
        }
        if (!loginPassword.value) {
            loginPassword.style.border = "2px solid red";
        }
        return alert("All feilds are mandatory to fill");
    }
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

// LOGIN SHOW PASSWORD
document.getElementById('showPassword').addEventListener('click', () => {
    loginPassword.type = "password";
    loginPassword.focus();
    loginPassword.style.outline="none";
    document.getElementById('hidePassword').style.display = "block";
    document.getElementById('showPassword').style.display = "none";
});

// LOGIN HIDE PASSWORD
document.getElementById('hidePassword').addEventListener('click', () => {
    loginPassword.type = "text";
    loginPassword.focus();
    loginPassword.style.outline="none";
    document.getElementById('showPassword').style.display = "block";
    document.getElementById('hidePassword').style.display = "none";
});

// REMOVE RED BORDER
loginEmail.addEventListener("change", () => {
    if (loginEmail.value) {
        loginEmail.style.border = "1px solid #ccc";
    }
})

loginPassword.addEventListener("change", () => {
    if (loginPassword.value) {
        loginPassword.style.border = "1px solid #ccc";
    }
})