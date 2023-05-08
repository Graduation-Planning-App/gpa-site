class LoginModal extends HTMLElement {
    // fields / attributes
    #modal;

    // constructor
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.render();
    }
    // methods
    render() {
        // set content
        this.shadowRoot.innerHTML = this.style + this.template;

        // set and configure button
        const button = this.shadowRoot.getElementById('login-btn');
        button.addEventListener('click', () => this.displayModal());

        // assign modal to field since it is used in multiple functions
        this.#modal = this.shadowRoot.getElementById('loginModal');

        // closes the modal when clicking outside of it
        this.#modal.addEventListener('click', (e) => {
            if (e.target.id === 'loginModal') {
                this.closeModal();
            }
        });
    }

    displayModal() {
        this.#modal.style.display = "block";
    }

    closeModal() {
        this.#modal.style.display = "none";
    }

    login() {

    }

    // setters and getters

    get style() {
        return `
            <style>
                @import url("https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css");
                @import url("/assets/css/main.css");
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
                    padding: 20px;
                    margin: auto; 
                    width: 50%;
                }
            </style>
        `;
    }

    get template() {
        return `
            <button id="login-btn" class="btn btn-dark" type="button">
                Login
            </button>
            <div id="loginModal" class="modal">
                <div class="modal-head row"><h2>Login</h2></div>
                <div class="modal-main">
                    <form>
                        <div class="row mb-3 px-5">
                            <div class="row mb-3">
                                <label for="uname" class="col-form-label col-xxl-2"><b>Email</b></label>
                                <input type="text" class="form-control col" placeholder="Enter Your Email" name="uname" required>
                            </div>
                            <div class="row mb-3">
                                <label for="psw" class="col-form-label col-xxl-2"><b>Password</b></label>
                                <input type="password" class="form-control col" placeholder="Enter Password" name="psw" required>
                            </div>
                            <div class="row mb-3">
                                <label class="col-lg-6">
                                    <input type="checkbox" checked="checked" name="remember"> Remember me
                                </label>
                                <a class="col-lg-6" href="/pages/password.html">Forgot Password?</a>
                            </div>
                            <button type="submit" class="btn btn-dark">Login</button>
                        </div>
                    </form>
                </div>
            </div>
        `
    }
}
customElements.define('login-modal', LoginModal);