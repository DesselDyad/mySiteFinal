window.onload = () => {
    if(localStorage.getItem('success_msg')) {
        if(document.querySelector('#operations_master')) {
            let myDiv = document.createElement('DIV');
            myDiv.classList.add('alert');
            myDiv.classList.add('alert-success');
            let myNode = document.createTextNode(localStorage.getItem('success_msg'));
            myDiv.appendChild(myNode);
            document.querySelector('#operations_master').insertAdjacentElement('beforebegin', myDiv);
            localStorage.removeItem('success_msg');
        }
        else if(document.querySelector('.overview_h1')) {
            if(localStorage.getItem('success_msg')) {
                let myDiv = document.createElement('DIV');
                myDiv.classList.add('alert');
                myDiv.classList.add('alert-success');
                let myNode = document.createTextNode(localStorage.getItem('success_msg'));
                myDiv.appendChild(myNode);
                document.querySelector('.overview_h1').insertAdjacentElement('afterend', myDiv);
                localStorage.removeItem('success_msg');
            }
        }
        else {
            let myDiv = document.createElement('DIV');
            myDiv.classList.add('alert');
            myDiv.classList.add('alert-success');
            let myNode = document.createTextNode(localStorage.getItem('success_msg'));
            myDiv.appendChild(myNode);
            document.querySelector('header').insertAdjacentElement('afterend', myDiv);
            localStorage.removeItem('success_msg');
        }
    }

}

if(window.location.href == 'http://localhost:3000/user/profile') {
    document.querySelector('.operations_list').getElementsByTagName('a')[1].click();
}
/**
 * @module User
 */

if(document.querySelector('#userImage')) {
    //profile image review snippet, uses base64 and FileReader
    document.querySelector('#userImage').addEventListener('change', () => {
        var reader = new FileReader();
        let file = document.querySelector('#userImage').files[0];
        reader.addEventListener("load", function () {
            document.querySelector('#preview').src = reader.result;
            localStorage.setItem("imgData", reader.result);
        })
        if (file) {
            reader.readAsDataURL(file);
        }
    });
}

/**
 * view_overview
 * function for showing a users profile
 */
function view_overview () {
    fetch('http://localhost:3000/user/getSingle')
    .then(result => {return result.json()})
    .then(user => {
        //load profile page
        document.querySelector('.profile_section').innerHTML = `
            <div class="profile_div">
                <h1 class="profile_heading">Profile Overview</h1>
                <label class="profile_label">User-privileges: </label><span class="profile_span">${user.local.role}</span>
                <img src="../img/${user.local.profile_img}" alt="profile image" title="profile image" class="profile_img img-responsive">
                <section class="profile_p_section">
                    <p>
                        <label class="profile_label">Username: </label>
                        <span class="profile_span">${user.local.account.username}<span>
                    </p>
                    <p>
                        <label class="profile_label">Name: </label>
                        <span class="profile_span">${user.local.contact_info.name}<span>
                    </p>
                    <p>
                        <label class="profile_label">E-mail Adress: </label>
                        <span class="profile_span">${user.local.contact_info.email}<span>
                    </p>
                    <p>
                        <label class="profile_label">Phone Number: </label>
                        <span class="profile_span">${user.local.contact_info.phone}<span>
                    </p>
                    <p>
                        <label class="profile_label">Adress: </label>
                        <span class="profile_span">${user.local.contact_info.adress}<span>
                    </p>
                    <p>
                        <label class="profile_label">Created Date: </label>
                        <span class="profile_span">${user.local.created}<span>
                    </p>
                    <p>
                        <label class="profile_label">Signature: </label>
                        <span class="profile_span"><em>${user.local.signature}</em><span>
                    </p>
                </section>
            </div>
        `;
    })
    .catch(e => {
        console.log(e);
    })
}

/**
 * view_settings
 * form for changing the users information and/or image
 */
