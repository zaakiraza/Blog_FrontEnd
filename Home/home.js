import { config } from "../config.js";
let loginPerson = localStorage.getItem('loginEmail');
function checkLoginedUser() {
    if (!loginPerson) {
        alert("Please login first");
        window.location.href = '../login/login.html';
    }
}
checkLoginedUser();

document.getElementById('LogoutBtn').addEventListener("click", () => {
    localStorage.clear("loginEmail");
    window.location.href = '../login/login.html';
})

let profilePic = document.getElementById('profilePic');
let userName = document.getElementById('userName');
let userEmail = document.getElementById('userEmail');
let userDescription = document.getElementById('userDescription');

async function getSingle() {
    try {
        const response = await fetch(`http://localhost:8000/users/${loginPerson}`);
        const userData = await response.json();
        const { imgUrl, name, email, description } = userData?.data
        profilePic.src = imgUrl;
        userName.innerText = name;
        userEmail.innerText = email;
        userDescription.innerText = description;
        const response2 = await fetch(`http://localhost:8000/posts`);
        const postData = await response2.json();
    }
    catch (e) {
        console.log(e)
    }
}
getSingle();

let postContent = document.getElementById('postContent');
let media_file = document.getElementById('media_file');
let blogImgURL;
document.getElementById('postBtn').addEventListener("click", postSomething)

async function postSomething() {
    if (!postContent.value) {
        return alert("Can't Post Empty");
    }
    try {
        const userLoginData = await fetch(`http://localhost:8000/users/${loginPerson}`);
        const userLoginDataJson = await userLoginData.json()
        if (!media_file.value) {
            blogImgURL = "";
        }
        else if (media_file.value) {
            let fileInput = media_file.files[0];
            const formData = new FormData();
            formData.append('file', fileInput);
            formData.append('upload_preset', config.UPLOAD_PRESET);
            formData.append("folder", "Blogs");
            const blogPostUrl = await fetch('https://api.cloudinary.com/v1_1/dvo8ftbqu/image/upload', {
                method: 'POST',
                body: formData
            });
            blogImgURL = await blogPostUrl.json();
        }
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

let blogsCount = document.getElementById('blogsCount');

async function getPostCount() {
    const response = await fetch(`http://localhost:8000/posts/postCount/${loginPerson}`);
    const count = await response.json();
    blogsCount.innerText = count.postCount;
}
getPostCount();


let postData = [];
async function getAllPost() {
    const dataPost = await fetch(`http://localhost:8000/posts`);
    const dataPostJson = await dataPost.json();
    const postMainData = dataPostJson?.data;
    postMainData.forEach(elem => {
        if (elem.postUrl) {
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

document.getElementById('open_Modal').addEventListener("click", () => {
    document.getElementById('postModel').style.display = "block";
})

document.getElementById('crossBtn').addEventListener("click", () => {
    document.getElementById('postModel').style.display = "none";
})