class CreatePlan extends HTMLElement {

    // constructor
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.render();
        this.shadowRoot.addEventListener('click', (e) => {
            e.stopPropagation();
            if (e.target.id === 'modal') {
                this.parentNode.removeChild(this);
            }
        });
        // set up form button
        this.shadowRoot.getElementById('inputForm').onsubmit = async (e) => {
            e.preventDefault();
            await this.createPlan();
        };
    }

    render() {
        // render template html
        this.shadowRoot.innerHTML = this.style + this.template;
    }

    async createPlan() {
        // get form data
        const form = this.shadowRoot.getElementById('inputForm');
        const formData = new FormData(form);
        // create request JSON
        let request = {
            plan_name: formData.get('plan_name').toString(),
            courses: [] // no courses will be added
        };
        // attempt to create a new plan
        const response = await fetch(
            import.meta.env.VITE_API_BASEURL + "/api/courses/plan", { 
                method: "POST", 
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include',
                mode: "cors",
                body: JSON.stringify(request)
            }
        );
        if (!response.ok) {
            this.shadowRoot.getElementById('error').innerHTML = 'Something went wrong; Course Plan could not be created.'
        } else {
            this.parentNode.removeChild(this);
        }
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
                <div class="modal-head row"><h2>Create a plan</h2></div>
                <div id="content" class="modal-main">
                    <form id="inputForm">
                        <div class="row mb-3 justify-content-evenly">
                            <label for="inputName" class="col-form-label col-2">Name:</label>
                            <div class="col">
                            <input class="form-control" id="inputName" type="input" name="plan_name" required>
                            </div>
                        </div>
                        <button id="submitButton" class="btn btn-dark" type="submit">Create Plan</button>
                    </form>
                </div>
                <div class="modal-foot row"><p id="error"></p></div>
            </div>
        `
    }
}
customElements.define('create-plan', CreatePlan);