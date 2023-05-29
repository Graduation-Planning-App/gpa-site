async function sendReset(token, email) {
    const form = document.getElementById('resetForm');
    const formData = new FormData(form);
    let errorBox = document.getElementById('error');
    errorBox.innerHTML = '';
    // Validate Password
    if ((formData.get('psw').toString()).localeCompare(formData.get('psw-repeat').toString()) !== 0) {
		errorBox.innerHTML = 'Passwords do not match!';
		return;
	}
    // create request JSON
    let request = {
        token: token.toString(),
        email: email.toString(),
        password: formData.get('psw').toString()
    };
    const response = await fetch(
        import.meta.env.VITE_API_BASEURL + "/api/users/reset-password", {
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

document.addEventListener('DOMContentLoaded', (e) => {
    const params = new URLSearchParams(window.location.search);
    document.getElementById('submit').onclick = async (e) => {
        e.preventDefault();
        await sendReset(params.get('token'), params.get('email'));
    }
});