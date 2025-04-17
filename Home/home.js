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
async function getSingleUserData() {
    try {
        const loginUserData = await fetch(`https://blogbackend-6a9f.up.railway.app/users/${loginPerson}`);
        // const loginUserData = await fetch(`http://localhost:8000/users/${loginPerson}`);
        const loginUserDataJson = await loginUserData.json();
        const { imgUrl, name, email, description } = loginUserDataJson.data;
        profilePic.src = imgUrl;
        userName.innerText = name;
        userEmail.innerText = email;
        userDescription.innerText = description;
        document.getElementById('menuBtn').src = imgUrl;

        const loginUserPostCount = await fetch(`https://blogbackend-6a9f.up.railway.app/posts/singlePostCount/${loginPerson}`);
        // const loginUserPostCount = await fetch(`http://localhost:8000/posts/singlePostCount/${loginPerson}`);
        const loginUserPostCountJson = await loginUserPostCount.json();
        document.getElementById('blogsCount').innerText = loginUserPostCountJson.postCount;
    }
    catch (e) {
        console.log(e)
    }
}
getSingleUserData();


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
        const response = await fetch('https://blogbackend-6a9f.up.railway.app/posts', {
            // const response = await fetch('http://localhost:8000/posts', {
            method: 'POST',
            headers: {
                Accept: 'application.json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                postText: postContent.value,
                postImgUrl: blogImgURL.secure_url,
                posterEmail: loginPerson
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


// GET ALL POST
// let postData = [];
// async function getAllPost() {
//     const dataPost = await fetch(`https://blogbackend-6a9f.up.railway.app/posts/allPost`);
// const dataPost = await fetch(`http://localhost:8000/posts/allPost`);
// const dataPostJson = await dataPost.json();
// const postMainData = dataPostJson?.data;
// if (postMainData.length == 0) {
//     document.getElementById('allPosts').innerHTML = "<h1 class='noPostHeading'>No Post avaliable</h1>";
//     return;
// }

// for (const elem of postMainData) {
//     const userData = await fetch(`https://blogbackend-6a9f.up.railway.app/users/${elem.email}`);
// const userData = await fetch(`http://localhost:8000/users/${elem.email}`);
//         const userDataJson = await userData.json();
//         if (elem.postUrl) {
//             let formattedText = elem.text.replace(/\n/g, "<br>");
//             postData.push(`
//                 <div class="content_posts">
//                     <div class="profile">
//                         <div class="profile_img">
//                             <img src="${userDataJson?.data?.imgUrl || 'https://static.vecteezy.com/system/resources/thumbnails/003/337/584/small/default-avatar-photo-placeholder-profile-icon-vector.jpg'}" alt="Image">
//                         </div>
//                         <div class="profile_content">
//                             <h1>${userDataJson?.data?.name}</h1>
//                             <h4>${elem?.email}</h4>
//                         </div>
//                     </div>
//                     <hr>
//                     <div class="post_content">
//                         <p>${formattedText}</p>
//                         <img src="${elem?.postUrl}" alt="Image">
//                     </div>
//                 </div>`);
//         } else {
//             postData.push(`
//                 <div class="content_posts">
//                     <div class="profile">
//                         <div class="profile_img">
//                             <img src="${userDataJson?.data?.imgUrl || 'https://static.vecteezy.com/system/resources/thumbnails/003/337/584/small/default-avatar-photo-placeholder-profile-icon-vector.jpg'}" alt="Image">
//                         </div>
//                         <div class="profile_content">
//                             <h1>${userDataJson?.data?.name}</h1>
//                             <h4>${elem?.email}</h4>
//                         </div>
//                     </div>
//                     <hr>
//                     <div class="post_content">
//                         <p>${elem?.text}</p>
//                     </div>
//                 </div>`);
//         }
//     }
//     document.getElementById('allPosts').innerHTML = postData.join("");
// }
// getAllPost();





let postData = [];
async function getAllPost() {
    const dataPost = await fetch(`https://blogbackend-6a9f.up.railway.app/posts/allPost`);
    const dataPostJson = await dataPost.json();
    const postMainData = dataPostJson?.data;

    if (postMainData.length == 0) {
        document.getElementById('allPosts').innerHTML = "<h1 class='noPostHeading'>No Post available</h1>";
        return;
    }

    for (const elem of postMainData) {
        const userData = await fetch(`https://blogbackend-6a9f.up.railway.app/users/${elem.email}`);
        const userDataJson = await userData.json();

        let text = elem.text;
        let shortText = text.length > 100 ? text.slice(0, 100) + "..." : text;
        let formattedFullText = text.replace(/\n/g, "<br>");
        let formattedShortText = shortText.replace(/\n/g, "<br>");

        const postHTML = `
            <div class="content_posts">
                <div class="profile">
                    <div class="profile_img">
                        <img src="${userDataJson?.data?.imgUrl || 'https://static.vecteezy.com/system/resources/thumbnails/003/337/584/small/default-avatar-photo-placeholder-profile-icon-vector.jpg'}" alt="Image">
                    </div>
                    <div class="profile_content">
                        <h1>${userDataJson?.data?.name}</h1>
                        <h4>${elem?.email}</h4>
                    </div>
                </div>
                <hr>
                <div class="post_content">
                    <p class="shortText">${formattedShortText}</p>
                    <p class="fullText" style="display: none;">${formattedFullText}</p>
                    ${elem.postUrl ? `<img src="${elem.postUrl}" alt="Image">` : ""}
                    ${text.length > 100 ? `<button class="toggleTextBtn">Read more</button>` : ""}
                </div>
            </div>
        `;

        postData.push(postHTML);
    }

    document.getElementById('allPosts').innerHTML = postData.join("");

    // Add event listeners to all "Read more" buttons
    document.querySelectorAll('.toggleTextBtn').forEach(button => {
        button.addEventListener('click', function () {
            const postContent = this.parentElement;
            const shortText = postContent.querySelector('.shortText');
            const fullText = postContent.querySelector('.fullText');
            const isExpanded = fullText.style.display === 'block';

            if (isExpanded) {
                fullText.style.display = 'none';
                shortText.style.display = 'block';
                this.innerText = 'Read more';
            } else {
                fullText.style.display = 'block';
                shortText.style.display = 'none';
                this.innerText = 'Read less';
            }
        });
    });
}
getAllPost();











// OPEN POST MODAL
document.getElementById('open_Modal').addEventListener("click", () => {
    document.body.style.backgroundColor = "#ebebeb";
    // document.body.style.overflow = "hidden"
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
            document.getElementById('ImgName').innerText = media_file.files[0].name;
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
    document.getElementById('edit_profile_whole').style.display = "block"
    try {
        // CALL FOR LOGIN USER DATA
        const userData = await fetch(`https://blogbackend-6a9f.up.railway.app/users/${loginPerson}`);
        // const userData = await fetch(`http://localhost:8000/users/${loginPerson}`);
        const userDataJson = await userData.json();
        const { description, imgUrl, name } = userDataJson.data;
        editName.value = name;
        // editImg.value = imgUrl;
        editDes.value = description;
        previwProfilePic.src = imgUrl;
        profilePicURLUpdated = imgUrl;
    }
    catch (error) {
        console.log(error)
    }
})

// UPDATE PROFILE INFO
document.getElementById('submitEditBtn').addEventListener("click", async () => {
    if (!editName) {
        return alert("Name is mandatory");
    }
    try {
        // document.getElementById('editImg').addEventListener('change', async (e) => {
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
        // })
        const response = await fetch(`https://blogbackend-6a9f.up.railway.app/users/${loginPerson}`, {
            // const response = await fetch(`http://localhost:8000/users/${loginPerson}`, {
            method: 'PUT',
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
    document.getElementById('edit_profile_whole').style.display = "none";
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

// OPEN PROFILE MODAL
document.getElementById('menuBtn').addEventListener("click", () => {
    document.getElementById('side-panel').style.transition = 'all 10s forwards';
    document.getElementById('side-panel').style.left = "0";
    document.getElementById('preview_Post').style.display = "none";
    document.getElementById('postModel').style.display = "none";
})

// CLOSE PROFILE MODAL
document.getElementById('closeMenuBtn').addEventListener("click", () => {
    document.getElementById('side-panel').style.left = "-15rem";
    document.getElementById('side-panel').style.transition = 'all 10s forwards';
})