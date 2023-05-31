// since this page should require login, make sure that user is authenticated
import Auth from './js/auth';

const auth = new Auth();
// On document load, checks to see if user is logged in
document.addEventListener("DOMContentLoaded", () => {
    // if user is logged in, hide login and sign up
    if (auth.isLoggedIn()) {
        let signUp = document.getElementById('signup');
        let loginAndSignup = document.getElementById('loginAndSignup');
        signUp.style.display = "none";
        loginAndSignup.style.display = "none";
    }

    return;
});