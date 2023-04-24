
class Pagination extends HTMLElement {
    // fields (attributes)
    #currentPage = '';
    #totalPages = '';

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

    // getters and setters

    set currentPage(value) {
        this.currentPage = value;
    }

    set totalPages(value) {
        this.totalPages = value;
    }

    get template() {
        return `
            <div class="row justify-content-evenly">
                <h3>${this.#currentPage || 'Placeholder'}</h3>
                <h4>${this.#totalPages || 'Placeholder'}</h4>
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
            console.log(this.#info.course_title);
        });
        this.render();
    }

    // methods
    render() {
        this.shadowRoot.innerHTML = this.template;
    }

    // getters and setters

    set info(value) {
        this.#info = value;
        this.render();
    }

    get template() {
        return `
            <div class="row justify-content-evenly">
                <h2>${this.#info.course_title}</h2>
                <h3>${this.#info.class_time}</h3>
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
        console.log('setting totalpages');
        this.#totalPages = value;
        let pagination = this.shadowRoot.getElementById('pagination');
        pagination.innerHTML = '';
        let pageInfo = document.createElement('pagination-element');
        pageInfo.currentPage = this.#currentPage;
        pageInfo.totalPages = this.#totalPages;
        pagination.append(pageInfo);
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
        console.log('setting currentpage');
        this.#currentPage = value;
        let pagination = this.shadowRoot.getElementById('pagination');
        pagination.innerHTML = '';
        let pageInfo = document.createElement('pagination-element');
        pageInfo.currentPage = this.#currentPage;
        pageInfo.totalPages = this.#totalPages;
        pagination.append(pageInfo);
    }

    get currentPage() {
        return this.#currentPage;
    }

    get template() {
        return `
            <h1>Results</h1>
            <div id="resultBox" class="col"></div>
            <div id="pagination" class="row"></div>
        `;
    }
}
customElements.define('search-results', SearchResults);