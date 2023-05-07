class Login extends HTMLElement {
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

    login() {

    }

    // setters and getters
    get template() {
        return `
            <style>
                @import url("https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css");
            </style>
            <button class="btn btn-dark" type="button" data-bs-toggle="modal" data-bs-target="#login">
                <span>Login</span>
            </button>
            <div id="login" class="modal fade">
                <form class="modal-content animate" method="post">
                <div class="imgcontainer">
                    <span onclick="document.getElementById('id01').style.display='none'" class="close" title="Close Modal">&times;</span>
            
                </div>
                <div class="container ">
                    <label for="uname"><b>Username</b></label>
                    <input type="text" placeholder="Enter Username" name="uname" required>
            
                    <label for="psw"><b>Password</b></label>
                    <input type="password" placeholder="Enter Password" name="psw" required>
                    <button type="submit">Login</button>
                    <label>
                    <input type="checkbox" checked="checked" name="remember" > Remember me
                    </label>
                </div>  
                <div class="container" style="background-color:#bb0f00">
                    <button type="button" onclick="document.getElementById('id01').style.display='none'" class="cancelbtn">Cancel</button>
                    <span class="psw"> <a href="./pages/password.html">Forgot password?</a></span>
                </div>
                </form>
            </div>  
        `
    }
}
customElements.define('login-modal', Login);