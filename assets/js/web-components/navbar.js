class Navbar extends HTMLElement {
    // fields/attributes
    #currentPage = '';

    // constructor
    constructor() {
        super();
        this.attachShadow({ mode: "open"});
        this.render();
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
                } else {
                    //pageTab.setAttribute("class", "navbar-brand active");
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
                }
                .nav-item:hover {
                    background-color: #bb0f00;
                    color: white;
                }
                .navbar-brand.active {
                    background-color: #003176;
                }
            </style>
            <nav class="navbar navbar-expand-lg my-0 py-0 sticky-top">
                <div class="container-fluid">
                    <a id="index.html" class="navbar-brand" href="/index.html">
                        <img 
                            src="https://lh3.googleusercontent.com/tyq4-F2H9R5u9VQvquALlMpbJObqgVO-beWDeKu6UtilcCowVyRXj-3c5AJ8HUngDNlb018VK8ozGk3WMGL96nI0TVKx9CdQ3_xEKqycqCJd8aR4FjdpHUXVa3opqnN_8p7BYd0Kjnw=w2400"
                            alt="GPA Logo" height="30" class="d-inline-block align-text-top px-3"
                        >
                    </a>
                    <div class="collapse navbar-collapse">
                        <div class="navbar-nav">
                            <a id="my-course-sequence.html" href="/pages/my-course-sequence.html" class="nav-item nav-link py-3 px-3">My Course Sequence</a>
                            <a id="find-courses.html" href="/pages/find-courses.html" class="nav-item nav-link py-3 px-3">Find Courses</a>
                            <a id="resources.html" href="/pages/resources.html" class="nav-item nav-link py-3 px-3">Resources</a>
                        </div>
                    </div>
                <div>
            </nav>
        `
    }
}
customElements.define('nav-bar', Navbar);