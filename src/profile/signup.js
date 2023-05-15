class SignUpForm {
	constructor() {
		super();
		this.render();
	}
	render() {
		const signupForm = this.shadowRoot.getElementById('signupForm');
		signupForm.addEventListener("submit", signup);
	}

	async signup() {
		const form = this.shadowRoot.getElementById('signupForm');
		const formData = new FormData(form);
		// create request JSON
		let request = {};
		request.email = formData.get('email').toString();
		request.username = formData.get('uname').toString();
		request.password = formData.get('psw').toString();
		request.passwordRep = formData.get('psw-repeat').toString();

		const response = await fetch(
			import.meta.env.VITE_API_BASEURL + "/api/users/register", {
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
			// error message
			let errorBox = this.shadowRoot.getElementById('error');
			errorBox.innerHTML = '';
			errorBox.innerHTML = error.message;
		}
		else {
			// unsure about this code here
			window.location.replace("/");
		}
		console.log("test");
	}
}