function view_settings () {
    fetch('http://localhost:3000/user/getSingle')
    .then(result => {return result.json()})
    .then(user => {
        //load profile page
        document.querySelector('.profile_section').innerHTML = `
                    <form class="profile_form" method="post" action="/user/updateUser" enctype="multipart/form-data"> 
                        <div class="profile_div">
                            <h1 class="profile_heading">General Profile Settings</h1>
                            <input type="text" class="hidden" id="user_role" name="role" value="${user.local.role}">
                            <input type="text" class="hidden" id="oldImage" name="oldImage" value="${user.local.profile_img}">
                            <img src="/img/${user.local.profile_img}" alt="profile image" title="profile image" class="profile_img img-responsive">
                            <label class="profile_img_label" >Upload Nyt Billede</label>
                            <input type="file" name="userImage" id="userImage">
                            <img src="" id="preview" class="img-responsive">
                            <section class="profile_p_section">
                                <p>
                                    <label class="profile_label" for="username">Username: </label>
                                    <input type="text" name="username" id="username" minlength="5" maxlength="100" value="${user.local.account.username}" required>
                                </p>
                                <p>
                                    <label class="profile_label" for="name">Name: </label>
                                    <input type="text" name="name" id="name" minlength="5" maxlength="100"  value="${user.local.contact_info.name}" required>
                                </p>
                                <p>
                                    <label class="profile_label" for="email">E-mail Adress: </label>
                                    <input type="email" name="email" id="email" minlength="6" maxlength="100"  value="${user.local.contact_info.email}" required>
                                </p>
                                <p>
                                    <label class="profile_label" for="email2">E-mail Adress: </label>
                                    <input type="email" name="email2" id="email2" minlength="6" maxlength="100"  value="${user.local.contact_info.email}" required>
                                </p>
                                <p>
                                    <label class="profile_label" for="phone">Phone Number: </label>
                                    <input type="text" name="phone" id="phone" minlength="8" maxlength="30"  value="${user.local.contact_info.phone}" required>
                                </p>
                                <p>
                                    <label class="profile_label" for="adress">Adress: </label>
                                    <input type="textarea" name="adress" id="adress" minlength="5" maxlength="150"  value="${user.local.contact_info.adress}" required>
                                </p>
                                <p>
                                    <label class="profile_label" for="signature">Signature: </label>
                                    <input type="text" name="signature" id="signature" value="${user.local.signature}" required>
                                </p>
                            </section>
                            <p>
                                <button type="submit" class="profile_ok">
                                    <span class="glyphicon glyphicon-ok"></span> Update Profile Info
                                </button>
                            </p>
                        </div>
                    </form>
        `;
        document.querySelector('#userImage').addEventListener('change', () => {
            var reader = new FileReader();
            let file = document.querySelector('#userImage').files[0];
            reader.addEventListener("load", function () {
                document.querySelector('#preview').src = reader.result;
                localStorage.setItem("imgData", reader.result);
            })
            if (file) {
                reader.readAsDataURL(file);
            }
        });
    })
    .catch(e => {
        console.log(e);
    })
}
/**
 * view_security
 * function for deleting a users profile or change his password
 */
function view_security () {
    document.querySelector('.profile_section').innerHTML = `
        <div class="profile_div">
            <section class="profile_p_section">
            <h1 class="profile_heading">Profile Security Settings</h1>
            <p>
                <button class="profile_wrench" onclick="view_password_fields()">
                    <span class="glyphicon glyphicon-wrench"></span> Change Password
                </button>
            </p>
            <p>
                <button class="profile_delete" onclick="delete_user()">
                    <span class="glyphicon glyphicon-remove"></span> Delete Profile
                </button>
            </p>
        </div>
    `;
}
/**
 * view_password_fields
 * function for managing the changing of the password
 */
