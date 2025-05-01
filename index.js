let signupName = document.getElementById('signupName');
let signupEmail = document.getElementById('signupEmail');
let signupPassword = document.getElementById('signupPassword');
let signupBtn = document.getElementById('signupBtn');
let signUpImg = document.getElementById('signUpImg');
let signUpDes = document.getElementById('signUpDes');
let imgURL = "";
let form = document.querySelector('form');

// SIGNUP HANDLER
signupBtn.addEventListener("click", signupHandler);

function showError(input, errorId, message) {
    input.style.border = "2px solid red";
    document.getElementById(errorId).innerText = message;
}

async function signupHandler(e) {
    e.preventDefault();

    const name = signupName.value.trim();
    const email = signupEmail.value.trim();
    const password = signupPassword.value;

    let isValid = true;

    if (!name) {
        showError(signupName, 'errorName', 'Name is mandatory');
        isValid = false;
    }

    if (!email) {
        showError(signupEmail, 'errorEmail', 'Email is mandatory');
        isValid = false;
    }
    else if (!email.includes('@')) {
        showError(signupEmail, 'errorEmail', 'Invalid Email');
        isValid = false;
    }

    if (!password) {
        showError(signupPassword, 'errorPassword', 'Password is mandatory');
        isValid = false;
    }
    else if (password.length < 8) {
        showError(signupPassword, 'errorPassword', 'Minimum length should be 8');
        isValid = false;
    }

    if (!isValid) return;

    else if (isValid) {
        document.getElementById('loader').style.display = "flex";
        try {
            const checkForEmailInDB = await fetch(`http://localhost:8000/auth/emailChecker/${signupEmail.value}`);
            const checkForEmailInDBJson = await checkForEmailInDB.json();
            if (!checkForEmailInDBJson.status) {
                return showError(signupEmail, 'errorEmail', 'Email Already Exist');
            }

            const checkForNameInDB = await fetch(`http://localhost:8000/users/byName/${signupName.value}`);
            const checkForNameInDBJson = await checkForNameInDB.json();
            console.log(checkForEmailInDBJson);
            if (!checkForNameInDBJson.status) {
                document.getElementById('loader').style.display = "none";
                return showError(signupName, 'errorName', 'Name has already been taken');
            }

            if (signUpImg.value) {
                let fileInput = signUpImg.files[0];
                const formData = new FormData();
                formData.append('file', fileInput);
                formData.append('upload_preset', "fireBase1");
                formData.append("folder", "ProfilePic");
                const UrlSecure = await fetch('https://api.cloudinary.com/v1_1/dvo8ftbqu/image/upload', {
                    method: 'POST',
                    body: formData
                });

                imgURL = await UrlSecure.json();
            }
            const response = await fetch('http://localhost:8000/auth/signup', {
                method: 'POST',
                headers: {
                    Accept: 'application.json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    signupName: signupName.value,
                    signupEmail: signupEmail.value.toLocaleLowerCase(),
                    signUpDes: signUpDes.value || "",
                    signupImgURL: imgURL.secure_url || "",
                    signupPassword: signupPassword.value
                })
            })
            const feed = await response.json();
            if (!feed.status) {
                return alert(feed.message);
            }
            else {
                setTimeout(() => {
                    document.getElementById('loader').style.display = "none";
                    window.location.href = './login/login.html';
                }, 1000);
            }
        }
        catch (e) {
            document.getElementById('loader').style.display = "none";
            alert(e);
        }
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

// SIGNUP FEILDS ONCHANGE TEXT COLOR CHANGE
signupName.addEventListener("change", () => {
    if (signupName.value) {
        signupName.style.border = "1px solid #ccc";
        document.getElementById('errorName').innerText = "";
    }
})

signupEmail.addEventListener("change", () => {
    if (signupEmail.value) {
        signupEmail.style.border = "1px solid #ccc";
        document.getElementById('errorEmail').innerText = "";
    }
})

signupPassword.addEventListener("change", () => {
    if (signupPassword.value) {
        signupPassword.style.border = "1px solid #ccc";
        document.getElementById('errorPassword').innerText = "";
    }
})

// SignUp Img
document.getElementById("signUpImg").addEventListener("click", function () {
    document.getElementById("signUpImg").click();
});

document.getElementById("signUpImg").addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
        document.getElementById("file-name").textContent = "Uploaded File: " + file.name;
    }
});