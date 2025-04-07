let loginEmail = document.getElementById('loginEmail');
let loginPassword = document.getElementById('loginPassword');
let loginBtn = document.getElementById('loginBtn');

loginBtn.addEventListener("click", loginHandler);

async function loginHandler(e) {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
        alert("All Feilds are mandatory to fill");
    }
    try {
        const response = await fetch('https://blogbackend-6a9f.up.railway.app/auth/login', {
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
        const feed=await response.json();
        if(!feed.status){
            alert(feed.message);
            window.location.reload();
        }
        else{
            alert(feed.message);
            localStorage.setItem('loginEmail',loginEmail.value);
            window.location.href='../home/home.html';
        }
    }
    catch (e) {
        alert(e);
    }
}