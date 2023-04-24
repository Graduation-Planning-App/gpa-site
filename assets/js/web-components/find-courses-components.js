
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

    // callbacks
    attributeChangedCallback(name, oldValue, newValue) {
        console.log('Custom square element attributes changed.');
        switch (name) {
            case 'totalpages':
                this.#totalPages = newValue;
                break; 
            case 'currentpage':
                this.#currentPage = newValue;
                break;
        }
        this.render();
    }      

    // getters and setters
    static get observedAttributes() {
        return ["currentpage","totalpages"];
    }

    set currentPage(value) {
        this.#currentPage = value;
        this.render();
    }

    get currentPage() {
        return this.#currentPage;
    }

    set totalPages(value) {
        this.#totalPages = value;
        this.render()
    }

    get totalPages() {
        return this.#totalPages;
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
    #pagination = '';

    // constructor
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.render();
        this.#pagination = this.shadowRoot.getElementById('pagination');
        console.log(this.#pagination.currentPage);
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
        console.log('setting currentpage');
        this.#currentPage = value;
        this.#pagination.setAttribute('currentpage', value);
    }

    get currentPage() {
        return this.#currentPage;
    }

    get template() {
        return `
            <h1>Results</h1>
            <div id="resultBox" class="col"></div>
            <pagination-element id="pagination"></pagination-element>
        `;
    }
}
customElements.define('search-results', SearchResults);