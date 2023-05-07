import './course-components';
class Pagination extends HTMLElement {
    // fields (attributes)
    #currentPage = 1;
    #totalPages = null;
    #pageNumbers = [];
    #buttonContainer = null;

    // constructor
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.render();
        this.#buttonContainer = this.shadowRoot.getElementById('buttonContainer');
    }

    // methods
    render() {
        this.shadowRoot.innerHTML = this.template;
    }

    createButtons() {
        // get page numbers to display
        this.#pageNumbers = this.getPageNumbers(this.#totalPages, 3, this.#currentPage);
        // erase current buttons
        this.#buttonContainer.innerHTML = '';
        // append new buttons to button container
        this.#pageNumbers.forEach(e => {
            const button = document.createElement('button');
            button.className = 'btn';
            button.innerHTML = e;
            button.value = e;
            button.addEventListener('click', () => this.changePage(e) );
            this.#buttonContainer.append(button);
        });
    }

    changePage(value) {
        this.#currentPage = value;
        this.createButtons();
        this.#buttonContainer.dispatchEvent(new CustomEvent('change', {detail: this.#currentPage}));
    }

    getPageNumbers(totalPages, maxPagesShown, currentPage) {
        const median = Math.floor(maxPagesShown / 2);
        let to = maxPagesShown;
        
        if (currentPage + median >= totalPages) {
          to = totalPages;
        } else if (currentPage > median) {
          to = currentPage + median;
        }
        
        let from = Math.max(to - maxPagesShown, 0);
      
        return Array.from({length: Math.min(totalPages, maxPagesShown)}, (_, i) => (i + 1) + from);
    }

    goFirst() {
        this.changePage(1);
    }

    goLast() {
        this.changePage(this.#totalPages);
    }

    goPrev() {
        if (this.#currentPage > 1) {
            this.changePage(this.#currentPage - 1);
        }
    }

    goNext() {
        if (this.#currentPage < this.#totalPages) {
            this.changePage(this.#currentPage + 1);
        }
    }

    // callbacks
    connectedCallback() {
        this.shadowRoot.getElementById('first').addEventListener("click", () => this.goFirst());
        this.shadowRoot.getElementById('prev').addEventListener("click", () => this.goPrev());
        this.shadowRoot.getElementById('next').addEventListener("click", () => this.goNext());
        this.shadowRoot.getElementById('last').addEventListener("click", () => this.goLast());
    }

    onChange = (handler) => {
        this.#buttonContainer.addEventListener('change', handler);
    }

    // setters
    set currentPage(value) {
        this.#currentPage = value;
    }

    set totalPages(value) {
        this.#totalPages = value;
        this.createButtons();
    }

    // getters

    get currentPage() {
        return this.#currentPage;
    }

    get totalPages() {
        return this.#totalPages;
    }

    get template() {
        return `
            <style>
                @import url("https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css");
            </style>
            <div class="d-flex justify-content-center my-3">
                <button id="first" class="btn"><<</button>
                <button id="prev" class="btn">Prev</button>
                <div id="buttonContainer">

                </div>
                <button id="next" class="btn">Next</button>
                <button id="last" class="btn">>></button>
            </div>
        `;
    }
}
customElements.define('pagination-element', Pagination);

export class SearchResults extends HTMLElement {
    // fields (properties)
    #query = {
        "title":"",
        "discipline":"",
        "crn":"", 
        "year":"", 
        "term":"", 
        "credits":"", 
        "attributes":[],
        "start_time":"",
        "end_time":"",
        "instruct_methods":"", 
        "instructors":""
    };
    #results = [];
    #totalPages = 0;
    #currentPage = 0;
    #pagination;

    // constructor
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.#pagination = document.createElement('pagination-element');
        this.render();
    }

    // methods
    render() {
        this.shadowRoot.innerHTML = this.template;
        this.shadowRoot.append(this.#pagination);
    }

    fillResults() {
        // get div to put course results in
        let resultBox = this.shadowRoot.getElementById('resultBox');
        // check if results is empty
        if (this.#results.length === 0) {
            resultBox.innerHTML = `<h2>There are no courses that matched your query</h2>`
        } else {
            // erase current content
            resultBox.innerHTML = "";
            // append course-info elements for each result
            for (let i = 0; i < this.#results.length; i++) {
                let courseInfo = document.createElement('course-info');
                courseInfo.info = this.#results[i];
                resultBox.append(courseInfo);
            }
        }
    }

    async changePage (pageNumber) {
        this.#query.page = pageNumber - 1;
        const response = await fetch(
            import.meta.env.VITE_API_BASEURL + "/api/courses/search?input=" + encodeURIComponent(JSON.stringify(this.#query)),
            { method: "GET" }
        );
        let json = await response.json();
        this.#results = json.rows
        this.#currentPage = json.currentPage + 1;
        this.fillResults();
    }

    // callbacks

    connectedCallback() {
        this.#pagination.onChange(e => this.changePage(e.detail));
    }

    // getters and setters

    set results(value) {
        this.#results = value;
        this.fillResults();
    }

    get results() {
        return this.#results;
    }

    set query(value) {
        this.#query = value;
    }

    get query() {
        return this.#query;
    }

    set totalPages(value) {
        this.#totalPages = value;
        this.#pagination.totalPages = value;
    }

    get totalPages() {
        return this.#totalPages;
    }

    set currentPage(value) {
        this.#currentPage = value;
        this.#pagination.currentPage = value;
    }

    get currentPage() {
        return this.#currentPage;
    }

    get template() {
        return `
            <div id="resultBox"></div>
        `;
    }
}
customElements.define('search-results', SearchResults);