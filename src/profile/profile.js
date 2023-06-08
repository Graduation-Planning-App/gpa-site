// since this page should require login, make sure that user is authenticated
import Auth from '../js/auth';
import CreateGraph  from './flowchart.js';

const auth = new Auth();
const graph = new CreateGraph();

// Gets users course plans on page load and generate flowcharts
document.addEventListener("DOMContentLoaded", async (e) => {
    // make sure that user is logged in
    auth.validateAuth();

    // fill in profile info if user is logged in
    if (auth.isLoggedIn()) {
        const profileInfo = await getProfile();
        let nameElement = document.getElementById("profileName");
        let emailElement = document.getElementById("profileEmail");
        let completedCourses = document.getElementById("completedCourses");
        let degreePrograms = document.getElementById("degreePrograms");
        nameElement.innerHTML = profileInfo.name;
        emailElement.innerHTML = profileInfo.email;

        // populate courses and degrees into lists
        if (profileInfo.courses) {
            const list = document.createElement('ul');
            for (let i = 0; i < profileInfo.courses.length; i++) {
                const element = document.createElement('li');
                element.innerHTML = profileInfo.courses[i];
                list.append(element);
            }
            document.getElementById('completedCourses').append(list);
        } else {
            completedCourses.innerHTML = 'No completed courses';
        }

        if (profileInfo.degreePrograms) {
            const list = document.createElement('ul');
            for (let i = 0; i < profileInfo.degreePrograms.length; i++) {
                const element = document.createElement('li');
                element.innerHTML = profileInfo.degreePrograms[i];
                list.append(element);
            }
            document.getElementById('degreePrograms').append(list);
        } else {
            degreePrograms.innerHTML = 'No degrees added';
        }

        // generate graph 
        //await graph.generateMajor1();

        // set up upload transcript button
        document.getElementById('uploadTranscript').addEventListener('click', async (e) => {
            e.preventDefault();
            await uploadTranscript();
        });

        // set up edit degree programs form
        await setupDegreeForm();

        // add event listener to submit button
        document.getElementById('editDegreeBtn').addEventListener('click', async (e) => {
            e.preventDefault();
            await editMyDegrees();
        });
    }
    return;
});

/**
 * Functions to call API Endpoints
 * 
 */
async function getProfile() {
    const response = await fetch(
        import.meta.env.VITE_API_BASEURL + "/api/users/profile",
        {   
            method: "GET",
            credentials: "include"
        }
    );
    return await response.json();
}

async function getAllMajors() {
    const response = await fetch(
        import.meta.env.VITE_API_BASEURL + "/api/degrees/get-majors",
        {   
            method: "GET",
            credentials: "include"
        }
    );
    return await response.json();
}

async function getMyDegrees() {
    const response = await fetch(
        import.meta.env.VITE_API_BASEURL + "/api/degrees/get-user-degrees",
        {   
            method: "GET",
            credentials: "include"
        }
    );
    return await response.json();
}

async function addMyDegree(id) {
    let request = {degreeId: id}
    const response = await fetch(
		import.meta.env.VITE_API_BASEURL + "/api/degrees/add-to-account", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: 'include',
			mode: "cors",
			body: JSON.stringify(request)
		}
	);
    return await response.json();
}

async function removeMyDegree(id) {
    const response = await fetch(
		import.meta.env.VITE_API_BASEURL + "/api/degrees/remove-from-account?degreeProg="+id, {
			method: "DELETE",
			credentials: 'include',
			mode: "cors",
		}
	);
    return await response.json();
}

async function uploadTranscript() {
    let request = document.getElementById('formFile').files[0];
    const text = await request.text();
    const compCoursesHTML = text.slice(text.lastIndexOf('<TABLE class="dhckDataWB" width="100%">'), text.indexOf('</TABLE>', text.lastIndexOf('<TABLE class="dhckDataWB" width="100%">')) + 8);
    const response = await fetch(
        import.meta.env.VITE_API_BASEURL + "/api/users/upload-transcript", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: 'include',
            mode: "cors",
            body: JSON.stringify({fileContents: compCoursesHTML})
        }
    );
    return await response.json();
}

/**
 *  Functions for page logic and form submissions
 */

async function editMyDegrees() {
    // get form data
    const form = document.getElementById('editDegreeForm'); // fill in the quotes with the form name
	const formData = new FormData(form);
    const addOrRem = formData.get('addOrRemove');
    const programId = formData.get('degreeProgramOptions');
    // call the desired api endpoint
    if (addOrRem === 'add') {
        await addMyDegree(programId);
    } else {
        await removeMyDegree(programId);
    }

    // reload page to show changes
    window.location.reload();
}

// sets up the logic for "Edit My Degree Programs" form
async function setupDegreeForm() {
    // Default option (Add)
    const programs = await getAllMajors();
    let degProgOptions = document.getElementById('degreeProgramOptions');
    for (let i = 0; i < programs.length; i++) {
        let option = document.createElement('option');
        option.value = programs[i].id;
        option.innerHTML = programs[i].name;
        degProgOptions.append(option);
    }
    // Add event listener
    document.getElementById('addOrRemove').addEventListener('change', async (e) => {
        // prevent default action
        e.preventDefault();
        let options = document.getElementById("degreeProgramOptions");
        // if value is remove, get all profile degree programs
        if (e.target.value === 'remove') {
            const myPrograms = await getMyDegrees();
            // populate the degreePrograms group with the response
            options.innerHTML = '';
            for (let i = 0; i < myPrograms.length; i++) {
                let option = document.createElement('option');
                option.value = myPrograms[i].id;
                option.innerHTML = myPrograms[i].name;
                options.append(option);
            }
        } else { // if value is add, get all degree programs
            const degPrograms = await getAllMajors();
            // populate the degreePrograms group with the response
            options.innerHTML = '';
            for (let i = 0; i < degPrograms.length; i++) {
                let option = document.createElement('option');
                option.value = degPrograms[i].id;
                option.innerHTML = degPrograms[i].name;
                options.append(option);
            }
        }
    });
}