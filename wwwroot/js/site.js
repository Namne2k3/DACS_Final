﻿
function showMenu(e, msId) {
    var el = document.getElementById(`more_${msId}`);
    var btn = document.getElementById(`more-btn_${msId}`);
    var menu = document.getElementById(`more-menu_${msId}`);
    var visible = false;

    e.preventDefault();
    if (!visible) {
        visible = true;
        el.classList.add('show-more-menu');
        menu.setAttribute('aria-hidden', false);
        document.addEventListener('mousedown', function (event) {
            hideMenu(event, btn, el, menu, visible); // Truyền tham số vào hideMenu
        }, false);
    }
}

function hideMenu(e, btn, el, menu, visible) {
    if (btn.contains(e.target)) {
        return;
    }
    if (visible) {
        visible = false;
        el.classList.remove('show-more-menu');
        menu.setAttribute('aria-hidden', true);
        document.removeEventListener('mousedown', hideMenu);
    }
}

var arrayMember = [];
async function handleCreateGroup(event) {
    event.preventDefault()
    const form = event.target;
    const roomName = form.roomName.value;
    // const membersString = arrayMember.join(',');

    const bodyData = new FormData();
    bodyData.append('roomName', roomName);
    for (const memberId of arrayMember) {
        bodyData.append('members', memberId);
    }

    await fetch("/Chat/Create", {
        method: "POST",
        body: bodyData
    })
        .then(response => response.json())
        .then(data => {
            // console.log(data)
            if (data.message == 'failed') {
                showElement('warm_members_user_status')
            } else {
                window.location.href = "/Chat/Group"
            }
        })
    if (data.message) {
        showElement('warm_members_user_status')
    }

}
function createUserRow(item) {
    // Create <tr> element
    var row = document.createElement("tr");

    // Create <td> elements for each property of the user
    var userNameCell = document.createElement("td");
    userNameCell.textContent = item.userName;
    row.appendChild(userNameCell);

    var emailCell = document.createElement("td");
    emailCell.textContent = item.email;
    row.appendChild(emailCell);

    var phoneNumberCell = document.createElement("td");
    phoneNumberCell.textContent = item.phoneNumber;
    row.appendChild(phoneNumberCell);

    var dateCreatedCell = document.createElement("td");
    dateCreatedCell.textContent = item.dateCreated;
    row.appendChild(dateCreatedCell);

    // Create buttons for Edit, Details, and Delete actions
    var editButton = document.createElement("a");
    editButton.setAttribute("class", "btn btn-outline-light");
    editButton.setAttribute("href", "/Admin/Account/Edit/" + item.id);
    editButton.textContent = "Edit";

    var detailsButton = document.createElement("a");
    detailsButton.setAttribute("class", "btn btn-outline-light");
    detailsButton.setAttribute("href", "/Admin/Account/Details/" + item.id);
    detailsButton.textContent = "Details";

    var deleteButton = document.createElement("a");
    deleteButton.setAttribute("class", "btn btn-outline-light");
    deleteButton.setAttribute("href", "/Admin/Account/Delete/" + item.id);
    deleteButton.textContent = "Delete";

    var actionCell = document.createElement("td");
    actionCell.appendChild(editButton);
    actionCell.appendChild(detailsButton);
    actionCell.appendChild(deleteButton);
    row.appendChild(actionCell);

    // Return the created <tr> element
    return row;
}