function view_password_fields() {
        document.querySelector('.profile_section').innerHTML = `
            <form class="password_form">
                <section class="password_section">
                    <div class="password_div">
                        <section class="password_p_section">
                        <h1 class="password_heading">Change Password</h1>
                        <h2 class="password_heading">Enter Old Password</h2>
                        <p>
                            <label for="old_password" class="password_label">Old password: </label>
                            <input type="text" id="old_password" name="old_password" autocomplete="off" autofocus required>
                        </p>
                        <p>
                            <span class="error_msg_span" id="old_pw_span"></span>
                        </p>
                        <h2 class="profile_heading">Enter New Password</h2>
                        <p>
                            <label for="new_password" class="password_label">Enter Password: </label>
                            <input type="text" id="new_password" name="new_password" required>
                        </p>
                        <p>
                            <label for="rep_new_password" class="password_label">Repeat Password: </label>
                            <input type="text" id="rep_new_password" name="rep_new_password" required>
                        </p>
                        <p>
                            <span class="error_msg_span" id="new_pw_span"></span>
                        </p>
                        <button id="submit_old_pw_btn" class="password_ok">Submit Old Password</button>
                    </div>
                </section>
            </form>
        `;
        const btn = document.querySelector('#submit_old_pw_btn');
        //stringify event form
        btn.addEventListener('click', event => {
            event.preventDefault();
                if(document.querySelector('.password_form').old_password.value != '') {
                    let data = JSON.stringify({
                        'old_password': document.querySelector('.password_form').old_password.value
                    });
                    //fetch stringified old password
                    fetch(`http://localhost:3000/user/validate_old_password`, {
                        'method': 'POST',
                        'headers': {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            'Content-Length': data.length
                        },
                        'mode': 'cors',
                        'cache': 'default',
                        'body': data
                    })
                    .then(result => {
                        return result.json();
                    })
                    .then(response => {
                        if(response.response == 'valid') {
                            document.querySelector('#old_pw_span').innerHTML = '';
                            if(document.querySelector('.password_form').new_password.value == document.querySelector('.password_form').rep_new_password.value && document.querySelector('.password_form').new_password.value != '' &&  document.querySelector('.password_form').rep_new_password.value != '') {
                                document.querySelector('#new_pw_span').innerHTML = '';
                                let data = JSON.stringify({
                                    'new_password': document.querySelector('.password_form').new_password.value
                                });
                                fetch(`http://localhost:3000/user/change_password`, {
                                    'method': 'POST',
                                    'headers': {
                                        'Accept': 'application/json',
                                        'Content-Type': 'application/json',
                                        'Content-Length': data.length
                                    },
                                    'mode': 'cors',
                                    'cache': 'default',
                                    'body': data
                                })
                                .then(result => {
                                    return result.json();
                                })
                                .then(response => {
                                    //DO SOMETHING (probably change token in localstorage, this is like re-login without the login i assume)
                                    localStorage.setItem('success_msg', "Password changed succesfully!");
                                    window.location.reload("http://localhost:3000/profile");
    
                                })
                                .catch(e => {
                                    console.log(e);
                                })
                            }
                            else {
                                if(document.querySelector('.password_form').new_password.value != document.querySelector('.password_form').rep_new_password.value) {
                                    document.querySelector('#new_pw_span').innerHTML = 'The passwords must match!';
                                }
                                else if(document.querySelector('.password_form').new_password.value == '') {
                                    document.querySelector('#new_pw_span').innerHTML = 'Neither password field can be empty!';
                                }
                                else if(document.querySelector('.password_form').rep_new_password.value == ''){
                                    document.querySelector('#new_pw_span').innerHTML = 'Neither password field can be empty!';
                                }
                            }  
                        }
                        else if(response.response == 'invalid') {
                            document.querySelector('#old_pw_span').innerHTML = 'The password enetered is invalid!';
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    });
                }
                else {
                    document.querySelector('#old_pw_span').innerHTML = 'The password enetered cant be empty!';
                }
        })
    
}
/**
 * view_preferences
 * function for viewing a users preferences (searchability and color theme)
 */
function view_preferences() {
        fetch('http://localhost:3000/user/getSingle')
        .then(result => {return result.json()})
        .then(user => {
            document.querySelector('.profile_section').innerHTML = `
                <form class="password_form">
                    <section class="password_section">
                        <div class="password_div">
                            <section class="password_p_section">
                            <h1 class="password_heading">Preferences</h1>
                            <h2 class="password_heading">Make profile private/public</h2>
                            <p>
                                <label for="profile_private" class="profile_private_label">Check to make profile public (searchable by others): </label>
                                <input type="checkbox" id="profile_private" name="profile_private">
                            </p>
                        </div>
                    </section>
                </form>
            `;
            document.querySelector('.profile_section').innerHTML += `
                <form class="theme_form">
                    <section class="theme_section">
                        <div class="theme_div">
                            <section class="theme_p_section">
                            <h2 class="theme_heading">Change Page Theme</h2>
                            <p>
                                <label for="theme_selector" class="theme_selector_label">Pick A Theme: </label>
                                <select id="theme_selector" name="theme_selector"></select>
                            </p>
                        </div>
                    </section>
                </form>
            `;
            $.getJSON('../json/styles.json', styles => {
                styles.styles.forEach(style => {
                    document.querySelector('#theme_selector').innerHTML += `
                        <option data-link="${style.link}" value="${style.link}">${style.name}</option>
                    `;
                })
                document.querySelector('#theme_selector').querySelectorAll('option').forEach(option => {
                    if(option.value == user.local.preferences.theme) {
                        option.selected = true;
                    }
                })
                document.querySelector('#theme_selector').style.color = "white";
                document.querySelector('#theme_selector').addEventListener('change', (e) => {
                    let options = document.querySelector('#theme_selector').querySelectorAll('option');
                    document.querySelector('#dyn_sheet').href = '/css/user_specific_sheets/' + options[document.querySelector('#theme_selector').selectedIndex].dataset.link;
                    fetch('http://localhost:3000/user/updateUserTheme/' + options[document.querySelector('#theme_selector').selectedIndex].value)
                    .then(result => {
                        localStorage.setItem('success_msg', 'Theme updated!');
                        window.location.assign(window.location.href);
                    })
                    .catch(err => {
                        console.log(err);
                    })
                })
            });

            let selector = document.querySelector('input[name=profile_private]');
            if(user.local.preferences.profile_searchable) {
                selector.checked = true;
            }
            selector.addEventListener('change', event => {
                if (selector.checked) {
                    fetch('http://localhost:3000/user/makeProfilePublic')
                    .then(result => {
                        localStorage.setItem('success_msg', 'Your profile is now public!');
                        window.location.assign(window.location.href);
                    })
                    .catch(err => {
                        console.log(err);
                    })
                } else {
                    fetch('http://localhost:3000/user/makeProfilePrivate')
                    .then(result => {
                        localStorage.setItem('success_msg', 'Your profile is now private!');
                        window.location.assign(window.location.href);
                    })
                    .catch(err => {
                        console.log(err);
                    })
                }
            })
        })
        .catch(e => {
            console.log(e);
        })
}
/**
 * delete_user
 * function for deleting a user
 */
function delete_user() {
    if(confirm('are you sure you want to delete this user?')) {
        fetch('http://localhost:3000/user/deleteUser', {
            'method': 'post',
            'headers': {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            'mode': 'cors',
            'cache': 'default'
        })
        .then(result => {
            window.location.reload(window.location.href);
        })
        .catch(err => {
            console.log(err);
        })
    }
}

function view_social() {
    fetch('http://localhost:3000/user/getSingle')
    .then(result => {return result.json();})
    .then(user => {
        document.querySelector('.profile_section').innerHTML = `
            <div class="social_div">
                <h2>Social Networking: </h2>
            </div>
        `;
        if(user.facebook) {
            document.querySelector('.social_div').innerHTML += `
                <h2>FaceBook: </h2>
                <div>
                    <label>FaceBook Name: </label>
                    <span>
                        ${user.facebook.name}
                    </span>
                </div>
                <div>
                    <label>FaceBook E-mail: </label>
                    <span>
                        ${user.facebook.email}
                    </span>
                    <div>
                        <label>FaceBook Image: </label>
                        <img src="${user.facebook.profile_picture}"/>
                    </div>
                </div>
                <a href="/unlink/facebook" class="btn btn-primary">
                    <span class="fa fa-facebook">
                        
                    </span>
                    Unink Facebook From Your Account
                </a>
            `;
        }
        else {
            document.querySelector('.social_div').innerHTML += `
                <h2>FaceBook: </h2>
                <a href="/connect/facebook" class="btn btn-primary">
                    <span class="fa fa-facebook">
                        
                    </span>
                    Link Facebook To Your Account
                </a>
            `;
        }
        if(user.google) {
            document.querySelector('.social_div').innerHTML += `
                <h2>Google: </h2>
                <div>
                    <label>Google Name: </label>
                    <span>
                        ${user.google.name}
                    </span>
                </div>
                <div>
                    <label>Google E-mail: </label>
                    <span>
                        ${user.google.email}
                    </span>
                </div>
                <a href="/unlink/google" class="btn btn-danger">
                    <span class="fa fa-google">

                    </span>
                    Unlink Google From Your Account
                </a>
            `;
        }
        else {
            document.querySelector('.social_div').innerHTML += `
                <h2>Google: </h2>
                <a href="/connect/google" class="btn btn-danger">
                    <span class="fa fa-google">

                    </span>
                    Link Google To Your Account
                </a>
            `;

        }
        if(user.github) {
            document.querySelector('.social_div').innerHTML += `
                <h2>GitHub: </h2>
                <div>
                    <label>GitHub Name: </label>
                    <span>
                        ${user.github.name}
                    </span>
                </div>
                <div>
                    <label>GitHub E-mail: </label>
                    <span>
                        ${user.github.email}
                    </span>
                </div>
                <div>
                    <label>GitHub Profile: </label>
                    <a href="${user.github.profile_url}">
                        ${user.github.name}
                    </a>
                </div>
                <div>
                    <img src="${user.github.profile_img}" title="${user.github.profile_img}" alt="${user.github.profile_img}" class="img-responsive" width="150">
                </div>
                <div>
                    <label>GitHub Followers: </label>
                    <span>
                        ${user.github.followers}
                    </span>
                </div>
                <div>
                    <label>Following on GitHube: </label>
                    <span>
                        ${user.github.following}
                    </span>
                </div>
                <div>
                    <label>GitHub Gists: </label>
                    <span>
                        ${user.github.gists}
                    </span>
                </div>
                <div>
                    <label>GitHub Public Repositories: </label>
                    <span>
                        ${user.github.repos}
                    </span>
                </div>
                <div>
                    <label>Your Location: </label>
                    <span>
                        ${user.github.location}
                    </span>
                </div>
                <div>
                    <label>GitHub Biography: </label>
                    <span>
                        ${user.github.bio}
                    </span>
                </div>
                <div>
                    <label>GitHub Created At: </label>
                    <span>
                        ${user.github.created_at}
                    </span>
                </div>
                <div>
                    <label>GitHub Updated At: </label>
                    <span>
                        ${user.github.updated_at}
                    </span>
                </div>
                <a href="/unlink/github" class="btn btn-default">
                    <span class="fa fa-github">

                    </span>
                    Unlink GitHub From Your Account
                </a>
            `;
        }
        else {
            document.querySelector('.social_div').innerHTML += `
                <h2>GitHub: </h2>
                <a href="/connect/github" class="btn btn-default">
                    <span class="fa fa-github">

                    </span>
                    Link GitHub To Your Account
                </a>
            `;

        }
    })
    .catch(e => {
        console.log(e);
    })
}