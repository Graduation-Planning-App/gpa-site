export default class Auth {
    // setup the class
    constructor() {}
    // check to see if the localStorage item passed to the function is valid and set
    validateAuth() {
        document.querySelector("body").style.display = "none";
        if (!this.isLoggedIn()) {
           window.location.replace("/");
        } else {
           document.querySelector("body").style.display = "block";
        }
    }

    isLoggedIn() {
        const auth = localStorage.getItem("isLoggedIn");
        if (auth === null) {
            return false;
        }
        return auth === 'true';
    }
    
    // will remove the localStorage item and redirect to main page
    logOut() {
        localStorage.removeItem("isLoggedIn");
        window.location.replace("/");
    }
}
