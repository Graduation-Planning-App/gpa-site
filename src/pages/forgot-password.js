async function sendResetRequest() {
    const form = document.getElementById('resetForm');
    const formData = new FormData(form);
    let errorBox = document.getElementById('error');
    errorBox.innerHTML = '';
    // create request JSON
    let request = {
        email: formData.get('email').toString()
    };
    const response = await fetch(
        import.meta.env.VITE_API_BASEURL + "/api/users/request-password-reset", {
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

document.getElementById('submit').onclick = async (e) => {
    e.preventDefault();
    await sendResetRequest(); // add event handler to submit button
} 