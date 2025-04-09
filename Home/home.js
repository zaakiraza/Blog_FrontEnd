// CHECK FOR LOGIN PEERSON EMAIL
let loginPerson = localStorage.getItem('loginEmail');
function checkLoginedUser() {
    if (!loginPerson) {
        alert("Please login first");
        window.location.href = '../login/login.html';
    }
}
checkLoginedUser();


// LOGOUT BUTTON
document.getElementById('LogoutBtn').addEventListener("click", () => {
    localStorage.clear("loginEmail");
    window.location.href = '../login/login.html';
})


// GET DATA OF LOGIN PERSON
let profilePic = document.getElementById('profilePic');
let userName = document.getElementById('userName');
let userEmail = document.getElementById('userEmail');
let userDescription = document.getElementById('userDescription');
async function getSingle() {
    try {
        // const response = await fetch(`https://blogbackend-6a9f.up.railway.app/users/${loginPerson}`);
        const response = await fetch(`http://localhost:8000/users/${loginPerson}`);
        const userData = await response.json();
        const { imgUrl, name, email, description } = userData?.data
        profilePic.src = imgUrl;
        userName.innerText = name;
        userEmail.innerText = email;
        userDescription.innerText = description;
        // const response2 = await fetch(`https://blogbackend-6a9f.up.railway.app/posts`);
        // const response2 = await fetch(`http://localhost:8000/posts`);
        // const postData = await response2.json();
    }
    catch (e) {
        console.log(e)
    }
}
getSingle();


// POST HANDLER
let postContent = document.getElementById('postContent');
let media_file = document.getElementById('media_file');
let blogImgURL;
document.getElementById('postBtn').addEventListener("click", postSomething)
async function postSomething() {
    if (!postContent.value) {
        return alert("Can't Post Empty");
    }
    try {
        // const userLoginData = await fetch(`https://blogbackend-6a9f.up.railway.app/users/${loginPerson}`);
        const userLoginData = await fetch(`http://localhost:8000/users/${loginPerson}`);
        const userLoginDataJson = await userLoginData.json()
        if (!media_file.value) {
            blogImgURL = "";
        }
        else if (media_file.value) {
            let fileInput = media_file.files[0];
            const formData = new FormData();
            formData.append('file', fileInput);
            formData.append('upload_preset', "fireBase1");
            formData.append("folder", "Blogs");
            const blogPostUrl = await fetch('https://api.cloudinary.com/v1_1/dvo8ftbqu/image/upload', {
                method: 'POST',
                body: formData
            });
            blogImgURL = await blogPostUrl.json();
        }
        // const response = await fetch('https://blogbackend-6a9f.up.railway.app/posts', {
        const response = await fetch('http://localhost:8000/posts', {
            method: 'POST',
            headers: {
                Accept: 'application.json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                postText: postContent.value,
                postImgUrl: blogImgURL.secure_url,
                posterEmail: loginPerson,
                posterName: userLoginDataJson?.data?.name,
                posterImgUrl: userLoginDataJson?.data?.imgUrl
            })
        })
        const feed = await response.json();
        if (feed.status) {
            alert(feed.message);
            window.location.reload();
        }
    }
    catch (e) {
        alert(e);
    }
}


// GET POST COUNT OF LOGIN PERSON
let blogsCount = document.getElementById('blogsCount');
async function getPostCount() {
    // const response = await fetch(`https://blogbackend-6a9f.up.railway.app/posts/postCount/${loginPerson}`);
    const response = await fetch(`http://localhost:8000/posts/postCount/${loginPerson}`);
    const count = await response.json();
    blogsCount.innerText = count.postCount;
}
getPostCount();


// GET ALL POST
let postData = [];
async function getAllPost() {
    // const dataPost = await fetch(`https://blogbackend-6a9f.up.railway.app/posts`);
    const dataPost = await fetch(`http://localhost:8000/posts`);
    const dataPostJson = await dataPost.json();
    const postMainData = dataPostJson?.data;
    postMainData.forEach(elem => {
        if (elem.postUrl) {
            let formattedText = elem.text.replace(/\n/g, "<br>");
            postData.push(`
                <div class="content_posts">
                    <div class="profile">
                        <div class="profile_img">
                            <img src="${elem?.ImgUrl || 'https://static.vecteezy.com/system/resources/thumbnails/003/337/584/small/default-avatar-photo-placeholder-profile-icon-vector.jpg'}" alt="Image">
                        </div>
                        <div class="profile_content">
                            <h1>${elem?.name}</h1>
                            <h4>${elem?.email}</h4>
                        </div>
                    </div>
                    <hr>
                    <div class="post_content">
                        <p>${formattedText}</p>
                        <img src="${elem?.postUrl || 'https://static.vecteezy.com/system/resources/thumbnails/003/337/584/small/default-avatar-photo-placeholder-profile-icon-vector.jpg'}" alt="Image">
                    </div>
                </div>`)
        }
        else {
            postData.push(`
                <div class="content_posts">
                    <div class="profile">
                        <div class="profile_img">
                            <img src="${elem?.ImgUrl || 'https://static.vecteezy.com/system/resources/thumbnails/003/337/584/small/default-avatar-photo-placeholder-profile-icon-vector.jpg'}" alt="Image">
                        </div>
                        <div class="profile_content">
                            <h1>${elem?.name}</h1>
                            <h4>${elem?.email}</h4>
                        </div>
                    </div>
                    <hr>
                    <div class="post_content">
                        <p>${elem?.text}</p>
                    </div>
                </div>`)
        }
    });
    postData = postData.join("")
    document.getElementById('allPosts').innerHTML = postData;
}
getAllPost();


