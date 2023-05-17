async function signup() {
	const form = document.getElementById('signupForm');
	const formData = new FormData(form);
	let errorBox = document.getElementById('error');
	errorBox.innerHTML = '';
	// create request JSON
	let request = {};
	request.email = formData.get('email').toString();
	request.name = formData.get('uname').toString();
	if ((formData.get('psw').toString()).localeCompare(formData.get('psw-repeat').toString()) !== 0) {
		errorBox.innerHTML = 'Passwords do not match!';
		return;
	}
	request.password = formData.get('psw').toString();

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
		errorBox.innerHTML = error.message;
	}
	else {
		window.location.replace("/");
	}
}

const form = document.getElementById("signupForm")
form.addEventListener("submit", async (e) => {
	e.preventDefault();
	await signup();
	return;
})
