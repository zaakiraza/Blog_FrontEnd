let signupName = document.getElementById('signupName');
let signupEmail = document.getElementById('signupEmail');
let signupPassword = document.getElementById('signupPassword');
let signupBtn = document.getElementById('signupBtn');
let signUpImg = document.getElementById('signUpImg');
let signUpDes = document.getElementById('signUpDes');
let imgURL = "";

// SIGNUP HANDLER
signupBtn.addEventListener("click", signupHandler);
async function signupHandler(e) {
    e.preventDefault()
    if (!signupName || !signupEmail || !signupPassword) {
        return alert("All Feilds are mandatory to fill");
    }
    try {
        if (signUpImg.value) {
            let fileInput = signUpImg.files[0];
            const formData = new FormData();
            formData.append('file', fileInput);
            formData.append('upload_preset', "fireBase1");
            formData.append("folder", "ProfilePic");
            const response = await fetch('https://api.cloudinary.com/v1_1/dvo8ftbqu/image/upload', {
                method: 'POST',
                body: formData
            });

            imgURL = await response.json();
        }
        // const response = await fetch('https://blogbackend-6a9f.up.railway.app/auth/signup', {
        const response = await fetch('http://localhost:8000/auth/signup', {
            method: 'POST',
            headers: {
                Accept: 'application.json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                signupName: signupName.value,
                signupEmail: signupEmail.value,
                signUpDes: signUpDes.value || "No description added",
                signupImgURL: imgURL.secure_url || "https://static.vecteezy.com/system/resources/thumbnails/003/337/584/small/default-avatar-photo-placeholder-profile-icon-vector.jpg",
                signupPassword: signupPassword.value
            })
        })
        const feed = await response.json();
        if (!feed.status) {
            alert(feed.message);
            window.location.reload();
        }
        else {
            alert(feed.message);
            localStorage.setItem('loginEmail', signupEmail.value);
            window.location.href = './Home/home.html';
        }
    }
    catch (e) {
        console.log(e);
    }
}

// SIGNUP SHOW PASSWORD
document.getElementById('showPassword').addEventListener('click', () => {
    signupPassword.type = "password";
    signupPassword.focus();
    document.getElementById('hidePassword').style.display = "block";
    document.getElementById('showPassword').style.display = "none";
});

// SIGNUP HIDE PASSWORD
document.getElementById('hidePassword').addEventListener('click', () => {
    signupPassword.type = "text";
    signupPassword.focus();
    document.getElementById('showPassword').style.display = "block";
    document.getElementById('hidePassword').style.display = "none";
});