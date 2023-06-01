// this will handle the initial stuff, then this function will call either add or remove depending on what is requested
async function majorModify() {
	const form = document.getElementById('modifyMajorsorMinors'); // fill in the quotes with the form name
	const formData = new FormData(form);
	let errorBox = document.getElementById('error');
	errorBox.innerHTML = '';
	let request = {};
	// get the request info that determines the following:
	// - if it's an add or remove
	// - the name of the program
	// - if it's a major or minor (this might be determined by the ID)
	// also get the user info
	let addOrRemove = '';
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

const selectAddorRemove = document.getElementById("addOrRemove");
const selectMajororMinor = document.getElementById("majorOrMinor");
async function handleAddRemoveOptions() {
	const selectedOption = selectAddorRemove.value;
	// we need to get the ID of the user that's logged in, so we can send it off to the backend to retrieve the degrees the user has
	if (selectedOption === 'remove') {
		const response = await fetch(
			import.meta.env.VITE_API_BASEURL + "/api/degrees/getUserDegrees", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: 'include',
				mode: "cors"
			}
		)
		const data = await response.json();
		if (response.status !== 200) {
			const error = data;
			const errorBox = document.getElementById("errorBox");
			errorBox.innerHTML = error.message;
		}
		else {
			// const data = await response.json();
			for (let i = 0; i < data.length; i++) {
				// console.log(data[i].name);
				document.getElementById("degreePrograms").innerHTML = "<option value=\"" + data[i].name + "\">" + data[i].name + "</option>\n";
			}
		}
	}
	// if it's not remove, doesn't matter since we won't need to change the select options
}
async function handleMajorMinorOptions() {
	const selectedOption = selectMajororMinor.value;
	let curRoute = "";
	if (selectedOption === 'major') {
		curRoute = "getMajors";
	}
	else {
		curRoute = "getMinors";
	}
	const response = await fetch(
		import.meta.env.VITE_API_BASEURL + "/api/degrees/" + curRoute, {
			method: "GET"
		}
	);
	const data = await response.json();
	if (response.status !== 200) {
		const error = data;
		const errorBox = document.getElementById("errorBox");
		errorBox.innerHTML = error.message;
	}
	else {
		// const data = await response.json();
		for (let i = 0; i < data.length; i++) {
			// console.log(data[i].name);
			document.getElementById("degreePrograms").innerHTML = "<option value=\"" + data[i].name + "\">" + data[i].name + "</option>\n";
		}
	}
}

selectAddorRemove.addEventListener('change', (e) => {
	e.preventDefault();
	handleAddRemoveOptions();
})
document.addEventListener('DOMContentLoaded', (e) => {
	e.preventDefault();
	handleMajorMinorOptions();
	handleAddRemoveOptions();
})
selectMajororMinor.addEventListener('change', (e) => {
	e.preventDefault();
	handleMajorMinorOptions();
})
const form = document.getElementById("modifyMajorsorMinors") // this ID will match whatever is at the top of the file
form.addEventListener("submit", async (e) => {
	e.preventDefault();
	await majorModify();
	return;
})
