// since this page should require login, make sure that user is authenticated
import Auth from '../js/auth';

const auth = new Auth();

// Gets users course plans on page load and generate flowcharts
document.addEventListener("DOMContentLoaded", () => {
    // make sure that user is logged in
    auth.validateAuth();

    return;
});