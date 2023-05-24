// this will handle the initial stuff, then this function will call either add or remove depending on what is requested
async function majorModify() {
	const form = document.getElementById(''); // fill in the quotes with the form name
	const formData = new FormData(form);
	let errorBox = document.getElementById('error');
	errorBox.innerHTML = '';
	let request = {};
	// get the request info that determines the following:
	// - if it's an add or remove
	// - the name of the program
	// - if it's a major or minor (this might be determined by the ID)
	// also get the user info
	const addOrRemove = '';
	if (request.add) {
		addOrRemove = "add-to-account";
	}
	else {
		addOrRemove = "remove-from-account";
	}
	const response = await fetch(
		import.meta.env.VITE_API_BASEURL + "/api/degrees/" + addOrRemove, {
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

const form = document.getElementById("") // this ID will match whatever is at the top of the file
form.addEventListener("submit", async (e) => {
	e.preventDefault();
	await majorModify();
	return;
})
