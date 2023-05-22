import Auth from "../auth";

class AddToPlan extends HTMLElement {

    #course;

    // constructor
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.render();
        this.shadowRoot.addEventListener('click', (e) => {
            if (e.target.id === 'modal') {
                this.closeModal();
            } else {
                e.stopPropagation();
            }
        });
    }

    async render() {
        // render template html
        this.shadowRoot.innerHTML = this.style + this.template;
        // get list of plans
        const response = await fetch(
            import.meta.env.VITE_API_BASEURL + "/api/courses/plan",
            { method: "GET", credentials: 'include', mode: "cors" }
        );
        const plans = await response.json();
        // if there aren't any plans, show a create plan modal instead
        if (!plans) {
            this.shadowRoot.innerHTML = this.style + this.createPlanTemplate; 
            // TODO: remember to implement create plan
        } else {
            const content = this.shadowRoot.getElementById('content');
            // iterate through list and attach the plans to the content portion of the modal
            for (let i = 0; i < plans.length; i++) {
                let row = document.createElement('button');
                row.setAttribute('class', 'row px-4 btn btn-dark');
                row.setAttribute('id', plans[i].name);
                // event listener will add a course to 
                row.addEventListener('click', async () => {
                    const request = {
                        plan_name: plans[i].name,
                        courses: [this.#course]
                    };
                    const response = await fetch(
                        import.meta.env.VITE_API_BASEURL + "/api/courses/add-course",
                        {
                            method: "POST", 
                            headers: {
                                "Content-Type": "application/json",
                            },
                            credentials: 'include', 
                            mode: "cors",
                            body: JSON.stringify(request)
                        }
                    );
                    if (response.ok) {
                        this.closeModal();
                    }
                });
                row.innerHTML = plans[i].name;
                content.append(row);
            }
        }
    }

    async createPlan() {

    }

    closeModal() {
        this.shadowRoot.innerHTML = '';
    }

    set course(value) {
        this.#course = value;
    }

    get style() {
        return `
            <style>
                @import url("https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css");
                .modal {
                    display: block;
                    position: fixed; 
                    padding-top: 75px;
                    left: 0; 
                    top: 0;
                    width: 100%;
                    height: 100%; 
                    background-color: rgb(0, 0, 0);
                    background-color: rgba(0, 0, 0, 0.5);
                }
                .modal-head {
                    position: relative; 
                    background-color: #021b2e;
                    border: 2px solid black;
                    border-bottom-style: none;
                    color: white;
                    padding: 20px;
                    margin: auto; 
                    width: 50%;
                }
                .modal-main {
                    position: relative; 
                    background-color: white;
                    border: 2px solid black;
                    border-top-style: none;
                    border-bottom-style: none;
                    padding: 20px;
                    margin: auto; 
                    width: 50%;
                }
                .modal-foot {
                    position: relative; 
                    background-color: white;
                    border: 2px solid black;
                    border-top-style: none;
                    color: red;
                    padding: 10px;
                    margin: auto; 
                    width: 50%;
                }
                .link {
                    color: #bb0f00;
                }
                .btn-dark {
                    background-color: #021b2e;
                    border-color: #021b2e;
                }
                .btn {
                    border-radius: 0;
                }
                .btn:hover {
                    border-color: #021b2e;
                    background-color: #bb0f00;
                }
            </style>
        `;
    }

    get template() {
        return `
            <div id="modal" class="modal">
                <div class="modal-head row"><h2>Choose Which Plan to Add to</h2></div>
                <div id="content" class="modal-main row justify-content-center">
                    <h3>My Plans:</h3>
                </div>
                <div class="modal-foot row"><p id="error"></p></div>
            </div>
        `
    }

    get createPlanTemplate() {
        return `
            <div id="modal" class="modal">
                <div class="modal-head row"><h2>Create a plan</h2></div>
                <div id="content" class="modal-main">
                    <div>Content</div>
                </div>
                <div class="modal-foot row"><p id="error"></p></div>
            </div>
        `
    }
}
customElements.define('addto-plan', AddToPlan);