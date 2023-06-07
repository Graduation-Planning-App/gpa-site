class DeletePlan extends HTMLElement {
    #planId;

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
        // set up ok button
        this.shadowRoot.getElementById('yes').onclick = async (e) => {
            e.preventDefault();
            await this.deletePlan();
        };
        // set up cancel button
        this.shadowRoot.getElementById('no').onclick = async (e) => {
            e.preventDefault();
            this.parentNode.removeChild(this);
        };
    }

    render() {
        // render template html
        this.shadowRoot.innerHTML = this.style + this.template;
    }

    async deletePlan() {
        const response = await fetch(
            import.meta.env.VITE_API_BASEURL + "/api/courses/plan" + `?plan_id=${this.#planId}`,
            {
                method: "DELETE", 
                credentials: 'include', 
                mode: "cors",
            }
        );
        // this code is here so that the removal is reflected in the course plan sequence on the page
        if (response.ok) {
            window.location.reload();
        }
    }

    set planId(value) {
        this.#planId = value;
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
                <div class="modal-head row"><h2>Delete a Plan</h2></div>
                <div id="content" class="modal-main">
                    <div id="inputForm">
                        <div class="row mb-3 justify-content-evenly">
                            Are You Sure that You Want to Delete This Plan?
                        </div>
                        <div class="d-flex justify-content-evenly">
                            <button id="yes" class="btn btn-dark" type="button">Yes</button>
                            <button id="no" class="btn btn-dark" type="button">Cancel</button>
                        </div>
                    </div>
                </div>
                <div class="modal-foot row"><p id="error"></p></div>
            </div>
        `
    }
}
customElements.define('delete-plan', DeletePlan);