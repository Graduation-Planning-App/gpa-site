export default class Auth {
    // setup the class and hide the body by default
    constructor() {
        document.querySelector("body").style.display = "none";
        const auth = localStorage.getItem("isLoggedIn");
        this.validateAuth(auth);
    }
    // check to see if the localStorage item passed to the function is valid and set
    validateAuth(auth) {
        if (auth !== 'true') {
           window.location.replace("/");
        } else {
           document.querySelector("body").style.display = "block";
        }
    }

    isLoggedIn() {
        const auth = localStorage.getItem("isLoggedIn");
        return auth !== 'true' && auth !== null;
    }
    // will remove the localStorage item and redirect to main page
    logOut() {
        localStorage.removeItem("isLoggedIn");
        window.location.replace("/");
    }
}
