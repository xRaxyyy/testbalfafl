// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyAFpo8mRXewVlI1PvOVrvjuHEaMefncqsc",
    authDomain: "vuurwerkduitsland-cc0bb.firebaseapp.com",
    databaseURL: "https://vuurwerkduitsland-cc0bb-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "vuurwerkduitsland-cc0bb",
    storageBucket: "vuurwerkduitsland-cc0bb.appspot.com",
    messagingSenderId: "17574620825",
    appId: "1:17574620825:web:bdb55900ffc50f928dd208",
    measurementId: "G-Z2VGST04S8"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

if (firebase) {
    /*alert('initialized!')*/
}

// Initialize variables
const auth = firebase.auth();
const database = firebase.database();

function login() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    auth.signInWithEmailAndPassword(username + "@example.com", password)
        .then(function(userCredential) {
            var user = userCredential.user;

            var user_data = {
                last_login: new Date().toLocaleString()
            };

            database.ref('users/' + user.uid).update(user_data)
                .then(() => {
                    document.getElementById('profile-username').innerText = username;
                    document.getElementById('profile-dropdown').classList.add('click');

                    localStorage.setItem('userId', user.uid);
                    /*alert('User registered successfully. User ID: ' + user.uid);*/

                    
                    // Save logged-in state in both sessionStorage and localStorage
                    sessionStorage.setItem('loggedIn', 'true');
                    localStorage.setItem('loggedIn', 'true');
                    sessionStorage.setItem('click', 'true');
                    localStorage.setItem('click', 'true');
                    localStorage.setItem('username', username); // Save username in localStorage

                    /*alert('User Logged In!!');*/

                    // Redirect to the last visited page
                    const lastVisitedPage = sessionStorage.getItem('lastVisitedPage');
                    if (lastVisitedPage) {
                        /*alert('got im')*/
                        window.location.href = lastVisitedPage; // Redirect to the last opened page
                    }
                })
                .catch(function(error) {
                    /*alert('Error updating last login: ' + error.message);*/
                });
        })
        .catch(function(error) {
            /*alert('Incorrect username or password! Please try again.');*/
        });
}

function register() {
    const username = document.getElementById('register-username').value.trim();
    const password = document.getElementById('register-password').value;

    if (!validate_username(username)) {
        alert('Username is invalid! Must be provided.');
        return;
    }

    if (!validate_password(password)) {
        alert('Password is too short! Must be at least 7 characters.');
        return;
    }

    database.ref('users').orderByChild('username').equalTo(username).once('value')
        .then(snapshot => {
            if (snapshot.exists()) {
                /*alert('Username already exists! Please choose another one.');*/
            } else {
                auth.createUserWithEmailAndPassword(username + "@example.com", password)
                    .then(function(userCredential) {
                        var user = userCredential.user;

                        var user_data = {
                            username: username,
                            last_login: new Date().toLocaleString()
                        };

                        database.ref('users/' + user.uid).set(user_data)
                            .then(() => {
                                document.getElementById('profile-username').innerText = username;
                                document.getElementById('profile-dropdown').classList.add('click');
                                
                                localStorage.setItem('userId', user.uid);
                                /*alert('set', user.uid)*/

                                // Save logged-in state in both sessionStorage and localStorage
                                sessionStorage.setItem('loggedIn', 'true');
                                localStorage.setItem('loggedIn', 'true');
                                sessionStorage.setItem('click', 'true');
                                localStorage.setItem('click', 'true');
                                localStorage.setItem('username', username); // Save username in localStorage

                                /*alert('User Registered and Logged In!!');*/

                                // Redirect to the last visited page
                                const lastVisitedPage = sessionStorage.getItem('lastVisitedPage');
                                if (lastVisitedPage) {
                                    window.location.href = lastVisitedPage; // Redirect to the last opened page
                                }
                            })
                            .catch(function(error) {
                                /*alert('Error storing user data: ' + error.message);*/
                            });
                    })
                    .catch(function(error) {
                        /*alert('Error creating user: ' + error.message);*/
                    });
            }
        })
        .catch(function(error) {
            /*alert('Error checking username: ' + error.message);*/
        });
}

function logout() {
    /*alert('Logout function triggered');*/

    // Check if the user is considered logged in based on your storage flags
    const loggedIn = sessionStorage.getItem('loggedIn') === 'true' || localStorage.getItem('loggedIn') === 'true';

    if (loggedIn) {
        /*alert('User is currently logged in.');*/

        // Sign out the user
        auth.signOut().then(() => {
            /*alert('Successfully logged out!');*/

        // Remove class immediately
        document.getElementById('profile-dropdown').classList.remove('logged-in');

        // Wait 1 second (1000ms) to clear the username
        setTimeout(function() {
            document.getElementById('profile-username').innerText = '';
        }, 1000); // 1000 milliseconds = 1 second

             localStorage.removeItem('userId');

            // Clear logged-in state from sessionStorage and localStorage
            sessionStorage.setItem('loggedIn', 'false');
            localStorage.setItem('loggedIn', 'false');
            localStorage.removeItem('username');

            location.reload();

        }).catch(function(error) {
            /*alert('Error logging out: ' + error.message);*/
        });
    } else {
        /*alert('No user is currently logged in.');*/
    }
}




// Validate Functions
function validate_username(username) {
    return username.length > 0; // Username must be provided
}

function validate_password(password) {
    return password.length > 6; // Password must be at least 7 characters
}
