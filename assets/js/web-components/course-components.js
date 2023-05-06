class CourseInfo extends HTMLElement {
    // fields
    #info = {};

    // constructor
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.addEventListener('click', function () {
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
                <div class="col-7">${this.#info.course_title}</div>
                <div class="col-4">${this.#info.class_time}</div>
                <div class="col-1"></div>
            </div>
            <div id="moreInfo" class="row mx-5 px-5 justify-content-between"></div>
        `;
    }

    get infoTemplate() {
        return `
            <table class="table mb-2">
                <tbody>
                    <tr class="col">
                        <th scope="row" class="col-3">Credits:</th>
                        <td class="col-3">${this.#info.credits}</td>
                        <th scope="row" class="col-3">CRN:</th>
                        <td class="col-3">${this.#info.crn}</td>
                    </tr>
                    <tr>
                        <th scope="row" class="col-3">Year:</th>
                        <td class="col-3">${this.#info.year}</td>
                        <th scope="row" class="col-3">Term:</th>
                        <td class="col-3">${this.#info.term}</td>
                    </tr>
                    <tr>
                        <th scope="row" class="col-3">Location:</th>
                        <td class="col-3">${this.#info.location}</td>
                        <th scope="row" class="col-3">Instructors:</th>
                        <td class="col-3">${this.#info.instructors ? this.#info.instructors.toString() : 'N/A'}</td>
                    </tr>
                    <tr>
                        <th scope="row" class="col-3">Prerequisites:</th>
                        <td class="col-3">${this.#info.prerequisites}</td>
                        <th scope="row" class="col-3">Corequisites:</th>
                        <td class="col-3">${this.#info.corequisites}</td>
                    </tr>
                    <tr>
                        <th scope="row" class="col-3">Attributes:</th>
                        <td class="col-3">${this.#info.attributes.toString()}</td>
                        <th scope="row" class="col-3">Restrictions:</th>
                        <td class="col-3">${this.#info.restrictions}</td>
                    </tr>
                </tbody>
            </table>
        `;
    }
}
customElements.define('course-info', CourseInfo);