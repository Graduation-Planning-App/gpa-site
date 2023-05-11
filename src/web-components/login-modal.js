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

        // configure form
        const loginForm = this.shadowRoot.getElementById('loginForm');
        loginForm.addEventListener("submit", (event) => {
            event.preventDefault();
            this.login();
        });
    }

    displayModal() {
        this.#modal.style.display = "block";
    }

    closeModal() {
        this.#modal.style.display = "none";
    }

    async login() {
        // get form data
        const form = this.shadowRoot.getElementById('loginForm');
        const formData = new FormData(form);
        // create request JSON
        let request = {};
        request.email = formData.get('uname').toString();
        request.password = formData.get('psw').toString();
        // attempt login
        const response = await fetch(
            import.meta.env.VITE_API_BASEURL + "/api/users/login", { 
                method: "POST", 
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include',
                mode: "cors",
                body: JSON.stringify(request)
            }
        );
        if (response.status !== 200) {
            const error = await response.json();
            // put error message into modal footer
            let errorBox = this.shadowRoot.getElementById('error');
            errorBox.innerHTML = '';
            errorBox.innerHTML = error.message;
        } else {
            this.closeModal();
        }
    }

    // setters and getters

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
            <button id="login-btn" class="btn btn-dark" type="button">
                Login
            </button>
            <div id="loginModal" class="modal">
                <div class="modal-head row"><h2>Login</h2></div>
                <div class="modal-main">
                    <form id="loginForm" method="dialog">
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
                                    <input class="checkbox" type="checkbox" checked="checked" name="remember"> Remember me
                                </label>
                                <a class="col-lg-6 link" href="/pages/password.html">Forgot Password?</a>
                            </div>
                            <button id="loginButton" type="submit" class="btn btn-dark">Login</button>
                        </div>
                    </form>
                </div>
                <div class="modal-foot row"><p id="error"></p></div>
            </div>
        `
    }
}
customElements.define('login-modal', LoginModal);