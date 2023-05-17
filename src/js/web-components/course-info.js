import Auth from "../auth";

class CourseInfo extends HTMLElement {
    // fields
    #info = {};
    #component;
    #planId;

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

    addToPlan() {
        console.log('add ', this.#info.id);
    }

    removeFromPlan() {
        console.log('remove ', this.#info.id, ' from ', this.#planId);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        // make sure that the user is signed in so that they can use the buttons
        const auth = new Auth();
        if (name === 'component') {
            if ((oldValue !== newValue) && auth.isLoggedIn()) {
                const button = this.shadowRoot.getElementById('edit-course-plan');
                switch (newValue) {
                    case 'find-course':
                        // place an add to plan btn in the component
                        let addBtn = document.createElement('button');
                        addBtn.type = 'button';
                        addBtn.setAttribute('class', 'btn btn-dark');
                        addBtn.innerHTML = 'Add to Plan';
                        button.append(addBtn);
                        button.addEventListener('click', () => this.addToPlan());
                        break;
                    case 'course-plan':
                        // hide the add button if this is on the course-plan page
                        let remBtn = document.createElement('button');
                        remBtn.type = 'button';
                        remBtn.setAttribute('class', 'btn btn-dark');
                        remBtn.innerHTML = 'Remove';
                        button.append(remBtn);
                        button.addEventListener('click', () => this.removeFromPlan());
                        break;
                }
            }
        }
    }

    // getters and setters

    static get observedAttributes() {
        return ["component"];
    }

    set info(value) {
        this.#info = value;
        this.render();
    }

    set planId(value) {
        this.#planId = value;
    }

    set component(value) {
        this.#component = value;
        this.render();
    }

    get component() {
        return this.#component;
    }

    get template() {
        return `
            <style>
                @import url("https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css");
                @import url("../css/main.css");
            </style>
            <div class="row mb-2 mx-5 px-5 py-2 justify-content-between rounded border">
                <div class="col-6">${this.#info.course_title ? this.#info.course_title : 'N/A'}</div>
                <div class="col-4">${this.#info.class_time ? this.#info.class_time : 'N/A'}</div>
                <div id="edit-course-plan" class="col-2"></div>
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
                        <td class="col-3">${this.#info.credits ? this.#info.credits : 'N/A'}</td>
                        <th scope="row" class="col-3">CRN:</th>
                        <td class="col-3">${this.#info.crn ? this.#info.crn : 'N/A'}</td>
                    </tr>
                    <tr>
                        <th scope="row" class="col-3">Year:</th>
                        <td class="col-3">${this.#info.year ? this.#info.year : 'N/A'}</td>
                        <th scope="row" class="col-3">Term:</th>
                        <td class="col-3">${this.#info.term ? this.#info.term : 'N/A'}</td>
                    </tr>
                    <tr>
                        <th scope="row" class="col-3">Location:</th>
                        <td class="col-3">${this.#info.location ? this.#info.location : 'N/A'}</td>
                        <th scope="row" class="col-3">Instructors:</th>
                        <td class="col-3">${this.#info.instructors ? this.#info.instructors.toString() : 'N/A'}</td>
                    </tr>
                    <tr>
                        <th scope="row" class="col-3">Prerequisites:</th>
                        <td class="col-3">${this.#info.prerequisites ? this.#info.prerequisites : 'N/A'}</td>
                        <th scope="row" class="col-3">Corequisites:</th>
                        <td class="col-3">${this.#info.corequisites ? this.#info.corequisites : 'N/A'}</td>
                    </tr>
                    <tr>
                        <th scope="row" class="col-3">Attributes:</th>
                        <td class="col-3">${this.#info.attributes.toString() ? this.#info.attributes.toString() : 'N/A'}</td>
                        <th scope="row" class="col-3">Restrictions:</th>
                        <td class="col-3">${this.#info.restrictions ? this.#info.restrictions : 'N/A'}</td>
                    </tr>
                </tbody>
            </table>
        `;
    }
}
customElements.define('course-info', CourseInfo);