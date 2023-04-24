
class Pagination extends HTMLElement {
    // fields (attributes)
    #currentPage = 0;
    #totalPages = 0;

    // constructor
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.render();
    }

    // methods
    render() {
        this.shadowRoot.innerHTML = this.template;
    }

    // callbacks
    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case 'totalpages':
                this.#totalPages = newValue;
                let listPages = this.shadowRoot.getElementById('pageButtons');
                listPages.innerHTML = '';
                for (let i = 0; i < this.#totalPages; i++) {
                    let pageButton = document.createElement('button');
                    pageButton.value = i + 1;
                    pageButton.setAttribute('class', 'btn');
                    pageButton.innerHTML = `${i + 1}`;
                    listPages.append(pageButton);
                }
                break; 
            case 'currentpage':
                this.#currentPage = newValue;
                break;
        }
    }      

    // getters and setters
    static get observedAttributes() {
        return ["currentpage","totalpages"];
    }

    get currentPage() {
        return this.#currentPage;
    }

    get totalPages() {
        return this.#totalPages;
    }

    get template() {
        return `
            <style>
                @import url('https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css')
            </style>
            <div class="d-flex justify-content-center my-3">
                <button id="firstPage" class="btn"><<</button>
                <div id="pageButtons"></div>
                <button id="lastPage" class="btn">>></button>
            </div>
        `;
    }
}
customElements.define('pagination-element', Pagination);

class CourseInfo extends HTMLElement {
    // fields
    #info = {};

    // constructor
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.addEventListener('click', function () {
            // TODO: make it so clicking this reveals more information about the course
            this.toggleInfo();
        });
        this.render();
    }

    // methods
    render() {
        this.shadowRoot.innerHTML = this.template;
    }

    toggleInfo() {
        let moreInfo = this.shadowRoot.getElementById('moreInfo');
        if (moreInfo.innerHTML === "") {
            moreInfo.innerHTML = this.infoTemplate;
        } else {
            moreInfo.innerHTML = '';
        }
    }

    // getters and setters

    set info(value) {
        this.#info = value;
        this.render();
    }

    get template() {
        return `
            <style>
                @import url('https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css')
            </style>
            <div class="row mb-2 mx-5 px-5 py-2 justify-content-between rounded border">
                <div class="">${this.#info.course_title}</div>
                <div class="">${this.#info.class_time}</div>
            </div>
            <div id="moreInfo" class="row"></div>
        `;
    }

    get infoTemplate() {
        return `
            <div class="row mb-2 mx-5 px-5 py-2 justify-content-between rounded border">
                <div class="">${this.#info.attributes.toString()}</div>
                <div class="">${this.#info.class_time}</div>
            </div>
        `;
    }
}
customElements.define('course-info', CourseInfo);

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
    #numResults = 0;
    #currentPage = 0;
    #pagination = '';

    // constructor
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.render();
        this.#pagination = this.shadowRoot.getElementById('pagination');
    }

    // methods
    render() {
        this.shadowRoot.innerHTML = this.template;
    }

    // getters and setters

    set results(value) {
        this.#results = value;
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
        this.#pagination.setAttribute('totalpages', value);
    }

    get totalPages() {
        return this.#totalPages;
    }

    set numResults(value) {
        this.#numResults = value;
    }

    get numResults() {
        return this.#numResults;
    }

    set currentPage(value) {
        this.#currentPage = value;
        this.#pagination.setAttribute('currentpage', value);
    }

    get currentPage() {
        return this.#currentPage;
    }

    get template() {
        return `
            <style>
                @import url('https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css')
            </style>
            <div id="resultBox"></div>
            <pagination-element id="pagination"></pagination-element>
        `;
    }
}
customElements.define('search-results', SearchResults);