var tbody = document.getElementById('tbody');
function handleSearch(event) {
    if (event.keyCode == 13) {
        let search = event.target.value
        fetch(`/Admin/Account/GetAllAccountAsync?search=${search}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (tbody) {
                    tbody.innerHTML = '';
                    tbody.innerHTML = data.accounts
                }

            })
            .catch(error => {
                console.log('There was a problem with the fetch operation:', error);
            });
    }
}
function handleToggleEmoji(event) {
    const emoji_container = document.getElementById('emoji_container')
    if (emoji_container) {
        if (emoji_container.classList.contains('hidden')) {
            emoji_container.classList.remove('hidden')
        } else {
            emoji_container.classList.add('hidden')
        }
    }
}

async function handleSearchMember(event) {
    if (event.keyCode == 13) {

        if (event.target.value) {
            await fetch(`/Friend/SearchMembers?query=${event.target.value}`)
                .then(response => {
                    return response.json()
                })
                .then(data => {
                    // ...
                    if (data.html) {
                        var container = document.getElementById('create_friend_card_container')
                        container.innerHTML = ''
                        container.innerHTML = data.html;

                    } else {
                        showElement('not_found_user_status')
                    }
                })
                .catch(err => console.log(err.toString()))
        } else {
            await fetch(`/Friend/SearchMembers`)
                .then(response => {
                    return response.json()
                })
                .then(data => {
                    // ...
                    if (data.html) {
                        var container = document.getElementById('create_friend_card_container')
                        container.innerHTML = ''
                        container.innerHTML = data.html;

                    } else {
                        showElement('not_found_user_status')
                    }
                })
                .catch(err => console.log(err.toString()))
        }
    }
}

function handleAddUserToGroup(userId, imageUrl, username, currentUser) {
    if (!arrayMember.includes(currentUser)) {
        arrayMember.push(currentUser)
    }
    console.log("Check arrayMember >>> ", arrayMember)
    if (!arrayMember.includes(userId)) {
        arrayMember.push(userId);
        var container = document.getElementById('create_chatroom_listfriend')
        var listItem = createListItem(userId, imageUrl, username);
        container.appendChild(listItem);
    }
    else {
        showElement('addded_user_status')
    }
    // ... 
}
function handleUnaddMember(userId) {
    const member_item_delete = document.getElementById(`member_item_${userId}`)
    member_item_delete.remove();
    arrayMember = arrayMember.filter(p => p != userId);
}
function createListItem(userId, imageUrl, username) {
    const listItem = document.createElement("li");
    listItem.classList.add("list-group-item", "d-flex", "justify-content-between", "align-content-center");
    listItem.id = `member_item_${userId}`
    const imageDiv = document.createElement("div");
    imageDiv.classList.add("d-flex", "flex-row");

    const image = document.createElement("img");
    image.src = imageUrl;
    image.width = 40;

    const contentDiv = document.createElement("div");
    contentDiv.classList.add("ml-2");

    const name = document.createElement("h6");
    name.textContent = username;
    name.classList.add("mb-0");

    const checkboxDiv = document.createElement("div");
    checkboxDiv.classList.add("check");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = "a";
    checkbox.checked = true;
    checkbox.value = userId
    checkbox.onchange = function () {
        handleUnaddMember(userId);
    }

    // Add elements to their parents
    imageDiv.appendChild(image);
    contentDiv.appendChild(name);
    imageDiv.appendChild(contentDiv);
    listItem.appendChild(imageDiv);
    checkboxDiv.appendChild(checkbox);
    listItem.appendChild(checkboxDiv);

    return listItem;
}
async function isImageSensitive(file) {
    const bodyData = new FormData();
    bodyData.append('imageFile', file);

    try {
        const response = await fetch("/Blog/CheckImageSensitiveContent", {
            method: "POST",
            body: bodyData
        });
        const data = await response.json();
        // console.log("Check image sensitive >>> ", data);

        if (data.message) {
            return data.message;
        }

        return data.isAdultContent;
    } catch (err) {
        console.log("Check error >>> ", err.toString());
    }
}

async function handleSearchChatRoom(event) {
    if (event.keyCode == 13) {
        var href = window.location.href;
        if (href.includes('/Chat/Group')) {
            window.location.href = `/Chat/Group?search=${event.target.value}`
        } else {
            window.location.href = `/Chat?search=${event.target.value}`
        }
    }
}

async function isSensitiveContent(content) {
    const bodyData = new FormData()
    bodyData.append('text', content);

    try {
        const response = await fetch("/Blog/AnalyzeSentiment", {
            method: "POST",
            body: bodyData
        });
        const data = await response.json();
        // console.log("Check content sensitive >>> ", data);
        if (data.sentiment < -0.1) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        console.log("Check error >>> ", err.toString());
        return false; // Trả về false nếu có lỗi
    }
}
function handleSearchFriend(event) {
    if (event.keyCode == 13) {
        var hostname = window.location.hostname;
        var protocol = window.location.protocol;
        var port = window.location.port;

        console.log("Check event target value >>> ", event.target.value, protocol, hostname);
        setTimeout(() => {
            console.log("Check port >>> ", port)
            if (port) {
                window.location.href = `${protocol}//${hostname}:${port}/Friend?search=${event.target.value}`;
            } else {
                window.location.href = `${protocol}//${hostname}/Friend?search=${event.target.value}`;
            }
        }, 0)
    }
}

function handleSearchFriends(event) {
    if (event.keyCode == 13) {
        event.preventDefault()
        var hostname = window.location.hostname;
        var protocol = window.location.protocol;
        var port = window.location.port;

        setTimeout(() => {
            console.log("Check port >>> ", port)
            if (port) {
                window.location.href = `${protocol}//${hostname}:${port}/Friend/Friend?search=${event.target.value}`;
            } else {
                window.location.href = `${protocol}//${hostname}/Friend/Friend?search=${event.target.value}`;
            }
        }, 0)
    }
}

function handlehandleChangeIconTheme() {
    var element = document.getElementById('theme_icon');
    if (element) {
        if (element.classList.contains('bi-moon-fill')) {
            element.classList.remove('bi-moon-fill')
            element.classList.add('bi-brightness-high-fill')
        } else {
            element.classList.remove('bi-brightness-high-fill')
            element.classList.add('bi-moon-fill')
        }
    }
}
function getSavedTheme() {
    return sessionStorage.getItem('theme');
}
var defaultTheme = '/css/light.css';

