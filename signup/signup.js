import { config } from "../config.js";

let signupName = document.getElementById('signupName');
let signupEmail = document.getElementById('signupEmail');
let signupPassword = document.getElementById('signupPassword');
let signupBtn = document.getElementById('signupBtn');
let signUpImg = document.getElementById('signUpImg');
let signUpDes = document.getElementById('signUpDes');
let imgURL = "";

signupBtn.addEventListener("click", signupHandler)

async function signupHandler(e) {
    e.preventDefault()
    if (!signupName || !signupEmail || !signupPassword) {
        alert("All Feilds are mandatory to fill");
    }
    try {
        if (signUpImg) {
        let fileInput = signUpImg.files[0];
        console.log(fileInput);
        const formData = new FormData();
        formData.append('file', fileInput);
        formData.append('upload_preset', config.UPLOAD_PRESET);
        formData.append("folder", "ProfilePic");
        const response = await fetch('https://api.cloudinary.com/v1_1/dvo8ftbqu/image/upload', {
            method: 'POST',
            body: formData
        });

        imgURL = await response.json();
        console.log(imgURL);
        }
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
                window.location.href = '../home/home.html';
        }
    }
    catch (e) {
        console.log(e);
    }
}