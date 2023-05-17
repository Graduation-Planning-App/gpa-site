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
            }
        });
    }

    render() {
        this.shadowRoot.innerHTML = this.style + this.template;
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
                    display: none;
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
                <div class="modal-main">
                    <div>Content</div>
                </div>
                <div class="modal-foot row"><p id="error"></p></div>
            </div>
        `
    }
}
customElements.define('addto-plan', QuarterCourses);