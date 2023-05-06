class Navbar extends HTMLElement {
    // fields/attributes
    #currentPage

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
                @import url('https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css')
            </style>
            <div class="row">
                <div class="col">
                    <div class="nav">
                    <a
                        class="
                        w3-bar-item
                        w3-button
                        w3-hide-medium
                        w3-hide-large
                        w3-right
                        w3-padding-large
                        hover-accent
                        "
                        href="javascript:void(0);"
                        onclick="myFunction()"
                        title="Toggle Navigation Menu"
                        ><i class="fa fa-bars"></i
                    ></a>
                    <a
                        href="./index.html"
                        class="w3-bar-item w3-button w3-padding-large w3-white"
                        ><b>GPA</b></a
                    >
                    <a
                        href="./pages/my-course-sequence.html"
                        class="
                        w3-bar-item w3-button w3-hide-small w3-padding-large
                        hover-accent
                        "
                        >My Course Sequence</a
                    >
                    <a
                        href="./pages/find-courses.html"
                        class="
                        w3-bar-item w3-button w3-hide-small w3-padding-large
                        hover-accent
                        "
                        >Find Courses</a
                    >
                    <a
                        href="./pages/resources.html"
                        class="
                        w3-bar-item w3-button w3-hide-small w3-padding-large
                        hover-accent
                        "
                        >Resources</a
                    >
                    </div>
                </div>
            </div>
        `
    }

    get smallScreen() {
        return `
            <div id="navSmall" class="w3-bar-block w3-hide w3-hide-large w3-hide-medium w3-large">
                <a
                href="./index.html"
                class="w3-bar-item w3-button w3-padding-large"
                >GPA</a
                >
                <a
                href="./pages/my-course-sequence.html"
                class="w3-bar-item w3-button w3-padding-large"
                >My Course Sequence</a
                >
                <a
                href="./pages/find-courses.html"
                class="w3-bar-item w3-button w3-padding-large"
                >Find Courses</a
                >
                <a
                href="./pages/resources.html"
                class="w3-bar-item w3-button w3-padding-large"
                >Resources</a
                >
            </div>
        `
    }
}
customElements.define('nav-bar', Navbar);