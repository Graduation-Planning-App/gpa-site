import Auth from "../auth";

class Navbar extends HTMLElement {
    // fields/attributes
    #currentPage = '';

    // constructor
    constructor() {
        super();
        this.attachShadow({ mode: "open"});
        this.render();

        // hide elements that should be shown after login
        const auth = new Auth();
        if (!auth.isLoggedIn()) {
            this.shadowRoot.getElementById('my-course-sequence.html').style.display = 'none';
            this.shadowRoot.getElementById('profile').style.display = 'none';
        }
        const logout = this.shadowRoot.getElementById('logout');
        logout.addEventListener('click', () => auth.logOut());
    }

    // methods
    render() {
        this.shadowRoot.innerHTML = this.template;
    }

    attributeChangedCallback(attributeName, _, newValue, __) {
        switch (attributeName) {
            case "page":
                this.#currentPage = newValue;
                let pageTab = this.shadowRoot.getElementById(newValue);
                if (newValue !== 'index.html') {
                    pageTab.setAttribute("class", "nav-item nav-link py-3 px-3 active");
                }
        }
    }

    // getters and setters
    static get observedAttributes() {
        return ['page'];
    }

    get currentPage() {
        return this.#currentPage;
    }

    set currentPage(value) {
        this.setAttribute('page', value);
        this.#currentPage = value;
    }

    get template() {
        return `
            <style>
                @import url("https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css");
                .navbar {
                    background-color: #021b2e;
                    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
                }
                .nav-item {
                    color: white;
                }
                .nav-item.active {
                    background-color: white;
                    color: #021b2e;
                }
                .nav-item:hover {
                    background-color: #bb0f00;
                    color: white;
                }
                .navbar-brand.active {
                    background-color: #003176;
                }
                .navbar-toggler {
                    background-color: white;
                }
                .profile {
                    justify-content: center;
                }
                .profile ul {
                    list-style-type: none;
                    background-color: #021b2e;
                    margin: 0;
                    padding: 0;
                    position: absolute;
                    top: 100%;
                    display: none;
                }
                .profile ul li {
                    display: block;
                } 
                .profile:hover ul {
                    display: inline-block;
                }
                .profile ul li a:hover {
                    background-color: #bb0f00;
                }
            </style>
            <nav class="navbar navbar-expand-md my-0 py-0 sticky-top">
                <div class="container-fluid">
                    <a id="index.html" class="navbar-brand" href="/">
                        <img 
                            src="https://lh3.googleusercontent.com/tyq4-F2H9R5u9VQvquALlMpbJObqgVO-beWDeKu6UtilcCowVyRXj-3c5AJ8HUngDNlb018VK8ozGk3WMGL96nI0TVKx9CdQ3_xEKqycqCJd8aR4FjdpHUXVa3opqnN_8p7BYd0Kjnw=w2400"
                            alt="GPA Logo" height="30" class="d-inline-block align-text-top px-3"
                        >
                    </a>
                    <div class="row collapse navbar-collapse justify-content-between" id="navbarSupportedContent">
                        <div class="navbar-nav col-md">
                            <a id="my-course-sequence.html" href="/course-sequence/" class="nav-item nav-link py-3 px-3">My Course Sequence</a>
                            <a id="find-courses.html" href="/find-courses/" class="nav-item nav-link py-3 px-3">Find Courses</a>
                            <a id="resources.html" href="/resources/" class="nav-item nav-link py-3 px-3">Resources</a>
                        </div>
                        <div class="col-md-1 d-flex profile px-3 center">
                            <img id="profile"
                                src="https://lh3.googleusercontent.com/9DldeCdIt0TUrvLpBSX--rQDJAO-K5UkmBDFN6VBGiea7OaSoXH5-XJioRCxk182o6e2bBef9WTGPIOJYLm1E7n-4BTHzTQa2ExJPsI8wkBm6aa1f9gtyCtsB4a2_QWtLjniNAP9LBI=w2400"
                                alt="Profile Pic"
                                height="56"
                            />
                            <ul>
                                <li><a id="profile.html" href="/profile/" class="nav-item nav-link py-3 px-3">Profile</a></li>
                                <li><a id="logout" href="#" class="nav-item nav-link py-3 px-3">Logout</a></li>
                            </ul>
                        </div>
                    </div>
                <div>
                <div class="py-3 px-3">
                    <button class="navbar-toggler" type="button">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                </div>
            </nav>
        `
    }
}
customElements.define('nav-bar', Navbar);