// OPEN POST MODAL
document.getElementById('open_Modal').addEventListener("click", () => {
    document.body.style.backgroundColor = "#ebebeb";
    document.body.style.overflow = "hidden"
    document.getElementById('postModel').style.display = "block";
})

// CLOSE POST MODAL
document.getElementById('crossBtn').addEventListener("click", () => {
    document.getElementById('postModel').style.display = "none";
    document.body.style.backgroundColor = "white";
})

// SET IMAGE PREVIEW VALUE
let preview_file;
document.getElementById('media_file').addEventListener('change', (e) => {
    preview_file = e.target.files[0];
    if (preview_file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('previewImage').style.display = "block";
            document.getElementById('previewImage').src = e.target.result;
        };
        reader.readAsDataURL(preview_file);
    }
    else {
        document.getElementById('previewImage').style.display = "none";
    }
})

// SET TEXT PREVIEW VALUE
document.getElementById('postContent').addEventListener('change', () => {
    let text = document.getElementById('postContent').value;
    document.getElementById('previewText').innerText = text;
})


// OPEN POST PREVIEW MODAL
document.getElementById('prevewBtn').addEventListener('click', (event) => {
    document.getElementById('postModel').style.display = "none";
    document.getElementById('preview_Post').style.display = "block"
})

// CLOSE POST PREVIEW MODAL
document.getElementById('backPreview').addEventListener("click", () => {
    document.getElementById('postModel').style.display = "block";
    document.getElementById('preview_Post').style.display = "none"
})


// OPEN PROFILE MODAL
let editName = document.getElementById('editName');
let editImg = document.getElementById('editImg');
let editDes = document.getElementById('editDes');
let previwProfilePic = document.getElementById('previwProfilePic');
let profilePicURLUpdated;
document.getElementById('editProfileBtn').addEventListener("click", async () => {
    document.getElementById('editProfile').style.display = "block"
    try {
        // CALL FOR LOGIN USER DATA
        // const userData = await fetch(`https://blogbackend-6a9f.up.railway.app/users/${loginPerson}`);
        const userData = await fetch(`http://localhost:8000/users/${loginPerson}`);
        const userDataJson = await userData.json();
        const { description, imgUrl, name } = userDataJson.data;
        editName.value = name;
        editImgvalue = imgUrl;
        editDes.value = description;
        previwProfilePic.src = imgUrl;
        profilePicURLUpdated = imgUrl;
    } catch (error) {
        console.log(error)
    }
})

// UPDATE PROFILE INFO
document.getElementById('submitEditBtn').addEventListener("click", async () => {
    if (!editName) {
        return alert("Name is mandatory");
    }
    try {
        document.getElementById('editImg').addEventListener('change', async (e) => {
            if (editImg.value) {
                let fileInput = editImg.files[0];
                const formData = new FormData();
                formData.append('file', fileInput);
                formData.append('upload_preset', "fireBase1");
                formData.append("folder", "ProfilePic");
                const response = await fetch('https://api.cloudinary.com/v1_1/dvo8ftbqu/image/upload', {
                    method: 'POST',
                    body: formData
                });

                profilePicURLUpdated = await response.json();
            }
        })
        // const response = await fetch(`https://blogbackend-6a9f.up.railway.app/users/${loginPerson}`, {
        const response = await fetch(`http://localhost:8000/users/${loginPerson}`, {
            method: 'PATCH',
            headers: {
                Accept: 'application.json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                updatedName: editName.value,
                updatedDes: editDes.value || "No description added",
                updatedImgURL: profilePicURLUpdated.secure_url || "https://static.vecteezy.com/system/resources/thumbnails/003/337/584/small/default-avatar-photo-placeholder-profile-icon-vector.jpg"
            })
        })
        const feed = await response.json();
        if (!feed.status) {
            alert(feed.message);
            window.location.reload();
        }
        else {
            alert(feed.message);
            window.location.reload();
        }
    }
    catch (e) {
        console.log(e.message);
    }
})

// CLOSE PROFILE MODAL
document.getElementById('cancelEditBtn').addEventListener("click", () => {
    document.getElementById('editProfile').style.display = "none";
})

// SET IMAGE PREVIEW VALUE
let preview_profile_file;
document.getElementById('editImg').addEventListener('change', (e) => {
    preview_profile_file = e.target.files[0];
    if (preview_profile_file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('previwProfilePic').src = e.target.result;
        };
        reader.readAsDataURL(preview_profile_file);
    }
    else {
        document.getElementById('previwProfilePic').style.display = "none";
    }
})