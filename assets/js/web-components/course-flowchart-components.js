import ('./course-components');

class CoursePlan extends HTMLElement {
    // fields
    #coursePlan;

    // constructor

    constructor() {
        super();
        this.attachShadow({mode: "open"});
        this.render();
    }

    // methods

    render() {
        this.shadowRoot.innerHTML = this.template;
    }

    // getters and setters

    set coursePlan(value) {
        this.#coursePlan = value;
        const numYears = Math.ceil(this.#coursePlan.length / 4);
        // erase existing content
        this.shadowRoot.innerHTML = '';
        for (let i = 1; i <= numYears; i++) {
            let newYear = document.createElement('year-courses');
            newYear.yearName = 'Year ' + i;
            newYear.quarters = this.#coursePlan.splice(0, 4);
            this.shadowRoot.append(newYear);
        }
    }

    get template() {
        return `
        <style>
            @import url('https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css')
        </style>
        <div>No course plan available</div>`
    }
}
customElements.define('course-plan', CoursePlan);

class YearCourses extends HTMLElement {
    // fields
    #yearName = '';
    #quarters;

    // constructor

    constructor() {
        super();
        this.attachShadow({mode: "open"});
        this.render();
    }

    // methods

    render() {
        this.shadowRoot.innerHTML = this.template;
    }

    getQuarterName(quarterNum) {
        switch (quarterNum) {
            case 0:
                return "Autumn";
            case 1:
                return "Winter";
            case 2:
                return "Spring";
            case 3:
                return "Summer";
        }
    }

    // getters and setters

    set quarters(value) {
        this.#quarters = value;
        for (let i = 0; i < this.#quarters.length; i++) {
            let newQtr = document.createElement('qtr-courses');
            newQtr.term = this.getQuarterName(i);
            newQtr.courses = this.#quarters[i];
            this.shadowRoot.append(newQtr);
        }
    }
    set yearName(value) {
        this.#yearName = value;
        this.render();
    }

    get template() {
        return `
        <style>
            @import url('https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css')
        </style>
        <div><h2>${this.#yearName}</h2></div>`
    }
}
customElements.define('year-courses', YearCourses);

class QuarterCourses extends HTMLElement {
    // fields
    #term = '';
    #courses;

    // constructor

    constructor() {
        super();
        this.attachShadow({mode: "open"});
        this.render();
    }

    // methods

    render() {
        this.shadowRoot.innerHTML = this.template;
    }

    // getters and setters

    set term(value) {
        this.#term = value;
        this.render();
    }

    set courses(value) {
        this.#courses = value;
        if (this.#courses.length === 0) {
            let element = document.createElement('div');
            element.setAttribute('class', "row mb-2 mx-5 px-5 py-2 justify-content-center rounded border");
            element.innerHTML = `No courses this quarter`;
            this.shadowRoot.append(element);
        }
        for (let i = 0; i < this.#courses.length; i++) {
            let courseInfo = document.createElement('course-info');
            courseInfo.info = this.#courses[i];
            this.shadowRoot.append(courseInfo);
        }
    }

    get template() {
        return `
        <style>
            @import url('https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css')
        </style>
        <div><h3>${this.#term}</h3></div>`
    }
}
customElements.define('qtr-courses', QuarterCourses);