// Hàm lưu giá trị chủ đề vào sessionStorage
function saveTheme(theme) {
    sessionStorage.setItem('theme', theme);
}

// Hàm áp dụng chủ đề
function applyTheme(theme) {
    var themeLink = document.getElementById('theme-css');
    themeLink.setAttribute('href', theme);
}

// Kiểm tra nếu có trạng thái chủ đề được lưu trữ và áp dụng nó khi trang được tải lại
document.addEventListener('DOMContentLoaded', function () {
    var savedTheme = getSavedTheme();
    if (savedTheme == '/css/light.css') {
        var theme_container = document.getElementById('theme_container')
        var button = document.createElement("button");

        // Thiết lập các thuộc tính cho button
        button.setAttribute("class", "btn btn-outline-light");
        button.setAttribute("id", "theme-toggle");
        button.setAttribute("title", "Toggles light & dark");
        button.setAttribute("aria-label", "auto");
        button.setAttribute("aria-live", "polite");

        // Tạo phần tử icon
        var icon = document.createElement("i");
        icon.setAttribute("id", "theme_icon");
        icon.setAttribute("class", "bi bi-brightness-high-fill");

        // Thêm icon vào trong button
        button.appendChild(icon);

        // Thêm sự kiện onclick cho button
        button.onclick = handleChangeTheme;

        theme_container.appendChild(button);
    } else {
        var theme_container = document.getElementById('theme_container')
        var button = document.createElement("button");

        // Thiết lập các thuộc tính cho button
        button.setAttribute("class", "btn btn-outline-light");
        button.setAttribute("id", "theme-toggle");
        button.setAttribute("title", "Toggles light & dark");
        button.setAttribute("aria-label", "auto");
        button.setAttribute("aria-live", "polite");

        // Tạo phần tử icon
        var icon = document.createElement("i");
        icon.setAttribute("id", "theme_icon");
        icon.setAttribute("class", "bi bi-moon-fill");

        // Thêm icon vào trong button
        button.appendChild(icon);

        // Thêm sự kiện onclick cho button
        button.onclick = handleChangeTheme;

        theme_container.appendChild(button);
    }

    if (savedTheme) {
        applyTheme(savedTheme);
    }
});
function createTableRow(item) {

    var row = document.createElement("tr");

    var idCell = document.createElement("td");
    idCell.textContent = item.Id;
    row.appendChild(idCell);

    var titleCell = document.createElement("td");
    titleCell.textContent = item.Title;
    row.appendChild(titleCell);

    var accountIdCell = document.createElement("td");
    accountIdCell.textContent = item.AccountId;
    row.appendChild(accountIdCell);

    var isAcceptedCell = document.createElement("td");
    isAcceptedCell.textContent = item.IsAccepted;
    row.appendChild(isAcceptedCell);

    var publishDateCell = document.createElement("td");
    publishDateCell.textContent = item.PublishDate;
    row.appendChild(publishDateCell);

    var likesCell = document.createElement("td");
    likesCell.textContent = item.Likes;
    row.appendChild(likesCell);

    var actionsCell = document.createElement("td");
    actionsCell.classList.add("d-flex", "flex-column", "gap-2");

    // Tạo button Accept hoặc UnAccept tùy thuộc vào giá trị của item.IsAccepted
    var acceptForm = document.createElement("form");
    acceptForm.action = item.IsAccepted ? "/Admin/BlogAdmin/UnAccept" : "/Admin/BlogAdmin/Accept";
    acceptForm.method = "post";
    var acceptButton = document.createElement("button");
    acceptButton.type = "submit";
    acceptButton.classList.add("w-100", "btn", "btn-outline-light");
    acceptButton.textContent = item.IsAccepted ? "UnAccept" : "Accept";
    acceptForm.appendChild(acceptButton);
    actionsCell.appendChild(acceptForm);

    // Tạo button Details
    var detailsLink = document.createElement("a");
    detailsLink.href = "/Admin/BlogAdmin/Details/" + item.Id;
    detailsLink.classList.add("btn", "btn-outline-light");
    detailsLink.textContent = "Details";
    actionsCell.appendChild(detailsLink);

    // Tạo button Delete và Modal
    var deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.classList.add("btn", "btn-outline-light");
    deleteButton.dataset.bsToggle = "modal";
    deleteButton.dataset.bsTarget = "#exampleModal";
    deleteButton.textContent = "Delete";
    actionsCell.appendChild(deleteButton);

    // Thêm cell chứa các button vào row
    row.appendChild(actionsCell);

    // Trả về row đã tạo
    return row;
}
var tbody = document.getElementById('tbody');
function handleSearchBlog(event) {
    let search = event.target.value
    fetch(`/Admin/BlogAdmin/GetAllBlogAsync?search=${search}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data)
            if (tbody) {
                tbody.innerHTML = '';
                data.blogs.forEach(item => {
                    tbody.appendChild(createTableRow(item));
                });
            }

        })
        .catch(error => {
            console.log('There was a problem with the fetch operation:', error);
        });
}
function handleAddFriendProfile(userId, friendId) {

    fetch(`/Profile/AddFriend?form_add_friend_userid=${userId}&form_add_friend_friendid=${friendId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {

            console.log(data);
            var element = document.getElementById("profile_request_friend")
            var add_fr_profile_element = document.getElementById(`add_fr_profile_element_${friendId}`)
            if (add_fr_profile_element) {
                add_fr_profile_element.classList.add('disabled')
                add_fr_profile_element.textContent = ''
                add_fr_profile_element.textContent = 'Requested'
            }
            if (element) {
                element.innerHTML = ''
                element.innerHTML = data.newHtml
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}


var messages_display_container = document.getElementById("messages_display_container")
if (messages_display_container) {
    messages_display_container.scrollTop = messages_display_container.scrollHeight;
}

function handleToggleMessages(chatroomId) {

}

$(document).ready(function () {
    var screenWidth = $(window).width();
    var screenHeight = $(window).height();
    // console.log("Check width" + screenWidth)

    var ele = document.getElementById('nof_icon_container');

    if (screenWidth > 550) {
        ele.innerHTML = `
                <a onclick="handleToggleNofs()" id="navNofitication" class="nof_icon text-center">
                    <i class="navIcon icon bi bi-bell-fill"></i>
                    <p class="navTitle w-75 fs-4 text-start my-auto">Nofitications</p>
                </a>
            `
    }
});
function handleDeleteBlogDetail(blogId) {
    fetch(`/Blog/Delete?blogId=${blogId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {

            console.log(data);
            var port = window.location.port;
            var protocol = window.location.protocol;
            var domain = window.location.domain;
            var hostname = window.location.hostname;
            var href = window.location.href;

            console.log("check port >>> ", port)
            console.log("check protocol >>> ", protocol)
            console.log("check domain >>> ", domain)
            console.log("check hostname >>> ", hostname)
            console.log("check href >>> ", href)

            if (window.location.href.toString().includes('Profile')) {
                window.location.href = protocol + "//" + hostname + "/Profile"
            } else {
                window.location.href = protocol + "//" + hostname;
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}
function handleDeleteBlog(blogId) {
    fetch(`/Blog/Delete?blogId=${blogId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);

            if (data.message == 'success') {
                showElement("update_success_blog_" + blogId)
                var domEle = document.getElementById("blog_card_" + blogId);
                domEle.remove();
            } else {
                showElement("update_fail_blog_" + blogId)
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

function handleDeleteComment(commentId, blogId) {
    fetch(`/Blog/DeleteComment?commentId=${commentId}&blogId=${blogId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {

            console.log(data);
            console.log(blogId);

            var commentContainer = document.getElementById("comment_container_lower_" + blogId);
            if (data.message == 'success') {
                // showElement("update_success_comment_" + commentId)
                commentContainer.innerHTML = ''
                commentContainer.innerHTML = data.newHtml
            } else {
                showElement("update_fail")
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

function handleDeleteNofitication(nofId) {
    fetch(`/Blog/DeleteNofitication?nofId=${nofId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {

            console.log(data);
            var element = document.getElementById("nav_item_nofitications_container")
            if (element) {
                element.innerHTML = ''
                element.innerHTML = data.newHtml
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

function reloadAllNof(userId) {
    fetch(`/Profile/GetReloadNofs?userId=${userId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {

            console.log(data.newHtml);
            // cập nhật giao diện người dùng với dữ liệu mới
            var element = document.getElementById("nav_item_nofitications_container")
            if (element) {
                element.innerHTML = '';
                element.innerHTML = data.newHtml
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

function handleToggleNofs() {
    var element = document.getElementById("nav_item_nofitications");
    if (element.classList.contains("hidden")) {
        element.classList.remove('hidden');
    } else {
        element.classList.add("hidden");
    }
}

async function editblog(event) {
    event.preventDefault();
    const form = event.target;
    const formContent = document.querySelector('.ck-content');
    console.log(formContent.innerHTML);

    let urlImage = form.BlogImageUrl.value.replace("C:\\fakepath\\", "/images/")

    const inputImage = form.BlogImageUrl;
    const file = inputImage.files[0];

    const isAdultImage = await isImageSensitive(file);
    const isAdultContent = await isSensitiveContent(formContent.innerHTML.toString())
    console.log("IsAdultImage >>> ", isAdultImage)
    if (isAdultImage == false && isAdultContent == false) {
        const bodyData = new FormData();
        bodyData.append('Id', form.Id.value);
        bodyData.append('Title', form.Title.value);
        bodyData.append('Description', form.Description.value);
        bodyData.append('Content', formContent.innerHTML.toString());
        bodyData.append('BlogImageUrl', urlImage.toString());
        bodyData.append('CategoryId', form.CategoryId.value);
        bodyData.append('imageFile', file);
        try {
            const response = await fetch('/Blog/Edit', {
                method: "POST",
                // headers: {
                //     // "Content-Type": "application/json",
                //     'Content-Type': 'application/x-www-form-urlencoded',
                // },
                body: bodyData
            })
            const data = await response.json();
            console.log("Check data return >>> ", data)
            if (data.message == 'success') {
                showElement("update_success");
                // // Lấy thông tin về cổng của localhost hiện tại
                // var port = window.location.port;
                // var domain = window.location.hostname;
                // var protocol = window.location.protocol

                // // Chuyển hướng trang đến domain hiện tại
                // window.location.href = domain + ":" + port;
                // // Chuyển hướng trang đến localhost với cổng hiện tại
            } else {
                showElement("update_fail");
            }
        } catch (err) {
            console.log(err.toString());
        }
    }
    else if (isAdultContent == true) {
        showElement('sensitive_content');
    } else if (isAdultImage == true) {
        showElement('sensitive_content_image')
    }
    else {
        const bodyData = new FormData();
        bodyData.append('Id', form.Id.value);
        bodyData.append('Title', form.Title.value);
        bodyData.append('Description', form.Description.value);
        bodyData.append('Content', formContent.innerHTML.toString());
        bodyData.append('BlogImageUrl', urlImage.toString());
        bodyData.append('CategoryId', form.CategoryId.value);
        bodyData.append('imageFile', file);
        try {
            const response = await fetch('/Blog/Edit', {
                method: "POST",
                body: bodyData
            })
            const data = await response.json();
            console.log("Check data return >>> ", data)
            if (data.message == 'success') {
                showElement("update_success");
                // // Lấy thông tin về cổng của localhost hiện tại
                // var port = window.location.port;
                // var domain = window.location.hostname;
                // var protocol = window.location.protocol

                // // Chuyển hướng trang đến domain hiện tại
                // window.location.href = domain + ":" + port;
                // // Chuyển hướng trang đến localhost với cổng hiện tại
            } else {
                showElement("update_fail");
            }
        } catch (err) {
            console.log(err.toString());
        }
    }
}
async function handleAddBlog(event) {
    event.preventDefault();
    const form = event.target;
    // console.log("Check form >>> ", form.Title.value)
    const title = form.Title.value;
    const desc = form.Description.value;
    const formContent = document.querySelector('.ck-content');
    console.log(formContent.innerHTML);

    let urlImage = form.BlogImageUrl.value.replace("C:\\fakepath\\", "/images/")

    const inputImage = form.BlogImageUrl;
    const file = inputImage.files[0];

    const isAdultImage = await isImageSensitive(file);
    const isAdultContent = await isSensitiveContent(formContent.innerHTML.toString())
    const isAdultTitle = await isSensitiveContent(title)
    const isAdultDesc = await isSensitiveContent(desc)

    console.log("isAdultImage >>> ", isAdultImage);
    console.log("isAdultContent >>> ", isAdultContent);
    console.log("isAdultTitle >>> ", isAdultTitle);
    console.log("isAdultDesc >>> ", isAdultDesc);

    if (isAdultContent == true || isAdultTitle == true || isAdultDesc == true) {
        showElement('sensitive_content');
    }

    if (isAdultImage == true) {
        showElement('sensitive_content_image')
    }

    if (file == null) {
        showElement('warning_not_image_upload')
    }

    if (isAdultImage == false && isAdultContent == false && isAdultTitle == false && isAdultDesc == false) {

        const bodyData = new FormData();
        bodyData.append('Title', form.Title.value);
        bodyData.append('Description', form.Description.value);
        bodyData.append('Content', formContent.innerHTML.toString());
        bodyData.append('BlogImageUrl', urlImage.toString());
        bodyData.append('CategoryId', form.CategoryId.value);
        bodyData.append('imageFile', file);
        try {
            showElement('add_blog_success');
            const response = await fetch('/Blog/Add', {
                method: "POST",
                body: bodyData
            })
            const data = await response.json();
            console.log("Check data return >>> ", data)
        } catch (err) {
            console.log(err.toString());
        }
    }

}

async function saveImage(imageUrl) {
    try {
        // Tải ảnh từ URL
        const response = await fetch(imageUrl);
        if (!response.ok) {
            console.error("Lỗi khi tải ảnh:", response.statusText);
            return null;
        }

        // Chuyển đổi ảnh thành mảng byte
        const imageBlob = await response.blob();

        // Tạo một URL cho ảnh
        const imageURL = URL.createObjectURL(imageBlob);

        // Tạo một thẻ <a> ẩn và sử dụng nó để tải ảnh
        const link = document.createElement('a');
        link.href = imageURL;
        link.download = 'image.png'; // Tên tệp khi tải xuống
        document.body.appendChild(link);
        link.click();

        // Xóa URL sau khi đã sử dụng
        URL.revokeObjectURL(imageURL);

        return "Ảnh đã được tải xuống thành công";
    } catch (error) {
        console.error("Lỗi khi lưu ảnh:", error.message);
        return null;
    }
}
function w3_open() {
    document.getElementById("main").style.marginLeft = "25%";
    document.getElementById("mySidebar").style.width = "25%";
    document.getElementById("mySidebar").style.display = "block";
    document.getElementById("openNav").style.display = 'none';
}
function w3_close() {
    document.getElementById("main").style.marginLeft = "0%";
    document.getElementById("mySidebar").style.display = "none";
    document.getElementById("openNav").style.display = "inline-block";
}
function handleAccept(userId, nofId) {
    fetch(`/Profile/AcceptFriendRequest?userId=${userId}&nofId=${nofId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {

            // console.log(data.commentHtml);
            // // cập nhật giao diện người dùng với dữ liệu mới
            // var element = document.getElementById("nofi_card_actions_" + nofId);
            // if (element) {
            //     console.log(data.newHtml)
            //     element.innerHTML = '';
            //     element.innerHTML = data.newHtml;
            // }
            if (data) {
                window.location.href = "/Blog";
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

function UpdateProfile() {
    event.preventDefault();
    var formData = new FormData(document.getElementById("update_profile_form"));
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/Profile/UpdateProfile", true);
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest"); // Đảm bảo yêu cầu được nhận biết là AJAX
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                if (response) {
                    console.log("CHECK response >>> ", response)
                    if (response.message == 'success') {
                        console.log("vao success")
                        showElement("update_success");
                    } else {
                        console.log("vao failed")
                        showElement("update_fail");
                    }
                }
            } else {
                // Xử lý lỗi
            }
        }
    };
    xhr.send(formData);
}
function showElement(elementId) {
    // Lấy element
    const element = document.getElementById(elementId);

    // Hiển thị element
    element.style.display = "block";

    // Ẩn element sau 5 giây
    setTimeout(() => {
        element.style.display = "none";
    }, 3000);
}
function handleDeny(userId, nofId) {
    fetch(`/Profile/DenyFriendRequest?userId=${userId}&nofId=${nofId}`,)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {

            console.log(data.commentHtml);
            // cập nhật giao diện người dùng với dữ liệu mới
            var element = document.getElementById("nofi_card_actions_" + nofId);
            if (element) {
                element.innerHTML = '';
                element.innerHTML = data.newHtml;
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}
async function handleChangeToChatDetail(userId, friendId) {
    await fetch(`/Chat/GetChatRoomId?userId=${userId}&friendId=${friendId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log("check data >>> ", data)
            if (data.chatRoomId) {
                window.location.href = `/Chat/Details/${data.chatRoomId}`
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}
function handleUnFriend(userId, friendId, itemId) {
    fetch(`/Friend/UnFriend?userId=${userId}&friendId=${friendId}`,)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {

            console.log(data);
            if (itemId) {
                var elementFriendIndex = document.getElementById("friend_card_actions_" + itemId)
                var elementProfileIndex = document.getElementById("profile_request_friend")
                var elementBLogIndex = document.getElementById("right_click_menu_container_" + itemId)
                if (elementBLogIndex) {
                    elementBLogIndex.innerHTML = ''
                    elementBLogIndex.innerHTML = data.sbBlogIndex
                }
                if (elementProfileIndex) {
                    elementProfileIndex.innerHTML = ''
                    elementProfileIndex.innerHTML = data.sbProfile
                }
                if (elementFriendIndex) {
                    elementFriendIndex.innerHTML = ''
                    elementFriendIndex.innerHTML = data.sbFriendIndex
                    showElement("friend_card_status_" + itemId)
                }
            } else {
                console.log(data);

                var un_fr_profile_element = document.getElementById(`un_fr_profile_element_${friendId}`)
                if (un_fr_profile_element) {
                    un_fr_profile_element.classList.add('disabled')
                    un_fr_profile_element.textContent = ''
                    un_fr_profile_element.textContent = 'Add Friend'
                }

            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

function handleAddFriend(userId, blogId) {
    console.log(userId.trim());
    console.log(blogId);

    var formData = new FormData(document.getElementById("form_add_friend_" + blogId));
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/Blog/AddFriend", true);
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest"); // Đảm bảo yêu cầu được nhận biết là AJAX
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                if (response) {
                    console.log("CHECK response >>> ", response)
                    var element = document.getElementById("right_click_menu_container_" + blogId)
                    if (element) {
                        element.innerHTML = '';
                        element.innerHTML = response.newHtml;
                    }
                }
            } else {
                // Xử lý lỗi
            }
        }
    };
    xhr.send(formData);
}
function handleRightClick(id) {
    event.preventDefault();
    var element = document.getElementById("right_click_menu_" + id);
    if (element.classList.contains("hidden")) {
        element.classList.remove("hidden")
    } else {
        element.classList.add("hidden")
    }
}
function handleShareBlog(id) {
    event.preventDefault();
    var formData = new FormData(document.getElementById("share_form_" + id));
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/Blog/ShareBlog", true);
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest"); // Đảm bảo yêu cầu được nhận biết là AJAX
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                if (response) {
                    console.log("CHECK response >>> ", response)
                    showElement("share_status_success_" + id);
                } else {
                    showElement("share_status_failed_" + id)
                }
            } else {
                // Xử lý lỗi
            }
        }
    };
    xhr.send(formData);
}
function handleToggleShareActions(id) {
    var element = document.getElementById("share_actions_" + id)
    if (element.classList.contains("hidden")) {
        element.classList.remove("hidden");
    } else {
        element.classList.add("hidden")
    }
}
function handleToggleLike(id) {
    event.preventDefault();
    var formData = new FormData(document.getElementById("like_form_" + id));
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/Blog/AddLike", true);
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest"); // Đảm bảo yêu cầu được nhận biết là AJAX
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                if (response) {
                    console.log("CHECK response >>> ", response)
                }
            } else {
                // Xử lý lỗi
            }
        }
    };
    xhr.send(formData);
}
let isDisplayAllCmt = true
function handleLoadAllComments(blogId) {
    console.log("Typeof isDisplayAllCmt >>> ", typeof (isDisplayAllCmt))
    fetch(`/Blog/GetAllCommentsOfBlogs?blogId=${blogId}&isDisplayAllCmt=${isDisplayAllCmt}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            var commentContainer = document.getElementById("comment_container_lower_" + blogId);
            if (commentContainer) {
                commentContainer.innerHTML = '';
                commentContainer.innerHTML = data.commentHtml;
                isDisplayAllCmt = !isDisplayAllCmt;
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}
function handleChangeIcon(id) {
    var icon = document.getElementById("like_icon_" + id);
    if (!icon.classList.contains("bi-heart-fill")) {
        icon.classList.remove("bi-heart")
        icon.classList.add("bi-heart-fill")
    } else {
        icon.classList.remove("bi-heart-fill")
        icon.classList.add("bi-heart")
    }
}
function handleToggleUnLike(id) {
    event.preventDefault();
    var formData = new FormData(document.getElementById("like_form_" + id));
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/Blog/UnLike", true);
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest"); // Đảm bảo yêu cầu được nhận biết là AJAX
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                if (response) {
                    console.log("CHECK response >>> ", response)
                }
            } else {
                // Xử lý lỗi
            }
        }
    };
    xhr.send(formData);
}
function handleUnLike(id) {
    handleChangeIcon(id)

    let element = document.getElementById("action_like_" + id)
    console.log(element);
    element.onclick = function () {
        handleLike(id)
    }
    console.log(element);

    handleToggleUnLike(id)
}
function handleLike(id) {
    handleChangeIcon(id)

    let element = document.getElementById("action_like_" + id)
    console.log(element);
    element.onclick = function () {
        handleUnLike(id)
    }
    console.log(element);
    handleToggleLike(id)
}

if (document.querySelector("#profile_photo_input") != null) {
    document.querySelector("#profile_photo_input").addEventListener("change", handlePreviewPhoto);

    if (!document.getElementById("profile_photo_input").value != "") {
        console.log("Chay lan dau")
        document.getElementById("saveChange_button").classList.remove("flex")
        document.getElementById("saveChange_button").classList.add("hidden")
    }
}

function handlePreviewPhoto() {
    console.log("Da chay")
    if (!this.files || !this.files[0]) return;

    const FR = new FileReader();
    var img = document.getElementById('profile_photo');

    FR.addEventListener("load", function (evt) {
        img.src = evt.target.result;
    });

    console.log("Check >>> ", img.src)

    FR.readAsDataURL(this.files[0]);

    if (document.getElementById("profile_photo_input").value != "") {
        console.log("Chay lan hai")
        document.getElementById("saveChange_button").classList.remove("hidden")
        document.getElementById("saveChange_button").classList.add("flex")
    } else {
        console.log("Chay lan dau")
        document.getElementById("saveChange_button").classList.remove("flex")
        document.getElementById("saveChange_button").classList.add("hidden")
    }
}
function syncInputs(value, targetId) {
    var targetInput = document.getElementById(targetId);
    targetInput.value = value;
    console.log("dang chay syncinput")
}

function handleEdituserName() {
    var input_username = document.getElementById("input_username_edit")
    if (!input_username.classList.contains("hidden")) {
        document.getElementById("saveChange_button").classList.remove("hidden")
        document.getElementById("saveChange_button").classList.add("flex")
    } else {
        document.getElementById("saveChange_button").classList.remove("flex")
        document.getElementById("saveChange_button").classList.add("hidden")
    }
    console.log("dang chay handleEdituserName")
}
function toogleEditUsername() {
    var h1 = document.getElementById("user_name_h1");
    var input_username = document.getElementById("input_username_edit")
    if (!h1.classList.contains("hidden")) {
        h1.classList.add("hidden")
        input_username.classList.remove("hidden")
    }
    document.getElementById("saveChange_button").classList.remove("hidden")
    document.getElementById("saveChange_button").classList.add("flex")

}
function handleEditToggleComment(id) {

    var form = document.getElementById("comment_form_" + id)
    var p = document.getElementById("p_content_" + id);
    if (!p.classList.contains("hidden")) {
        p.classList.add("hidden");
        form.classList.remove("hidden");
        form.focus();
    } else {
        p.classList.remove("hidden")
        form.classList.add("hidden")
    }
}
function toggleActionComment(id) {
    var element = document.getElementById("comments_actions_" + id)
    if (element.classList.contains("hidden")) {
        element.classList.remove("hidden");
    } else {
        element.classList.add("hidden");
    }
}
function handleSubmitAddCmt(id) {
    event.preventDefault();
    var formData = new FormData(document.getElementById("form_comment_" + id));
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/Blog/AddComment", true);
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest"); // Đảm bảo yêu cầu được nhận biết là AJAX
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);

                // Cập nhật nội dung của phần tử commentContainer
                document.getElementById("form_input_comment_" + id).value = ""
                var commentContainer = document.getElementById("comment_container_lower_" + id);
                if (commentContainer) {
                    commentContainer.innerHTML = '';
                    commentContainer.innerHTML = response.commentHtml;
                }
            } else {
                // Xử lý lỗi
            }
        }
    };
    xhr.send(formData);
}
function handleToggleMore(id) {
    console.log(id)
    const element = document.getElementById("content_" + id);
    const toggle_icon = document.getElementById("toggle_icon_" + id)
    var parentElement = element.parentElement
    if (element.classList.contains("temp_hidden")) {

        element.classList.remove("temp_hidden")
        toggle_icon.classList.remove("bi-arrow-down-circle")
        toggle_icon.classList.add("bi-arrow-up-circle")

    } else {
        parentElement.scrollIntoView({ behavior: 'smooth' })
        console.log(parentElement)
        element.classList.add("temp_hidden")
        // scroll execute
        toggle_icon.classList.remove("bi-arrow-up-circle")
        toggle_icon.classList.add("bi-arrow-down-circle")
    }
}

function handleToggle(id) {
    var element = document.getElementById(id);
    if (element.classList.contains("hidden")) {
        element.classList.remove("hidden");
        element.classList.add("flex");
    } else {
        element.classList.add("hidden");
        element.classList.remove("flex");
    }
}
function handleSubmitEditCmt(id, cmtId) {
    event.preventDefault();
    console.log("Check cmtid >>> ", cmtId)
    var formData = new FormData(document.getElementById("edit_form_cmt_" + cmtId));
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/Blog/UpdateComment", true);
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest"); // Đảm bảo yêu cầu được nhận biết là AJAX
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);

                var commentContainer = document.getElementById("comment_container_lower_" + id);
                if (commentContainer) {
                    commentContainer.innerHTML = '';
                    commentContainer.innerHTML = response.commentHtml;
                }
            } else {
                // Xử lý lỗi
            }
        }
    };
    xhr.send(formData);
}
function handleKeyPressInputEditComment(event, id, commentId) {
    if (event.key === 'Enter') {
        handleSubmitEditCmt(id, commentId)

        console.log("Check" + commentId);
        handleEditToggleComment(commentId)
    }
}

function handleKeyPress(event, id) {
    // Kiểm tra xem phím được nhấn có phải là phím Enter không
    if (event.key === "Enter") {
        // Xử lý sự kiện tại đây, ví dụ: gọi một hàm JavaScript hoặc thực hiện một hành động khác
        handleSubmitAddCmt(id)
    }
    return false;
}

function handleToggleFilter() {

    var element = document.getElementById("filter_modal");
    if (element) {
        if (element.classList.contains("hidden")) {
            element.classList.remove("hidden");
            element.classList.add("block");
        } else {
            element.classList.add("hidden");
            element.classList.remove("block");
        }
    }
}