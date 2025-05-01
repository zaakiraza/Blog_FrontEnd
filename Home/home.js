// CHECK FOR LOGIN PEERSON EMAIL
let loginPerson = localStorage.getItem('token');
let loginPersonEmail;
async function checkLoginedUser() {
    if (!loginPerson) {
        alert("Please login first");
        window.location.href = '../login/login.html';
    }
    else {
        const verifyToken = await fetch(`http://localhost:8000/auth/JWTVerify/${loginPerson}`);
        const verifyTokenJson = await verifyToken.json();
        if (!verifyTokenJson.status) {
            window.location.href = '../login/login.html';
        }
        loginPersonEmail = verifyTokenJson?.data?.email;
    }
}


let U_name, U_email, U_desc, U_pic;
// GET DATA OF LOGIN PERSON
async function UserLoginData() {
    const loginUserData = await fetch(`http://localhost:8000/users/byEmail/${loginPersonEmail}`);
    const loginUserDataJson = await loginUserData.json();
    const { imgUrl, name, email, description } = loginUserDataJson.data;
    U_name = name;
    U_email = email;
    U_desc = description;
    U_pic = imgUrl || "https://static.vecteezy.com/system/resources/thumbnails/003/337/584/small/default-avatar-photo-placeholder-profile-icon-vector.jpg";
    let profilePic = document.getElementById('profilePic');
    let userName = document.getElementById('userName');
    let userEmail = document.getElementById('userEmail');
    let userDescription = document.getElementById('userDescription');
    profilePic.src = U_pic;
    userName.innerText = U_name;
    userEmail.innerText = U_email;
    userDescription.innerText = U_desc || "No description added";
    document.getElementById('menuBtn').src = U_pic;
}

async function init() {
    await checkLoginedUser(); // wait for email to be set
    if (loginPersonEmail) {
        await UserLoginData();
        await loginUserPostCount();
    }
}
init();

// LOGOUT BUTTON
document.getElementById('LogoutBtn').addEventListener("click", () => {
    localStorage.clear("loginEmail");
    window.location.href = '../login/login.html';
})


async function loginUserPostCount() {
    try {
        const loginUserPostCount = await fetch(`http://localhost:8000/posts/singlePostCount/${loginPersonEmail}`);
        const loginUserPostCountJson = await loginUserPostCount.json();
        document.getElementById('blogsCount').innerText = loginUserPostCountJson.postCount;
    }
    catch (e) {
        console.log(e)
    }
}

// POST HANDLER
let blogImgURL;
document.getElementById('postBtn').addEventListener("click", postSomething)
async function postSomething() {
    let postContent = document.getElementById('postContent');
    let media_file = document.getElementById('media_file');
    if (!postContent.value) {
        postContent.style.border = '2px solid red';
        return alert("Must write something to post");
    }
    try {
        if (!media_file.value) {
            blogImgURL = "";
        }
        else if (media_file.value) {
            document.getElementById('loader').style.display = "flex";
            let fileInput = media_file.files[0];
            const fileType = fileInput.name.split('.')[1];
            const formData = new FormData();
            formData.append('file', fileInput);
            formData.append('upload_preset', "fireBase1");
            if (fileType == "jpg" || fileType == "png" || fileType == "gif" || fileType == "jpeg") {
                formData.append("folder", "Blogs/Pics");
                const blogPostUrl = await fetch('https://api.cloudinary.com/v1_1/dvo8ftbqu/image/upload', {
                    method: 'POST',
                    body: formData
                });
                blogImgURL = await blogPostUrl.json();
            }
            else if (fileType == "mp4") {
                formData.append("folder", "Blogs/videos");
                const blogPostUrl = await fetch('https://api.cloudinary.com/v1_1/dvo8ftbqu/video/upload', {
                    method: 'POST',
                    body: formData
                });
                blogImgURL = await blogPostUrl.json();
            }
            else if (fileType == "pdf") {
                formData.append("folder", "Blogs/Pdfs");
                const blogPostUrl = await fetch('https://api.cloudinary.com/v1_1/dvo8ftbqu/image/upload', {
                    method: 'POST',
                    body: formData
                });
                blogImgURL = await blogPostUrl.json();
            }
            else {
                alert("Invalid Format type");
            }
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8000/posts/${token}`, {
                method: 'POST',
                headers: {
                    Accept: 'application.json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    postText: postContent.value,
                    postImgUrl: blogImgURL.secure_url,
                    posterEmail: loginPersonEmail
                })
            })
            const feed = await response.json();
            if (feed.status) {
                window.location.reload();
            }
            else {
                document.getElementById('loader').style.display = "none";
                alert(feed?.message)
            }
        }
    }
    catch (e) {
        document.getElementById('loader').style.display = "none";
        alert(e);
    }
}

document.getElementById('postContent').addEventListener('change', () => {
    document.getElementById('postContent').style.border = '1px solid black';
})

// GET ALL POST
let postData = [];

async function getAllPost() {
    document.getElementById('allPosts').innerHTML = `<i class="fa-solid fa-circle-notch"></i>`
    const dataPost = await fetch(`http://localhost:8000/posts/allPost`);
    const dataPostJson = await dataPost.json();
    const postMainData = dataPostJson?.data;

    if (postMainData.length === 0) {
        document.getElementById('allPosts').innerHTML = "<h1 class='noPostHeading'>No Post available</h1>";
        return;
    }

    for (const elem of postMainData) {
        const userData = await fetch(`http://localhost:8000/users/byEmail/${elem.email}`);
        const userDataJson = await userData.json();

        let fullText = elem.text;
        let shortText = fullText.length > 100 ? fullText.slice(0, 100) : fullText;

        let formattedFullText = fullText.replace(/\n/g, "<br>");
        let formattedShortText = shortText.replace(/\n/g, "<br>");

        if (fullText.length > 100) {
            formattedShortText += `... <a href="javascript:void(0)" class="toggleTextLink">Read more</a>`;
        }

        function timeFromNow(dateString) {
            const apiDate = new Date(dateString);
            const now = new Date();
            const diffInMs = now - apiDate;

            const diffInMinutes = diffInMs / (1000 * 60);
            const diffInHours = diffInMinutes / 60;
            const diffInDays = diffInHours / 24;

            if (diffInMinutes < 60) {
                return `${Math.floor(diffInMinutes)} minutes ago`;
            } else if (diffInHours < 24) {
                return `${Math.floor(diffInHours)} hours ago`;
            } else {
                return `${Math.floor(diffInDays)} days ago`;
            }
        }

        const postHTML = `
            <div class="content_posts">
                <div class="profile">
                    <div class="profile_img">
                        <img src="${userDataJson?.data?.imgUrl || 'https://static.vecteezy.com/system/resources/thumbnails/003/337/584/small/default-avatar-photo-placeholder-profile-icon-vector.jpg'}" alt="Image">
                    </div>
                    <div class="profile_content">
                        <h1>${userDataJson?.data?.name}</h1>
                        <h4>${userDataJson?.data?.email}</h4>
                        <h4>${timeFromNow(elem?.createdAt)}</h4>
                    </div>
                </div>
                <hr>
                <div class="post_content">
                    <p class="shortText">${formattedShortText}</p>
                    <p class="fullText" style="display: none;">${formattedFullText} <a href="javascript:void(0)" class="toggleTextLink">Read less</a></p>

                    ${elem.postUrl ?
                elem.postUrl.endsWith(".jpg") || elem.postUrl.endsWith(".jpeg") || elem.postUrl.endsWith(".png") || elem.postUrl.endsWith(".gif") ?
                    `<img src="${elem.postUrl}" alt="Image">` :
                    elem.postUrl.endsWith(".mp4") ?
                        `<video controls src="${elem.postUrl}"></video>` :
                        elem.postUrl.endsWith(".pdf") ?
                            `<iframe src="${elem.postUrl}"></iframe>` :
                            "" : ""}
                </div >
        <div class="social-post-card">
            <div class="reaction-counts">
                <div>👍 120 Likes</div>
                <div>💬 45 Comments</div>
            </div>

            <div class="post-actions">
                <div class="action-btn">
                    <i class="fa-regular fa-thumbs-up"></i>
                    <span>Like</span>
                </div>

                <div class="action-btn">
                    <i class="fa-solid fa-comment"></i>
                    <span>Comment</span>
                </div>

                <div class="action-btn">
                    <i class="fa-solid fa-share-nodes"></i>
                    <span>Share</span>
                </div>
            </div>
        </div>
            </div > `;

        postData.push(postHTML);

        // ${elem.postUrl ? `<img src="${elem.postUrl}" alt="Image">` : ""}
    }

    document.getElementById('allPosts').innerHTML = postData.join("");

    // Toggle read more / less
    document.querySelectorAll('.toggleTextLink').forEach(link => {
        link.addEventListener('click', function () {
            const postContent = this.closest('.post_content');
            const shortText = postContent.querySelector('.shortText');
            const fullText = postContent.querySelector('.fullText');

            const isExpanded = fullText.style.display === 'block';

            if (isExpanded) {
                fullText.style.display = 'none';
                shortText.style.display = 'block';
            } else {
                fullText.style.display = 'block';
                shortText.style.display = 'none';
            }
        });
    });
}
getAllPost();



// OPEN POST MODAL
document.getElementById('open_Modal').addEventListener("click", () => {
    document.body.style.backgroundColor = "#ebebeb";
    document.body.style.overflow = "hidden"
    document.getElementById('postModel').style.display = "flex";
})

// CLOSE POST MODAL
document.getElementById('crossBtn').addEventListener("click", () => {
    document.getElementById('postModel').style.display = "none";
    document.body.style.backgroundColor = "white";
    document.body.style.overflow = ""
})

// SET IMAGE PREVIEW VALUE
let preview_file;
document.getElementById('media_file').addEventListener('change', (e) => {
    preview_file = e.target.files[0];
    if (preview_file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            if (media_file.files[0].name.endsWith(".jpg") || media_file.files[0].name.endsWith(".jpeg") || media_file.files[0].name.endsWith(".png") || media_file.files[0].name.endsWith(".gif")) {
                document.getElementById('post_content').innerHTML+=`<img id="previewImage" src="${e.target.result}">`
            }
            else if (media_file.files[0].name.endsWith(".mp4")) {
                document.getElementById('post_content').innerHTML += `<video src="${e.target.result}" id="previewImage" controls></video>`
            }
            else if (media_file.files[0].name.endsWith(".pdf")) {
                document.getElementById('post_content').innerHTML += `<iframe src="${e.target.result}" id="previewImage"></iframe>`
            }
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
    document.getElementById('preview_Post').style.display = "flex"
    document.body.style.overflow = "hidden";
})

// CLOSE POST PREVIEW MODAL
document.getElementById('backPreview').addEventListener("click", () => {
    document.getElementById('postModel').style.display = "flex";
    document.getElementById('preview_Post').style.display = "none"
})


// OPEN PROFILE MODAL
let editName = document.getElementById('editName');
let editImg = document.getElementById('editImg');
let editDes = document.getElementById('editDes');
let previwProfilePic = document.getElementById('previwProfilePic');
let profilePicURLUpdated;
document.getElementById('editProfileBtn').addEventListener("click", async () => {
    document.getElementById('edit_profile_whole').style.display = "flex"
    document.body.style.overflow = "hidden"
    try {
        // CALL FOR LOGIN USER DATA
        const userData = await fetch(`http://localhost:8000/users/byEmail/${loginPersonEmail}`);
        const userDataJson = await userData.json();
        const { description, imgUrl, name } = userDataJson.data;
        editName.value = U_name;
        editDes.value = U_desc;
        previwProfilePic.src = U_pic;
        profilePicURLUpdated = U_pic;
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
        document.getElementById('loader').style.display = "flex";
        if (editImg.files) {
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
        const response = await fetch(`http://localhost:8000/users/${loginPersonEmail}`, {
            method: 'PUT',
            headers: {
                Accept: 'application.json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                updatedName: editName.value,
                updatedDes: editDes.value || "",
                updatedImgURL: profilePicURLUpdated.secure_url || "https://static.vecteezy.com/system/resources/thumbnails/003/337/584/small/default-avatar-photo-placeholder-profile-icon-vector.jpg"
            })
        })
        const feed = await response.json();
        if (!feed.status) {
            document.getElementById('loader').style.display = "none";
            window.location.reload();
        }
        else {
            //     alert(feed.message)
            //     window.location.reload();
        }
    }
    catch (e) {
        console.log(e.message);
    }
})

// CLOSE PROFILE MODAL
document.getElementById('cancelEditBtn').addEventListener("click", () => {
    document.getElementById('edit_profile_whole').style.display = "none";
    document.body.style.overflow = "";
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
    document.getElementById('side-panel').style.left = "-18rem";
    document.getElementById('side-panel').style.transition = 'all 10s forwards';
})